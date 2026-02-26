
-- Drop restrictive RLS policies and allow public read access since auth is removed
DROP POLICY IF EXISTS "Owners can read own leads" ON public.leads;
CREATE POLICY "Public read leads" ON public.leads FOR SELECT USING (true);
