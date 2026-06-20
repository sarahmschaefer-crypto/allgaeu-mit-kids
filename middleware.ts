// middleware.ts — Login-Gate für den Admin-Bereich.
// Schützt /admin/*; nur /admin/login ist frei. Ohne gültiges Cookie → Login.
import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, expectedToken } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Login-Seite (inkl. ihrer Server-Action) immer durchlassen.
  if (pathname.startsWith('/admin/login')) return NextResponse.next()

  const expected = await expectedToken()

  // ADMIN_PASSWORD nicht gesetzt: lokal (dev) durchlassen, in Produktion sperren.
  if (!expected) {
    if (process.env.NODE_ENV !== 'production') return NextResponse.next()
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  if (req.cookies.get(ADMIN_COOKIE)?.value === expected) return NextResponse.next()

  const url = new URL('/admin/login', req.url)
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*'],
}
