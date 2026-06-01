import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/posts/new', '/me']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // @supabase/ssr 이 사용하는 쿠키 이름 패턴
  const cookies = req.cookies.getAll()
  const hasSession = cookies.some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))

  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/posts/new', '/me'],
}