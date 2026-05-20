-- ==============================================
-- Migration: add_posts_rls
-- Purpose: Enable Row Level Security on `posts` and create SELECT/INSERT/UPDATE/DELETE policies
-- IMPORTANT: Do NOT run this file directly here; manage via supabase CLI and test in a staging DB first.
-- ==============================================

-- 1) Enable RLS on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 2) SELECT: anyone can read
DROP POLICY IF EXISTS allow_select_posts_public ON public.posts;
CREATE POLICY allow_select_posts_public
	ON public.posts
	FOR SELECT
	USING (true);

-- 3) INSERT: authenticated users only, and inserted user_id must equal auth.uid()
DROP POLICY IF EXISTS allow_insert_posts_authenticated ON public.posts;
CREATE POLICY allow_insert_posts_authenticated
	ON public.posts
	FOR INSERT
	WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid()::uuid);

-- 4) UPDATE: only owner can update; user_id must remain equal to auth.uid() after update
DROP POLICY IF EXISTS allow_update_posts_owner ON public.posts;
CREATE POLICY allow_update_posts_owner
	ON public.posts
	FOR UPDATE
	USING (user_id = auth.uid()::uuid)
	WITH CHECK (user_id = auth.uid()::uuid);

-- 5) DELETE: only owner can delete
DROP POLICY IF EXISTS allow_delete_posts_owner ON public.posts;
CREATE POLICY allow_delete_posts_owner
	ON public.posts
	FOR DELETE
	USING (user_id = auth.uid()::uuid);

-- Notes:
-- - This migration includes DROP POLICY IF EXISTS to avoid duplicate policy creation. If you have
--   custom policies with the same names, remove the DROP lines or reconcile manually.
-- - Ensure posts.user_id is UUID (schema shows UUID). If user_id is text, remove ::uuid casts.
-- - Prefer testing in a staging DB before applying to production.