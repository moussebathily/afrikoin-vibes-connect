-- Row Level Security (RLS) Policies for AfriKoin Vibes Connect
-- These policies ensure users can only access their own data and public content

-- ============================================
-- Users Table Policies
-- ============================================

CREATE POLICY "Users can view all public profiles"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- Posts Table Policies
-- ============================================

CREATE POLICY "Anyone can view public posts"
  ON public.posts FOR SELECT
  USING (
    visibility = 'public' OR
    user_id = auth.uid() OR
    user_id IN (
      SELECT following_id FROM public.follows
      WHERE follower_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Likes Table Policies
-- ============================================

CREATE POLICY "Anyone can view likes"
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "Users can create likes"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Comments Table Policies
-- ============================================

CREATE POLICY "Anyone can view comments on public posts"
  ON public.comments FOR SELECT
  USING (
    post_id IN (
      SELECT id FROM public.posts
      WHERE visibility = 'public' OR user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Follows Table Policies
-- ============================================

CREATE POLICY "Users can view follow relationships"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Users can create follows"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can update their follows"
  ON public.follows FOR UPDATE
  USING (auth.uid() = follower_id);

CREATE POLICY "Users can delete their follows"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================
-- Notifications Table Policies
-- ============================================

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Wallets Table Policies
-- ============================================

CREATE POLICY "Users can view their own wallet"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their wallet"
  ON public.wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
  ON public.wallets FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Transactions Table Policies
-- ============================================

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their transaction details"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Conversations Table Policies
-- ============================================

CREATE POLICY "Users can view conversations they participate in"
  ON public.conversations FOR SELECT
  USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = ANY(participant_ids));

CREATE POLICY "Users can update conversations they participate in"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = ANY(participant_ids));

-- ============================================
-- Messages Table Policies
-- ============================================

CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE auth.uid() = ANY(participant_ids)
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE auth.uid() = ANY(participant_ids)
    )
  );

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- AI Moderation Table Policies
-- ============================================

CREATE POLICY "Admins can view moderation records"
  ON public.ai_moderation FOR SELECT
  USING (
    user_id IN (SELECT id FROM public.users WHERE is_admin = true)
  );

CREATE POLICY "Service can insert moderation records"
  ON public.ai_moderation FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update moderation records"
  ON public.ai_moderation FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true)
  );

-- ============================================
-- AI Thumbnails Table Policies
-- ============================================

CREATE POLICY "Anyone can view AI thumbnails for public posts"
  ON public.ai_thumbnails FOR SELECT
  USING (
    post_id IN (
      SELECT id FROM public.posts WHERE visibility = 'public'
    )
  );

CREATE POLICY "Service can insert thumbnails"
  ON public.ai_thumbnails FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Analytics Table Policies
-- ============================================

CREATE POLICY "Users can view their own analytics"
  ON public.analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert analytics"
  ON public.analytics FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Grants for Service Role
-- ============================================

GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.posts, public.likes, public.comments, public.follows TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.wallets, public.transactions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.messages, public.conversations TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
