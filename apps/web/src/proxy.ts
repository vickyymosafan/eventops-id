import { NextResponse, type NextRequest } from 'next/server';
import {
  DEFAULT_WORKSPACE_PATH,
  MOCK_SESSION_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  isAuthRoute,
  isProtectedRoute,
} from '@/lib/auth/session';
import { clientEnv } from '@/lib/env';

/**
 * Konvensi Next.js 16 proxy.ts (pengganti middleware.ts).
 * Mengelola penjagaan rute terautentikasi dan pengalihan sesi mock saat mode frontend-first.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasBackendCookie = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  const hasMockCookie =
    clientEnv.useMockApi &&
    request.cookies.get(MOCK_SESSION_COOKIE_NAME)?.value === 'active';
  const isAuthenticated = hasBackendCookie || hasMockCookie;

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_WORKSPACE_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
