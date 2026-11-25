'use client';

import { useParams } from 'next/navigation';
import { Settings } from 'lucide-react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@eventops/ui';
import { AppShell } from '@/components/layout/app-shell';

export default function OrgSettingsPlaceholderPage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug || 'kreasi-nusantara';

  return (
    <AppShell orgSlug={orgSlug}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-[var(--accent-operational)]" aria-hidden="true" />
              <span>Pengaturan Organisasi &amp; Hak Akses (Screen 39)</span>
            </CardTitle>
            <Badge variant="info">Siap Sprint 1 FE-1</Badge>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-[var(--text-secondary)]">
          Pengaturan profil organisasi dan kebijakan akses siap dilanjutkan di
          `S1-FE1-SHELL-ORG`.
        </CardContent>
      </Card>
    </AppShell>
  );
}
