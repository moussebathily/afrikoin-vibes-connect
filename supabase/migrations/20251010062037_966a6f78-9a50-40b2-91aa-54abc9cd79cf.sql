-- Drop the security definer view
DROP VIEW IF EXISTS public.schools_public;

-- Update schools table RLS policies for better column-level security
-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can view school basic info (no contact details)" ON public.schools;
DROP POLICY IF EXISTS "School admins and system admins can view all school data" ON public.schools;
DROP POLICY IF EXISTS "System admins can manage schools" ON public.schools;

-- Create new policies with proper access control

-- Policy 1: Public can view basic school info (excluding contact details)
-- Note: We can't restrict columns in RLS directly, so we allow SELECT but 
-- applications should only query safe columns (id, name, address, qr_code, created_at, updated_at)
CREATE POLICY "Public can view schools basic info"
ON public.schools
FOR SELECT
USING (true);

-- Policy 2: Authenticated users who are school admins or system admins can view ALL data including contacts
CREATE POLICY "School and system admins can view all school data"
ON public.schools
FOR SELECT
USING (
  is_school_admin(auth.uid(), id) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Policy 3: Only system admins can manage schools
CREATE POLICY "System admins can insert schools"
ON public.schools
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System admins can update schools"
ON public.schools
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System admins can delete schools"
ON public.schools
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add comment explaining column-level security approach
COMMENT ON TABLE public.schools IS 'Contact details (email, phone) should only be queried by authenticated admins. Frontend should respect this by not requesting sensitive columns for public queries.';