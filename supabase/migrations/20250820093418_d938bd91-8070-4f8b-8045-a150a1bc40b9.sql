-- Fix security warnings: Set immutable search_path for all functions

-- Fix update_like_credits_updated_at function
CREATE OR REPLACE FUNCTION public.update_like_credits_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix create_initial_like_credits function
CREATE OR REPLACE FUNCTION public.create_initial_like_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.like_credits (user_id, balance)
  VALUES (NEW.id, 10);
  RETURN NEW;
END;
$$;

-- Fix update_user_balance function
CREATE OR REPLACE FUNCTION public.update_user_balance(user_id uuid, available_change numeric DEFAULT 0, pending_change numeric DEFAULT 0)
RETURNS TABLE(available_balance numeric, pending_balance numeric, total_balance numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_available DECIMAL(15,2);
  new_pending DECIMAL(15,2);
BEGIN
  UPDATE public.user_balances 
  SET 
    available_balance = available_balance + available_change,
    pending_balance = pending_balance + pending_change,
    last_updated = now()
  WHERE user_balances.user_id = update_user_balance.user_id
  RETURNING 
    available_balance,
    pending_balance,
    total_balance
  INTO new_available, new_pending;
  
  IF new_available < 0 OR new_pending < 0 THEN
    RAISE EXCEPTION 'Insufficient balance. Available: %, Pending: %', new_available, new_pending;
  END IF;
  
  RETURN QUERY SELECT new_available, new_pending, new_available + new_pending;
END;
$$;