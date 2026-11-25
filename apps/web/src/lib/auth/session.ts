export const SESSION_COOKIE_NAME = 'eventops_session';
export const MOCK_SESSION_COOKIE_NAME = 'eventops_mock_session';
export const DEFAULT_WORKSPACE_PATH = '/orgs/kreasi-nusantara/overview';

const AUTH_PATHS = ['/login', '/register'];
const PROTECTED_PREFIXES = ['/me', '/orgs', '/onboarding'];

export function isAuthRoute(pathname: string): boolean {
  return AUTH_PATHS.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function getSafeRedirectPath(rawRedirect: string | null): string {
  if (!rawRedirect || !rawRedirect.startsWith('/') || rawRedirect.startsWith('//')) {
    return DEFAULT_WORKSPACE_PATH;
  }
  return rawRedirect;
}
