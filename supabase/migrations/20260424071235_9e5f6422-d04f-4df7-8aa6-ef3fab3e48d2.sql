-- Premium activity log table
CREATE TABLE IF NOT EXISTS public.seller_premium_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  seller_id UUID,
  event_type TEXT NOT NULL CHECK (event_type IN ('payment','webhook','cancellation','renewal','expiration','manual','reactivation')),
  source TEXT,
  plan TEXT,
  amount NUMERIC,
  currency TEXT DEFAULT 'XOF',
  payment_method TEXT,
  previous_status TEXT,
  new_status TEXT,
  premium_until TIMESTAMPTZ,
  message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_premium_activity_user_created
  ON public.seller_premium_activity (user_id, created_at DESC);

ALTER TABLE public.seller_premium_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sellers can view their premium activity" ON public.seller_premium_activity;
CREATE POLICY "Sellers can view their premium activity"
ON public.seller_premium_activity
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Insert restricted to service_role (edge functions). No INSERT policy for authenticated.

-- Realtime
ALTER TABLE public.seller_premium_activity REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'seller_premium_activity'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_premium_activity';
  END IF;
END $$;

-- Helper to log activity from edge functions
CREATE OR REPLACE FUNCTION public.log_premium_activity(
  _user_id UUID,
  _event_type TEXT,
  _source TEXT DEFAULT NULL,
  _plan TEXT DEFAULT NULL,
  _amount NUMERIC DEFAULT NULL,
  _currency TEXT DEFAULT 'XOF',
  _payment_method TEXT DEFAULT NULL,
  _previous_status TEXT DEFAULT NULL,
  _new_status TEXT DEFAULT NULL,
  _premium_until TIMESTAMPTZ DEFAULT NULL,
  _message TEXT DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id UUID;
  _seller_id UUID;
BEGIN
  SELECT id INTO _seller_id FROM public.seller_profiles WHERE user_id = _user_id LIMIT 1;
  INSERT INTO public.seller_premium_activity(
    user_id, seller_id, event_type, source, plan, amount, currency,
    payment_method, previous_status, new_status, premium_until, message, metadata
  ) VALUES (
    _user_id, _seller_id, _event_type, _source, _plan, _amount, _currency,
    _payment_method, _previous_status, _new_status, _premium_until, _message, COALESCE(_metadata, '{}'::jsonb)
  )
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;