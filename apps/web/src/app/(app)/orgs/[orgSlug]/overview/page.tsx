'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import type { OrganizationOverview } from '@eventops/contracts/organizations';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  formatRentangJam,
  formatRupiah,
  formatTanggalIndo,
} from '@eventops/ui';
import { AppShell } from '@/components/layout/app-shell';
import { apiClient } from '@/lib/api-client';

function getReadinessBadge(status: 'READY' | 'NEEDS_ATTENTION' | 'BLOCKED') {
  switch (status) {
    case 'READY':
      return <Badge variant="ready">Siap Dilaksanakan</Badge>;
    case 'NEEDS_ATTENTION':
      return <Badge variant="warning">Perlu Perhatian</Badge>;
    case 'BLOCKED':
      return <Badge variant="danger">Terhambat</Badge>;
  }
}

export default function OrganizationOverviewPage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug || 'kreasi-nusantara';

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['organizations', orgSlug, 'overview'] as const,
    queryFn: () =>
      apiClient.get<OrganizationOverview>(
        `/api/v1/organizations/${orgSlug}/overview`,
      ),
  });

  return (
    <AppShell
      orgSlug={orgSlug}
      orgName={data?.organization.name ?? 'Kreasi Nusantara EO'}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">
              Ringkasan Organisasi
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Pantau kesiapan seluruh event aktif, tugas lewat tenggat, dan komitmen anggaran.
            </p>
          </div>
          {data ? <Badge variant="info">{data.quota.planName}</Badge> : null}
        </div>

        {isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item}>
                <CardContent className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="text-sm text-[var(--status-danger)]">
              {error instanceof Error
                ? error.message
                : 'Gagal memuat ringkasan organisasi.'}
            </CardContent>
          </Card>
        ) : data ? (
          <>
            <section
              aria-label="Metrik ringkasan organisasi"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <Card>
                <CardContent className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    Event Aktif
                  </span>
                  <span className="font-mono text-2xl font-bold tabular-nums">
                    {data.metrics.activeEvents}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    Kuota {data.quota.activeEventsUsed}/{data.quota.activeEventsLimit} event
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    Butuh Perhatian
                  </span>
                  <span className="font-mono text-2xl font-bold tabular-nums text-[var(--status-warning)]">
                    {data.metrics.eventsNeedAttention}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    Memiliki blocker / konflik alat
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    Tugas Lewat Tenggat
                  </span>
                  <span className="font-mono text-2xl font-bold tabular-nums text-[var(--status-danger)]">
                    {data.metrics.overdueTasksAcrossOrg}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    Lintas seluruh divisi aktif
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    Total Anggaran Terikat
                  </span>
                  <span className="font-mono text-xl font-bold tabular-nums">
                    {formatRupiah(data.metrics.totalCommittedBudgetIdr)}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {data.quota.membersUsed}/{data.quota.membersLimit} anggota organisasi
                  </span>
                </CardContent>
              </Card>
            </section>

            <Card>
              <CardHeader>
                <CardTitle>Event Mendatang</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {data.upcomingEvents.length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)]">
                    Belum ada event aktif pada organisasi ini.
                  </p>
                ) : (
                  data.upcomingEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex flex-col justify-between gap-3 rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-subtle)]/50 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold">
                            {ev.name}
                          </h2>
                          {getReadinessBadge(ev.readinessStatus)}
                        </div>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          {ev.venueName}, {ev.city} ·{' '}
                          <span className="font-mono tabular-nums">
                            {formatTanggalIndo(ev.startsAt, ev.timezone)} ·{' '}
                            {formatRentangJam(ev.startsAt, ev.endsAt, ev.timezone)}
                          </span>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4 text-xs">
                        <div>
                          <p className="text-[var(--text-secondary)]">Progres Tugas</p>
                          <p className="font-mono font-semibold tabular-nums">
                            {ev.taskCompletionPercent}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--text-secondary)]">Realisasi RAB</p>
                          <p className="font-mono font-semibold tabular-nums">
                            {formatRupiah(ev.actualBudgetIdr)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
