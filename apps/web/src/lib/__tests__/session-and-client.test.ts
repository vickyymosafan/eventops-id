import { describe, expect, it } from 'vitest';
import {
  DEFAULT_WORKSPACE_PATH,
  getSafeRedirectPath,
  isAuthRoute,
  isProtectedRoute,
} from '../auth/session';

describe('apps/web route & redirect security helpers', () => {
  it('classifies protected and auth routes accurately', () => {
    expect(isProtectedRoute('/orgs/kreasi-nusantara/overview')).toBe(true);
    expect(isProtectedRoute('/me/tasks')).toBe(true);
    expect(isProtectedRoute('/onboarding')).toBe(true);
    expect(isProtectedRoute('/')).toBe(false);
    expect(isAuthRoute('/login')).toBe(true);
    expect(isAuthRoute('/register')).toBe(true);
  });

  it('prevents open redirect attacks on login redirect parameter', () => {
    expect(getSafeRedirectPath(null)).toBe(DEFAULT_WORKSPACE_PATH);
    expect(getSafeRedirectPath('https://evil.example.com')).toBe(
      DEFAULT_WORKSPACE_PATH,
    );
    expect(getSafeRedirectPath('//evil.example.com')).toBe(
      DEFAULT_WORKSPACE_PATH,
    );
    expect(getSafeRedirectPath('/orgs/kreasi-nusantara/overview')).toBe(
      '/orgs/kreasi-nusantara/overview',
    );
  });
});
