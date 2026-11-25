import Link from 'next/link';
import { ArrowRight, CalendarCheck2, ShieldCheck, Wallet } from 'lucide-react';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ThemeToggle,
  formatRentangJam,
  formatRupiah,
  formatTanggalIndo,
} from '@eventops/ui';
import { DEFAULT_WORKSPACE_PATH } from '@/lib/auth/session';

export default function HomePage() {
  const sampleDate = '2027-06-20T01:00:00.000Z';
  const sampleEnd = '2027-06-20T02:15:00.000Z';

  return (
    <div className="min-h-dvh bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--brand-primary)] text-xs font-bold text-[var(--brand-primary-fg)]">
              EO
            </span>
            <span className="font-[family-name:var(--font-heading)] text-base font-bold tracking-tight">
              EventOps Indonesia
            </span>
            <Badge variant="ready" className="hidden sm:inline-flex">
              Fondasi FE Siap
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-[6px] bg-[var(--brand-primary)] px-4 text-sm font-medium text-[var(--brand-primary-fg)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-operational)]"
            >
              Masuk Workspace
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
        <section className="grid items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <Badge variant="info" className="w-fit">
              Arsitektur Contract-First · @eventops/contracts + @eventops/ui
            </Badge>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Buat setiap event tertata, terpantau, dan jelas penanggung jawabnya.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Satukan pembagian tugas panitia, linimasa persiapan, rundown hari-H,
              vendor, peminjaman perlengkapan anti-bentrok, anggaran Rupiah, hingga
              check-in QR peserta dalam satu ruang kerja.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-[var(--brand-primary)] px-5 text-sm font-medium text-[var(--brand-primary-fg)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-operational)]"
              >
                <span>Buka Demo Ruang Kerja</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={DEFAULT_WORKSPACE_PATH}
                className="inline-flex h-11 items-center justify-center rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-operational)]"
              >
                Cek Guard Rute (proxy.ts)
              </Link>
            </div>
          </div>

          <Card className="lg:col-span-5">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>Pratinjau Kesiapan Event</CardTitle>
                <Badge variant="ready">Siap Dilaksanakan</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                National Creative Conference 2027 · Jakarta
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-subtle)] p-3">
                  <p className="text-xs text-[var(--text-secondary)]">Pagu Anggaran</p>
                  <p className="mt-1 font-mono text-base font-semibold tabular-nums">
                    {formatRupiah(120_000_000)}
                  </p>
                </div>
                <div className="rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-subtle)] p-3">
                  <p className="text-xs text-[var(--text-secondary)]">Jadwal Pembukaan</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums">
                    {formatRentangJam(sampleDate, sampleEnd, 'ASIA_JAKARTA')}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border-default)] pt-3 text-xs text-[var(--text-secondary)]">
                <span>Tanggal Pelaksanaan</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {formatTanggalIndo(sampleDate, 'ASIA_JAKARTA', 'full')}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col gap-2">
              <CalendarCheck2
                className="h-5 w-5 text-[var(--accent-operational)]"
                aria-hidden="true"
              />
              <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold">
                Multi-Zona Waktu Nusantara
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Formatter tanggal &amp; rentang jam otomatis mendukung WIB, WITA,
                dan WIT dengan penulisan standar EYD.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-2">
              <Wallet
                className="h-5 w-5 text-[var(--accent-operational)]"
                aria-hidden="true"
              />
              <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold">
                Presisi Anggaran Rupiah
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Skema Zod memvalidasi nominal Rupiah bilangan bulat tanpa float
                serta terformat rapi dengan <code>tabular-nums</code>.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-2">
              <ShieldCheck
                className="h-5 w-5 text-[var(--accent-operational)]"
                aria-hidden="true"
              />
              <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold">
                Siap Disambung Backend
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                <code>apiClient</code> memakai kontrak amplop JSON <code>/api/v1</code>{' '}
                dan mode mock terisolasi lewat env <code>NEXT_PUBLIC_USE_MOCK_API</code>.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
