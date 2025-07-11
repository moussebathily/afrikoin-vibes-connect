-- Create function to safely update user balances
CREATE OR REPLACE FUNCTION public.update_user_balance(
  user_id UUID,
  available_change DECIMAL(15,2) DEFAULT 0,
  pending_change DECIMAL(15,2) DEFAULT 0
)
RETURNS TABLE(
  available_balance DECIMAL(15,2),
  pending_balance DECIMAL(15,2),
  total_balance DECIMAL(15,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_available DECIMAL(15,2);
  new_pending DECIMAL(15,2);
BEGIN
  -- Update the balance with atomic operation
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
  
  -- Check if balance would go negative
  IF new_available < 0 OR new_pending < 0 THEN
    RAISE EXCEPTION 'Insufficient balance. Available: %, Pending: %', new_available, new_pending;
  END IF;
  
  -- Return the updated balances
  RETURN QUERY SELECT new_available, new_pending, new_available + new_pending;
END;
$$;