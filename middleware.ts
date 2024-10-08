import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/firebase-admin'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(session, true)
    if (!decodedClaims.admin) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!login|_next/static|_next/image|favicon.ico).*)',
  ],
}