'use client';

import { useParams } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@eventops/ui';
import { AppShell } from '@/components/layout/app-shell';

export default function OrgEventsPlaceholderPage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug || 'kreasi-nusantara';

  return (
    <AppShell orgSlug={orgSlug}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[var(--accent-operational)]" aria-hidden="true" />
              <span>Daftar Event Organisasi (Screen 7)</span>
            </CardTitle>
            <Badge variant="info">Siap Sprint 2 FE-1</Badge>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-[var(--text-secondary)]">
          Rute fondasi telah terdaftar pada App Shell dan terlindungi oleh{' '}
          <code>src/proxy.ts</code>. Implementasi daftar kartu/tabel event dan filter
          berjalan di Sprint 2 (`S2-FE1`).
        </CardContent>
      </Card>
    </AppShell>
  );
}
