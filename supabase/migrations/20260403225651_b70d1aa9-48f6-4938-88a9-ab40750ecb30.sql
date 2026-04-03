
-- Temporary open insert for seeding
CREATE POLICY "Allow anon insert jobs for seed" ON public.jobs FOR INSERT WITH CHECK (true);
