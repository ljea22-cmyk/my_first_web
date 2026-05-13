/**
 * Authentication helpers (client-side)
 * - Uses the browser Supabase client from lib/supabase/client.ts
 * - Exposes simple wrappers that return Supabase responses (data, error)
 * - Does not swallow errors; callers should handle returned errors
 */
import { createBrowserSupabase } from './supabase/client'

type SupabaseResponse<T = any> = Promise<{ data: T | null; error: any }>

/**
 * Sign in with email/password using Supabase `signInWithPassword`.
 * Returns the raw Supabase response so callers can handle errors.
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = createBrowserSupabase()
    const res = await supabase.auth.signInWithPassword({ email, password })
    return res
  } catch (err) {
    return { data: null, error: err }
  }
}

/**
 * Sign up with email/password. Optionally attempts to create a profile row
 * in the `users` table when Supabase returns a user record.
 * Returns the auth response or a combined object when profile upsert is attempted.
 */
export async function signUpWithEmail(email: string, password: string, name?: string) {
  try {
    const supabase = createBrowserSupabase()

  // Use options.data to store name in the auth user metadata per Ch9 guidance
  const signUpRes = await supabase.auth.signUp({ email, password, options: { data: { name } } })

  // Return the raw response so callers can handle confirmation flow / errors
  return signUpRes
  } catch (err) {
    return { data: null, error: err }
  }
}

/**
 * Sign out the current user.
 * Returns the raw Supabase response so callers can handle errors.
 */
export async function signOut() {
  try {
    const supabase = createBrowserSupabase()
    const res = await supabase.auth.signOut()
    return res
  } catch (err) {
    return { data: null, error: err }
  }
}

export default {
  signInWithEmail,
  signUpWithEmail,
  signOut,
}
