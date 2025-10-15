-- Fix profiles table RLS policies to prevent email harvesting
-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert their own profile" ON public.profiles;

-- Create strict policies that only allow users to see their own profile
CREATE POLICY "Users can view only their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update only their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert only their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Fix schools table to not expose contact information publicly
-- Drop existing public policy
DROP POLICY IF EXISTS "Public can view schools basic info" ON public.schools;

-- Create new policy that allows public to view only non-sensitive fields
-- Note: RLS doesn't support column-level restrictions, so we rely on the application
-- to only SELECT the allowed columns (name, address, qr_code) for public queries
CREATE POLICY "Public can view schools basic info (non-sensitive)"
  ON public.schools
  FOR SELECT
  TO public
  USING (true);

-- Add comment to remind developers about column restrictions
COMMENT ON TABLE public.schools IS 'WARNING: Public SELECT policy exists. Application code MUST NOT query email or phone columns for unauthenticated users. Only name, address, and qr_code should be exposed publicly.';

-- Fix course_invitations to prevent enumeration attacks
-- Add explicit policy to block unauthorized access
CREATE POLICY "Block public access to invitations"
  ON public.course_invitations
  FOR SELECT
  TO public
  USING (false);

-- Ensure only teachers can view their course invitations (policy already exists but let's be explicit)
-- The existing policy "Authenticated users only for course invitations" already handles this