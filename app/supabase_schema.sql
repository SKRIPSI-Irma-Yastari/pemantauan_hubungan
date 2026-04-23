-- 1. Create stakeholders table (Needed for some references)
CREATE TABLE IF NOT EXISTS public.stakeholders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  address text,
  contact_person text,
  email text,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create profiles table (Linked to Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text CHECK (role IN ('bpma', 'stakeholder')) NOT NULL DEFAULT 'stakeholder',
  full_name text,
  stakeholder_id uuid REFERENCES public.stakeholders(id), -- Diisi jika role adalah stakeholder
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create surveys table (Missing in previous schema)
CREATE TABLE IF NOT EXISTS public.surveys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  kkks text NOT NULL,
  year integer NOT NULL,
  month text NOT NULL,
  compliance text NOT NULL,
  attendance text NOT NULL,
  response_speed text NOT NULL,
  relationship_rating text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Other core tables
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stakeholder_id uuid REFERENCES public.stakeholders(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  file_url text,
  status text CHECK (status IN ('submitted', 'late', 'reviewed')) DEFAULT 'submitted',
  submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  period text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.meetings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  date timestamp with time zone NOT NULL,
  location text,
  agenda text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id uuid REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
  stakeholder_id uuid REFERENCES public.stakeholders(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('confirmed', 'absent', 'represented')) DEFAULT 'confirmed',
  notes text,
  confirmed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(meeting_id, stakeholder_id)
);

CREATE TABLE IF NOT EXISTS public.communications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stakeholder_id uuid REFERENCES public.stakeholders(id) ON DELETE CASCADE NOT NULL,
  subject text,
  message text,
  direction text CHECK (direction IN ('to_stakeholder', 'from_stakeholder')) NOT NULL,
  sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  responded_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.interaction_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  period text NOT NULL,
  stakeholder_id uuid REFERENCES public.stakeholders(id) ON DELETE CASCADE NOT NULL,
  compliance_score numeric DEFAULT 0,
  meeting_attendance integer DEFAULT 0,
  response_speed numeric,
  participation_level text,
  status text CHECK (status IN ('Harmonis', 'Kurang Harmonis')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cart_evaluations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  period text NOT NULL,
  accuracy numeric,
  precision numeric,
  recall numeric,
  confusion_matrix jsonb,
  tree_structure jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Trigger for New User Profile creation
-- This automatically creates a profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'stakeholder')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Setup RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interaction_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_evaluations ENABLE ROW LEVEL SECURITY;

-- 7. Policies (Development: Permit all for testing, restrict in production)
-- Replace 'true' with proper checks like 'auth.uid() = id' or role checks later
CREATE POLICY "Enable all for profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Enable all for stakeholders" ON public.stakeholders FOR ALL USING (true);
CREATE POLICY "Enable all for surveys" ON public.surveys FOR ALL USING (true);
CREATE POLICY "Enable all for reports" ON public.reports FOR ALL USING (true);
CREATE POLICY "Enable all for meetings" ON public.meetings FOR ALL USING (true);
CREATE POLICY "Enable all for attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Enable all for communications" ON public.communications FOR ALL USING (true);
CREATE POLICY "Enable all for interaction_data" ON public.interaction_data FOR ALL USING (true);
CREATE POLICY "Enable all for cart_evaluations" ON public.cart_evaluations FOR ALL USING (true);
