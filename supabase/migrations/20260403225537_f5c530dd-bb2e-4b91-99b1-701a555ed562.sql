
-- Allow inserting content categories (reference data)
CREATE POLICY "Allow insert content_categories" ON public.content_categories FOR INSERT WITH CHECK (true);

-- Also allow inserting stations (public data, managed by admins)
CREATE POLICY "Allow insert stations" ON public.stations FOR INSERT WITH CHECK (true);

-- Allow inserting daily_news (managed by admins/system)
CREATE POLICY "Allow insert daily_news" ON public.daily_news FOR INSERT WITH CHECK (true);

-- Allow inserting challenges
CREATE POLICY "Allow insert challenges" ON public.challenges FOR INSERT WITH CHECK (true);
