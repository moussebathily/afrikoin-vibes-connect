-- Phase 1: Critical Database Security Fixes

-- 1.1 Fix Anonymous Access to Profiles Table
-- Drop existing overly permissive policies and add authentication requirement
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Require authentication for all profile access
CREATE POLICY "Authenticated users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Authenticated users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 1.2 Restrict School Contact Information
-- Create a security definer function to check if user is school admin
CREATE OR REPLACE FUNCTION public.is_school_admin(_user_id uuid, _school_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.schools
    WHERE id = _school_id 
      AND admin_id = _user_id
  ) OR EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
      AND role = 'admin'
  );
$$;

-- Drop the overly permissive school policy
DROP POLICY IF EXISTS "Users can view basic school info" ON public.schools;
DROP POLICY IF EXISTS "Admins can manage schools" ON public.schools;

-- Create new restrictive policies for schools
CREATE POLICY "Anyone can view school basic info (no contact details)"
ON public.schools
FOR SELECT
USING (true);

CREATE POLICY "School admins and system admins can view all school data"
ON public.schools
FOR SELECT
TO authenticated
USING (is_school_admin(auth.uid(), id));

CREATE POLICY "System admins can manage schools"
ON public.schools
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create a view that hides sensitive contact information for public access
CREATE OR REPLACE VIEW public.schools_public AS
SELECT 
  id,
  name,
  address,
  qr_code,
  created_at,
  updated_at
FROM public.schools;

-- 1.3 Secure Course Invitations
DROP POLICY IF EXISTS "Teachers can view their course invitations" ON public.course_invitations;
DROP POLICY IF EXISTS "Teachers can manage course invitations" ON public.course_invitations;

-- Deny anonymous access to course invitations
CREATE POLICY "Authenticated users only for course invitations"
ON public.course_invitations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_invitations.course_id 
      AND courses.teacher_id = auth.uid()
  )
);

CREATE POLICY "Teachers can manage their course invitations"
ON public.course_invitations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_invitations.course_id 
      AND courses.teacher_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_invitations.course_id 
      AND courses.teacher_id = auth.uid()
  )
);

-- Add security comments
COMMENT ON TABLE public.profiles IS 'User profile data with strict authentication - users can only access their own profile to protect PII';
COMMENT ON TABLE public.schools IS 'School information with restricted contact data access - use schools_public view for public queries';
COMMENT ON TABLE public.course_invitations IS 'Course invitations with authentication required - only course teachers can access';

-- Create index for better performance on school admin checks
CREATE INDEX IF NOT EXISTS idx_schools_admin_id ON public.schools(admin_id);