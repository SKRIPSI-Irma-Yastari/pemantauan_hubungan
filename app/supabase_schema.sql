-- Tabel untuk menyimpan data survey klasifikasi hubungan
CREATE TABLE IF NOT EXISTS public.surveys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  kkks text NOT NULL,
  month text NOT NULL,
  year text NOT NULL,
  compliance text NOT NULL,
  attendance text NOT NULL,
  response_speed text NOT NULL,
  relationship_rating text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel baru untuk menyimpan data input interaksi (numerik dan kualitatif)
CREATE TABLE IF NOT EXISTS public.interaction_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  period text NOT NULL,
  stakeholder text NOT NULL,
  compliance numeric, -- Persentase kepatuhan laporan (0 - 100)
  attendance integer, -- Jumlah kehadiran sesi rapat
  response_speed numeric, -- Kecepatan respon komunikasi dalam hari
  participation text NOT NULL, -- Tingkat partisipasi kegiatan
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup RLS (Row Level Security) agar tabel bisa diakses jika diperlukan
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interaction_data ENABLE ROW LEVEL SECURITY;

-- Policy untuk mengizinkan akses anonim (atau sesuaikan dengan kebutuhan autentikasi aplikasi)
CREATE POLICY "Enable read access for all users" ON public.surveys FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.surveys FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON public.surveys FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.interaction_data FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.interaction_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON public.interaction_data FOR DELETE USING (true);
