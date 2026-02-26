
-- Create cards table to persist digital business cards
CREATE TABLE public.cards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  owner_user_id uuid,
  name text NOT NULL,
  company text NOT NULL DEFAULT '',
  designation text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  template_id text NOT NULL DEFAULT 'gradient',
  primary_color text NOT NULL DEFAULT '#3B82F6',
  accent_color text NOT NULL DEFAULT '#8B5CF6',
  font text NOT NULL DEFAULT 'Plus Jakarta Sans',
  card_type text NOT NULL DEFAULT 'Business',
  is_primary boolean NOT NULL DEFAULT false,
  website text,
  address text,
  linkedin text,
  twitter text
);

-- Enable RLS
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Anyone can read cards (needed for public card sharing)
CREATE POLICY "Public read cards" ON public.cards FOR SELECT USING (true);

-- Anyone can insert cards (since auth is removed for now)
CREATE POLICY "Anyone can insert cards" ON public.cards FOR INSERT WITH CHECK (true);

-- Anyone can update cards (since auth is removed for now)
CREATE POLICY "Anyone can update cards" ON public.cards FOR UPDATE USING (true);

-- Anyone can delete cards (since auth is removed for now)
CREATE POLICY "Anyone can delete cards" ON public.cards FOR DELETE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
