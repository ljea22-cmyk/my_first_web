import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protect a small set of routes by checking for an auth cookie.
// IMPORTANT: This is a minimal template. Configure cookie names to match your Supabase
// authentication storage (for example, when using cookie-based sessions).

const PROTECTED_PATHS = ['/posts/new', '/me']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only run on protected paths
  if (!PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Try common Supabase cookie names. Adjust if you use a different strategy.
  const token = req.cookies.get('sb-access-token')?.value ?? req.cookies.get('sb:token')?.value ?? null

  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    // preserve return URL
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/posts/new', '/me'],
}

// Notes:
// - This middleware uses cookie presence as a heuristic only. For robust protection
//   you still need RLS policies on the database side (already applied via migrations).
// - If your auth uses localStorage-only tokens (not cookies), middleware cannot read them
//   and you'll need a server-side session or cookie strategy to protect routes here.
