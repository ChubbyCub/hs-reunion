import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Only protect /admin and /admin/dashboard (not /admin/login)
  if (
    (pathname.startsWith('/admin') && pathname !== '/admin/login') ||
    pathname === '/admin/dashboard'
  ) {
    const adminAuth = request.cookies.get('admin_auth');
    if (!adminAuth) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 