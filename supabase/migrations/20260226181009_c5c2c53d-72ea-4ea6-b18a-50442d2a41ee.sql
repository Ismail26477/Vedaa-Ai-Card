-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Public read cards" ON public.cards;
DROP POLICY IF EXISTS "Anyone can insert cards" ON public.cards;
DROP POLICY IF EXISTS "Anyone can update cards" ON public.cards;
DROP POLICY IF EXISTS "Anyone can delete cards" ON public.cards;

CREATE POLICY "Public read cards" ON public.cards FOR SELECT USING (true);
CREATE POLICY "Anyone can insert cards" ON public.cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update cards" ON public.cards FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete cards" ON public.cards FOR DELETE USING (true);

-- Fix leads too
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Public read leads" ON public.leads;

CREATE POLICY "Public read leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Fix meetings
DROP POLICY IF EXISTS "Anyone can insert meetings" ON public.meetings;
DROP POLICY IF EXISTS "Owners can read own meetings" ON public.meetings;

CREATE POLICY "Public read meetings" ON public.meetings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert meetings" ON public.meetings FOR INSERT WITH CHECK (true);