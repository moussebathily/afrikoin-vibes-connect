
-- Remove temporary open INSERT policies used for seeding
DROP POLICY IF EXISTS "Allow insert content_categories" ON public.content_categories;
DROP POLICY IF EXISTS "Allow insert stations" ON public.stations;
DROP POLICY IF EXISTS "Allow insert daily_news" ON public.daily_news;
DROP POLICY IF EXISTS "Allow insert challenges" ON public.challenges;
DROP POLICY IF EXISTS "Allow anon insert jobs for seed" ON public.jobs;

-- Replace with admin-only insert policies
CREATE POLICY "Admins can insert content_categories" ON public.content_categories FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert stations" ON public.stations FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert daily_news" ON public.daily_news FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert challenges" ON public.challenges FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
