-- Update like_purchases table schema to support the payment flow

-- Add missing columns
ALTER TABLE public.like_purchases 
  ADD COLUMN IF NOT EXISTS pack_name TEXT,
  ADD COLUMN IF NOT EXISTS product_id TEXT,
  ADD COLUMN IF NOT EXISTS likes_amount INTEGER,
  ADD COLUMN IF NOT EXISTS price_amount INTEGER, -- in cents
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'eur',
  ADD COLUMN IF NOT EXISTS store_type TEXT DEFAULT 'stripe',
  ADD COLUMN IF NOT EXISTS purchase_token TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Migrate existing data if there are any rows
UPDATE public.like_purchases 
SET 
  likes_amount = COALESCE(likes_amount, credits_purchased),
  price_amount = COALESCE(price_amount, (amount * 100)::INTEGER),
  status = COALESCE(status, payment_status),
  purchase_token = COALESCE(purchase_token, stripe_payment_id)
WHERE likes_amount IS NULL OR price_amount IS NULL OR status IS NULL OR purchase_token IS NULL;

-- Make important fields NOT NULL
ALTER TABLE public.like_purchases ALTER COLUMN likes_amount SET NOT NULL;
ALTER TABLE public.like_purchases ALTER COLUMN price_amount SET NOT NULL;
ALTER TABLE public.like_purchases ALTER COLUMN status SET NOT NULL;

-- Add index on purchase_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_like_purchases_token ON public.like_purchases(purchase_token);
CREATE INDEX IF NOT EXISTS idx_like_purchases_user_status ON public.like_purchases(user_id, status);

-- Add check constraint for status values
ALTER TABLE public.like_purchases DROP CONSTRAINT IF EXISTS like_purchases_status_check;
ALTER TABLE public.like_purchases ADD CONSTRAINT like_purchases_status_check 
  CHECK (status IN ('pending', 'paid', 'failed', 'refunded'));

-- Update RLS policies to allow service role to update status
DROP POLICY IF EXISTS "Users can create purchases" ON public.like_purchases;
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.like_purchases;

CREATE POLICY "Users can view their own purchases"
  ON public.like_purchases FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create purchases"
  ON public.like_purchases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Allow service role to update purchase status (for payment verification)
CREATE POLICY "Service role can update purchases"
  ON public.like_purchases FOR UPDATE
  USING (true); -- Service role bypasses RLS anyway, but explicit is good

COMMENT ON TABLE public.like_purchases IS 'Like purchase records with payment tracking - status updated by payment verification edge function';