
-- Add columns to track reminder status
ALTER TABLE public.meetings
  ADD COLUMN IF NOT EXISTS reminder_1day_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_1hour_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS owner_email text;
