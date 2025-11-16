import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define the paths that require authentication
const protectedPaths = ['/generator', '/profile', '/history']

// Define the paths that should redirect to landing page if already authenticated
const authPaths = ['/signIn', '/signUp']

// Define the paths that should be public
const publicPaths = ['/', '/landingPage']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')
  const { pathname } = request.nextUrl

  // Allow public paths without redirection
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if the path requires authentication
  if (protectedPaths.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/signIn', request.url))
    }
  }

  // Redirect to landing page if user is already authenticated and tries to access auth pages
  if (authPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/landingPage', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/landingPage',
    '/generator',
    '/profile',
    '/history',
    '/signIn',
    '/signUp'
  ]
}