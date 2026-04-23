-- Tabel untuk menyimpan data profil pengguna dan role
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text CHECK (role IN ('bpma', 'stakeholder')) NOT NULL DEFAULT 'stakeholder',
  full_name text,
  stakeholder_id uuid, -- Diisi jika role adalah stakeholder
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel untuk menyimpan identitas lengkap KKKS/Kontraktor
CREATE TABLE IF NOT EXISTS public.stakeholders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  address text,
  contact_person text,
  email text,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tambahkan foreign key ke profiles setelah tabel stakeholders dibuat
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_stakeholder FOREIGN KEY (stakeholder_id) REFERENCES public.stakeholders(id);

-- Tabel untuk portal pengiriman laporan stakeholder
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stakeholder_id uuid REFERENCES public.stakeholders(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  file_url text,
  status text CHECK (status IN ('submitted', 'late', 'reviewed')) DEFAULT 'submitted',
  submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  period text NOT NULL -- Periode laporan (e.g., 'Q1 2024')
);

-- Tabel untuk agenda rapat dan konfirmasi kehadiran
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

-- Tabel untuk korespondensi/pusat pesan (mengukur kecepatan respon)
CREATE TABLE IF NOT EXISTS public.communications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stakeholder_id uuid REFERENCES public.stakeholders(id) ON DELETE CASCADE NOT NULL,
  subject text,
  message text,
  direction text CHECK (direction IN ('to_stakeholder', 'from_stakeholder')) NOT NULL,
  sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  responded_at timestamp with time zone -- Jika ini adalah balasan
);

-- Tabel input data interaksi (Parameter untuk CART)
CREATE TABLE IF NOT EXISTS public.interaction_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  period text NOT NULL,
  stakeholder_id uuid REFERENCES public.stakeholders(id) ON DELETE CASCADE NOT NULL,
  compliance_score numeric DEFAULT 0, -- 0-100%
  meeting_attendance integer DEFAULT 0, -- Jumlah kehadiran
  response_speed numeric, -- Hari rata-rata respon
  participation_level text, -- 'High', 'Medium', 'Low'
  status text CHECK (status IN ('Harmonis', 'Kurang Harmonis')), -- Hasil klasifikasi
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel untuk menyimpan hasil evaluasi CART (Confusion Matrix)
CREATE TABLE IF NOT EXISTS public.cart_evaluations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  period text NOT NULL,
  accuracy numeric,
  precision numeric,
  recall numeric,
  confusion_matrix jsonb, -- {tp: 0, tn: 0, fp: 0, fn: 0}
  tree_structure jsonb, -- JSON representasi pohon keputusan
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interaction_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_evaluations ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for development, should be refined for production)
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public read stakeholders" ON public.stakeholders FOR SELECT USING (true);
CREATE POLICY "Admin CRUD stakeholders" ON public.stakeholders FOR ALL USING (true); -- Replace with role check later
CREATE POLICY "Enable all interaction_data" ON public.interaction_data FOR ALL USING (true);
CREATE POLICY "Enable all reports" ON public.reports FOR ALL USING (true);
CREATE POLICY "Enable all meetings" ON public.meetings FOR ALL USING (true);
CREATE POLICY "Enable all attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Enable all communications" ON public.communications FOR ALL USING (true);
CREATE POLICY "Enable all cart_evaluations" ON public.cart_evaluations FOR ALL USING (true);
