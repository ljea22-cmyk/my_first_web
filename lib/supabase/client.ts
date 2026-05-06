/**
 * Supabase browser client for Next.js App Router
 * Uses createBrowserClient from @supabase/ssr and NEXT_PUBLIC_* env vars.
 *
 * Rules followed:
 * - App Router only
 * - Do not use createClient from @supabase/supabase-js directly
 */
import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Avoid throwing during module import (which may run on server). Warn so developer notices.
  // When the helper is invoked in the browser, we'll throw if still missing.
  // eslint-disable-next-line no-console
  console.warn('[lib/supabase/client] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

/**
 * Create and return a Supabase browser client. Throws if called on the server.
 * Use this in Client Components or browser-only code.
 */
export function createBrowserSupabase() {
  if (typeof window === 'undefined') {
    throw new Error('createBrowserSupabase() can only be called in the browser')
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Convenience singleton: created lazily for browser imports that prefer a ready instance.
 * It will be null on the server.
 */
export const supabase = typeof window !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY
  ? createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export default supabase
