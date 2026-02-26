
-- Add user_id to leads so each card owner sees only their leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS owner_user_id UUID;

-- Add user_id to meetings so each card owner sees only their meetings
ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS owner_user_id UUID;

-- Create profiles table to store user card ownership
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Drop old permissive select policies on leads and meetings and replace with owner-scoped ones
DROP POLICY IF EXISTS "Anyone can read leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can read meetings" ON public.meetings;

-- Leads: owner can read their own leads (where owner_user_id matches), public can still insert
CREATE POLICY "Owners can read own leads" ON public.leads FOR SELECT USING (
  owner_user_id IS NULL OR auth.uid() = owner_user_id
);

-- Meetings: owner can read their own meetings
CREATE POLICY "Owners can read own meetings" ON public.meetings FOR SELECT USING (
  owner_user_id IS NULL OR auth.uid() = owner_user_id
);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
