-- Fix Supabase functions with proper search_path
CREATE OR REPLACE FUNCTION public.update_like_credits_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_initial_like_credits()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.like_credits (user_id, balance)
  VALUES (NEW.id, 10);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', 'User')
  );
  
  INSERT INTO public.user_balances (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_balance(user_id uuid, available_change numeric DEFAULT 0, pending_change numeric DEFAULT 0)
 RETURNS TABLE(available_balance numeric, pending_balance numeric, total_balance numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$;