-- Drop overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view reports" ON public.station_reports;

-- Replace with authenticated-only SELECT policy
CREATE POLICY "Authenticated users can view reports"
  ON public.station_reports
  FOR SELECT
  TO authenticated
  USING (true);