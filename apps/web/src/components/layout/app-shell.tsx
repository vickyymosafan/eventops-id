'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Building2,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  QrCode,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { Badge, Button, ThemeToggle, cn } from '@eventops/ui';
import { MOCK_SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { clientEnv } from '@/lib/env';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

/**
 * Slot untuk Bell Notifikasi (akan diisi FE-2 di Sprint 1/2 tanpa ubah AppShell).
 */
export function NotificationBellSlot() {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Notifikasi"
      title="Pusat Notifikasi (siap disambungkan FE-2)"
      className="relative"
    >
      <Bell className="h-4 w-4" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[var(--accent-operational)]"
      />
    </Button>
  );
}

export function AppShell({
  orgSlug,
  orgName = 'Kreasi Nusantara EO',
  children,
}: {
  orgSlug: string;
  orgName?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const drawerRef = React.useRef<HTMLDialogElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const navItems: NavItem[] = [
    {
      href: `/orgs/${orgSlug}/overview`,
      label: 'Ringkasan Organisasi',
      icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: `/orgs/${orgSlug}/events`,
      label: 'Daftar Event',
      icon: <CalendarDays className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: `/orgs/${orgSlug}/members`,
      label: 'Anggota & Peran',
      icon: <Users className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: `/orgs/${orgSlug}/settings`,
      label: 'Pengaturan Organisasi',
      icon: <Settings className="h-4 w-4" aria-hidden="true" />,
    },
  ];

  const openDrawer = () => {
    drawerRef.current?.showModal();
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    drawerRef.current?.close();
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    document.cookie = `${MOCK_SESSION_COOKIE_NAME}=; path=/; max-age=0`;
    router.push('/login');
    router.refresh();
  };

  const renderNavLinks = (onNavigate?: () => void) => (
    <ul className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              onClick={onNavigate}
              className={cn(
                'flex min-h-11 items-center gap-2.5 rounded-[6px] border-l-2 px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent-operational)]',
                active
                  ? 'border-[var(--accent-operational)] bg-[var(--bg-subtle)] font-semibold text-[var(--text-primary)]'
                  : 'border-transparent font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="min-h-dvh bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Mobile Navigation Drawer (<dialog> top-layer sesuai modern-web-guidance) */}
      <dialog
        ref={drawerRef}
        id="mobile-nav-drawer"
        aria-label="Menu navigasi EventOps"
        onClose={() => setDrawerOpen(false)}
        onClick={(e) => {
          if (e.target === drawerRef.current) closeDrawer();
        }}
        className="m-0 h-dvh max-h-none w-72 max-w-[82dvw] border-r border-[var(--border-default)] bg-[var(--bg-surface)] p-0 text-[var(--text-primary)] backdrop:bg-black/50"
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--brand-primary)] text-xs font-bold text-[var(--brand-primary-fg)]">
                  EO
                </span>
                <span className="font-[family-name:var(--font-heading)] text-sm font-bold">
                  EventOps ID
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Tutup menu navigasi"
                onClick={closeDrawer}
                autoFocus
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <nav aria-label="Navigasi utama mobile">{renderNavLinks(closeDrawer)}</nav>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>Keluar Sesi</span>
          </Button>
        </div>
      </dialog>

      <div className="mx-auto flex min-h-dvh max-w-[1440px]">
        {/* Sidebar Desktop */}
        <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-[var(--border-default)] bg-[var(--bg-surface)] p-4 md:flex">
          <div className="flex flex-col gap-5">
            <Link
              href={`/orgs/${orgSlug}/overview`}
              className="flex items-center gap-2.5 rounded-[6px] px-1 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-operational)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--brand-primary)] text-xs font-bold text-[var(--brand-primary-fg)]">
                EO
              </span>
              <div className="min-w-0">
                <p className="truncate font-[family-name:var(--font-heading)] text-sm font-bold">
                  EventOps
                </p>
                <p className="truncate text-xs text-[var(--text-secondary)]">
                  Ruang Kerja Panitia
                </p>
              </div>
            </Link>

            <div className="rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-subtle)] px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                Organisasi Aktif
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm font-semibold">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-[var(--accent-operational)]" aria-hidden="true" />
                <span className="truncate">{orgName}</span>
              </p>
            </div>

            <nav aria-label="Navigasi utama">{renderNavLinks()}</nav>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>Keluar Sesi</span>
          </Button>
        </aside>

        {/* Konten Utama */}
        <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Buka menu navigasi"
                aria-expanded={drawerOpen}
                aria-controls="mobile-nav-drawer"
                onClick={openDrawer}
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="truncate text-sm font-medium text-[var(--text-secondary)]">
                {orgName}
              </span>
              {clientEnv.useMockApi ? (
                <Badge variant="warning" className="hidden sm:inline-flex">
                  Mode Mock FE
                </Badge>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <NotificationBellSlot />
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>

      {/* Mobile Bottom Quick-Bar (khusus akses cepat lapangan min 44x44px) */}
      <nav
        aria-label="Akses cepat lapangan"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)] md:hidden"
      >
        <Link
          href={`/orgs/${orgSlug}/overview`}
          aria-current={pathname.endsWith('/overview') ? 'page' : undefined}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[var(--text-secondary)] aria-[current=page]:font-semibold aria-[current=page]:text-[var(--accent-operational)]"
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          <span>Ringkasan</span>
        </Link>
        <Link
          href={`/orgs/${orgSlug}/events`}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[var(--text-secondary)]"
        >
          <CheckSquare className="h-4 w-4" aria-hidden="true" />
          <span>Event</span>
        </Link>
        <Link
          href={`/orgs/${orgSlug}/members`}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[var(--text-secondary)]"
        >
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          <span>Tim</span>
        </Link>
        <Link
          href={`/orgs/${orgSlug}/settings`}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[var(--text-secondary)]"
        >
          <QrCode className="h-4 w-4" aria-hidden="true" />
          <span>Pengaturan</span>
        </Link>
      </nav>
    </div>
  );
}
