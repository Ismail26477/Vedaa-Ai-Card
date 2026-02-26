
-- Create leads table for contact details shared via public card
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  designation TEXT,
  company TEXT,
  address TEXT,
  address2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  state TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meetings table for booked meetings via public card
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id TEXT NOT NULL,
  title TEXT NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_time TEXT NOT NULL,
  note TEXT,
  booked_by_email TEXT,
  booked_by_name TEXT,
  type TEXT DEFAULT 'meeting',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Public insert policies (anyone visiting a public card can submit)
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert meetings" ON public.meetings FOR INSERT WITH CHECK (true);

-- Public read policies (for now, allow reading all - will restrict when auth is added)
CREATE POLICY "Anyone can read leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Anyone can read meetings" ON public.meetings FOR SELECT USING (true);
