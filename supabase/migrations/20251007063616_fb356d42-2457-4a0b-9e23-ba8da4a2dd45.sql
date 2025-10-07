-- Phase 2: Payment Security - Create atomic database functions

-- Function to atomically credit likes to user balance (used by verify-like-payment)
CREATE OR REPLACE FUNCTION public.credit_likes(
  p_user_id uuid,
  p_likes_amount integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance integer;
BEGIN
  -- Ensure the user has a like_credits record
  INSERT INTO public.like_credits (user_id, balance, total_purchased, total_used)
  VALUES (p_user_id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Atomically update balance and total_purchased
  UPDATE public.like_credits
  SET 
    balance = balance + p_likes_amount,
    total_purchased = total_purchased + p_likes_amount,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING balance INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    RAISE EXCEPTION 'Failed to credit likes for user %', p_user_id;
  END IF;

  RETURN v_new_balance;
END;
$$;

-- Function to atomically decrement like credit (used by like-post)
CREATE OR REPLACE FUNCTION public.decrement_like_credit(
  p_user_id uuid,
  p_post_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance integer;
  v_new_balance integer;
BEGIN
  -- Get current balance with row lock to prevent race conditions
  SELECT balance INTO v_current_balance
  FROM public.like_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Check if user has enough credits
  IF v_current_balance IS NULL OR v_current_balance <= 0 THEN
    RAISE EXCEPTION 'Insufficient credits' USING ERRCODE = 'P0001';
  END IF;

  -- Atomically decrement balance and increment total_used
  UPDATE public.like_credits
  SET 
    balance = balance - 1,
    total_used = total_used + 1,
    updated_at = now()
  WHERE user_id = p_user_id AND balance > 0
  RETURNING balance INTO v_new_balance;

  -- Double-check the update succeeded
  IF v_new_balance IS NULL THEN
    RAISE EXCEPTION 'Failed to decrement like credit for user %', p_user_id;
  END IF;

  -- Return the new balance
  RETURN jsonb_build_object('new_balance', v_new_balance, 'success', true);
END;
$$;

-- Add a unique constraint on like_credits.user_id if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'like_credits_user_id_key'
  ) THEN
    ALTER TABLE public.like_credits ADD CONSTRAINT like_credits_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Add check constraint to prevent negative balance
ALTER TABLE public.like_credits DROP CONSTRAINT IF EXISTS like_credits_balance_check;
ALTER TABLE public.like_credits ADD CONSTRAINT like_credits_balance_check CHECK (balance >= 0);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_like_credits_user_balance ON public.like_credits(user_id, balance);

-- Add security comments
COMMENT ON FUNCTION public.credit_likes IS 'Atomically credits likes to user balance - prevents race conditions during payment verification';
COMMENT ON FUNCTION public.decrement_like_credit IS 'Atomically decrements like credit with row locking - prevents race conditions during like operations';