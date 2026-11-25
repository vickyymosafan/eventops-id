'use client';

import { useParams } from 'next/navigation';
import { Users } from 'lucide-react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@eventops/ui';
import { AppShell } from '@/components/layout/app-shell';

export default function OrgMembersPlaceholderPage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug || 'kreasi-nusantara';

  return (
    <AppShell orgSlug={orgSlug}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--accent-operational)]" aria-hidden="true" />
              <span>Anggota &amp; Undangan Organisasi (Screen 38)</span>
            </CardTitle>
            <Badge variant="info">Siap Sprint 1 FE-1</Badge>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-[var(--text-secondary)]">
          Halaman manajemen anggota organisasi (`OWNER`, `ADMIN`, `MEMBER`) siap
          diisi di `S1-FE1-SHELL-ORG`.
        </CardContent>
      </Card>
    </AppShell>
  );
}
