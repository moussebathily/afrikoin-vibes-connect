-- Fix profiles table RLS to protect user email addresses and PII
-- Drop the overly permissive policy that allows teachers/admins to view all profiles
DROP POLICY IF EXISTS "Teachers and admins can view all profiles" ON public.profiles;

-- The existing "Users can view their own profile" policy already provides the correct access control
-- Users can only view their own profile data (email, full_name, country, etc.)

-- Add a comment explaining the security decision
COMMENT ON TABLE public.profiles IS 'User profile data with restricted access - users can only view their own profile to protect PII like email addresses';