'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginInputSchema, type LoginResponseData } from '@eventops/contracts/auth';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  ThemeToggle,
} from '@eventops/ui';
import { ApiClientError, apiClient, setAccessToken } from '@/lib/api-client';
import {
  MOCK_SESSION_COOKIE_NAME,
  getSafeRedirectPath,
} from '@/lib/auth/session';
import { clientEnv } from '@/lib/env';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = getSafeRedirectPath(searchParams.get('redirect'));

  const [email, setEmail] = React.useState('raka@kreasinusantara.id');
  const [password, setPassword] = React.useState('EventOps2027!');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const performLogin = async (inputEmail: string, inputPassword: string) => {
    setErrorMessage(null);
    const parsed = LoginInputSchema.safeParse({
      email: inputEmail,
      password: inputPassword,
    });

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message ?? 'Input tidak valid');
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiClient.post<LoginResponseData>(
        '/api/v1/auth/login',
        parsed.data,
      );
      setAccessToken(data.accessToken);
      if (clientEnv.useMockApi) {
        document.cookie = `${MOCK_SESSION_COOKIE_NAME}=active; path=/; SameSite=Lax`;
      }
      router.push(redirectTarget);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Gagal masuk ke workspace. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <header className="flex h-16 items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-sm font-bold"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[var(--brand-primary)] text-xs text-[var(--brand-primary-fg)]">
            EO
          </span>
          <span>EventOps Indonesia</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Masuk ke Ruang Kerja</CardTitle>
              {clientEnv.useMockApi ? (
                <Badge variant="warning">Mode Mock FE</Badge>
              ) : null}
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Gunakan akun panitia Anda untuk mengakses organisasi dan event.
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void performLogin(email, password);
              }}
              className="flex flex-col gap-4"
            >
              {errorMessage ? (
                <div
                  role="alert"
                  className="rounded-[6px] border border-[var(--status-danger)]/40 bg-[var(--status-danger-subtle)] px-3 py-2 text-sm text-[var(--status-danger)]"
                >
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Panitia
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  Kata Sandi
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" size="lg" disabled={submitting} className="w-full">
                {submitting ? 'Memproses...' : 'Masuk ke Workspace'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[var(--bg-canvas)] text-sm text-[var(--text-secondary)]">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}
