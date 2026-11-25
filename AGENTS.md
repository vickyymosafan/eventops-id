# AGENTS.md — Kontrak Kolaborasi Tim & Orkestrasi Craftrig

Dokumen ini menjadi sumber aturan utama (*source of truth*) bagi **4 anggota tim manusia (`BE-1`, `BE-2`, `FE-1`, `FE-2`)** maupun **AI Coding Agents / Craftrig Subagents** yang bekerja di repositori **EventOps Indonesia**.

---

## 1. Sumber Kebenaran Proyek ( Urutan Prioritas )

Sebelum menulis kode, mengubah skema database, atau membuat komponen UI, baca dokumen acuan sesuai urutan berikut:

1. `AGENTS.md` (dokumen ini — batas kepemilikan file & aturan kolaborasi)
2. `docs/PRINCIPAL_DEVELOPMENT.md` (prinsip Clean Architecture, keamanan, dan *Definition of Done*)
3. `docs/DESIGN.md` (kontrak visual, warna, tipografi, aksesibilitas, dan lokalisasi Indonesia)
4. `docs/03-KONTRAK-DATABASE-DAN-STATE-MACHINE.md` (skema PostgreSQL, RBAC, dan invariant status)
5. `docs/04-KONTRAK-API-DAN-INTEGRASI.md` (kontrak endpoint REST, Zod DTO, kode error, dan event real-time)
6. `docs/02-PEMBAGIAN-TIM-DAN-MODUL.md` (pembagian modul & sprint untuk 4 orang)
7. `EventOps_WebApp_Blueprint.md` (spesifikasi pengalaman pengguna 41 layar)

---

## 2. Kepemilikan Direktori Eksklusif (`ownedPaths`)

Sesuai modul Craftrig **#25 (Multi-Agent Workspace & Concurrency Coordinator)**, dua orang atau dua agent **dilarang mengedit path yang sama secara bersamaan** tanpa koordinasi *Integration Owner*.

| Peran | Direktori Milik Eksklusif (`ownedPaths`) | Catatan Koordinasi |
| :--- | :--- | :--- |
| **BE-1** | `apps/api/src/core/**`<br>`apps/api/src/modules/auth/**`<br>`apps/api/src/modules/organizations/**`<br>`apps/api/src/modules/events/**`<br>`apps/api/src/modules/teams/**`<br>`apps/api/src/modules/tasks/**`<br>`apps/api/src/modules/timeline/**`<br>`apps/api/src/modules/rundown/**`<br>`packages/contracts/src/{common,auth,organizations,events,teams,tasks,timeline,rundown}/**` | **Integration Owner Backend** untuk `apps/api/src/app.module.ts` dan penomoran migrasi `apps/api/prisma/migrations/**`. |
| **BE-2** | `apps/api/src/infra/{storage,queue,payment,notification}/**`<br>`apps/api/src/modules/vendors/**`<br>`apps/api/src/modules/resources/**`<br>`apps/api/src/modules/finance/**`<br>`apps/api/src/modules/registrations/**`<br>`apps/api/src/modules/documents/**`<br>`apps/api/src/modules/notifications/**`<br>`apps/api/src/modules/reports/**`<br>`apps/api/src/modules/subscriptions/**`<br>`packages/contracts/src/{vendors,resources,finance,registrations,documents,notifications,reports,subscriptions}/**` | Menambahkan model Prisma pada file domain miliknya (Prisma multi-file schema `apps/api/prisma/schema/*.prisma`), lalu berkoordinasi dengan `BE-1` saat membuat migrasi bersama. |
| **FE-1** | `packages/ui/**`<br>`apps/web/src/proxy.ts`<br>`apps/web/src/components/layout/**`<br>`apps/web/src/features/{auth,onboarding,organizations,my-workspace,events,teams,tasks,timeline,rundown,live-ops}/**`<br>`apps/web/src/app/(auth)/**`<br>`apps/web/src/app/(app)/me/**`<br>`apps/web/src/app/(app)/orgs/[orgSlug]/{overview,events,members,settings}/**`<br>`apps/web/src/app/(app)/orgs/[orgSlug]/events/[eventId]/{overview,team,tasks,timeline,rundown,live,settings}/**` | **Integration Owner Frontend** untuk `packages/ui/**`, navigasi global, dan `apps/web/src/app/layout.tsx`. |
| **FE-2** | `apps/web/src/features/{marketing,vendors,resources,finance,registrations,check-in,documents,notifications,activities,reports,subscriptions}/**`<br>`apps/web/src/app/(public)/**`<br>`apps/web/src/app/(app)/orgs/[orgSlug]/subscription/**`<br>`apps/web/src/app/(app)/orgs/[orgSlug]/events/[eventId]/{vendors,resources,budget,participants,check-in,documents,reports}/**` | Menggunakan komponen dasar dari `packages/ui`. Jika butuh komponen primitif baru di `packages/ui`, ajukan PR kecil ke `FE-1`. |

---

## 3. Aturan Kontrak & Larangan Keras (Hard Invariants)

1. **Satu Sumber Kontrak (`packages/contracts`):**
   - Jangan menulis ulang interface request/response secara manual di `apps/web` atau `apps/api`.
   - Semua validasi input, DTO NestJS (`createZodDto`), dan skema form Next.js wajib mengimpor skema Zod dari `@eventops/contracts`.
2. **Keamanan Multi-Tenant (`organizationId` & `eventId`):**
   - Setiap query ke tabel operasional wajib menyertakan filter `organizationId` dan/atau `eventId` yang sudah diverifikasi oleh Guard otorisasi. Dilarang mengambil record hanya berdasarkan `id` tanpa memvalidasi konteks organisasi/event pengguna.
3. **Integritas Uang Rupiah & Keuangan:**
   - Simpan seluruh nilai uang dalam **Rupiah utuh (`BIGINT` di PostgreSQL / `number` bulat atau string terukur di JSON)** tanpa `FLOAT`/`REAL`.
   - Perubahan nominal pada `ExpenseRequest` yang sudah berstatus `APPROVED` wajib mengembalikan status ke `UNDER_REVIEW` dan mencatat `activity_logs`.
   - Transaksi berstatus `PAID` bersifat *append-only* (tidak boleh dihapus melalui endpoint CRUD biasa).
4. **Anti-Double Check-in & Anti-Resource Conflict:**
   - Validasi QR Check-in wajib dieksekusi secara atomik di dalam transaksi database (`UPDATE ... WHERE id = $1 AND checked_in_at IS NULL`).
   - Persetujuan peminjaman perlengkapan (`ResourceBooking`) wajib mengecek irisan waktu (`startTime < reqEnd AND endTime > reqStart`) terhadap total stok tersedia di dalam `prisma.$transaction`.
5. **Bahasa Produk & Konten:**
   - Seluruh teks antarmuka pengguna (label tombol, pesan validasi Zod, notifikasi email/WA, status badge, dan empty state) wajib menggunakan **Bahasa Indonesia yang alami dan profesional** sesuai panduan di `docs/05-PANDUAN-KERJA-HARIAN-DAN-CRAFTRIG.md`.
   - Nama kode teknis (variabel, fungsi, tabel, endpoint URL, nama tipe TypeScript, dan commit message) menggunakan **Bahasa Inggris** yang konsisten.

---

## 4. Penggunaan MCP Context7 & MCP Craftrig

### MCP Context7 (Dokumentasi Library Terkini)
Gunakan selalu `context7` (`resolve-library-id` -> `query-docs`) sebelum menulis konfigurasi atau API spesifik versi terbaru dari:
- Next.js (`/vercel/next.js`) — khususnya konvensi App Router & `proxy.ts`
- NestJS (`/nestjs/docs.nestjs.com`), `nestjs-zod` (`/benlorantfy/nestjs-zod`), BullMQ (`/nestjs/bull`)
- Prisma ORM (`/llmstxt/prisma_io_llms-full_txt`) — khususnya `prisma.config.ts` & interactive `$transaction`
- TanStack Query (`/tanstack/query`) & Turborepo (`/vercel/turborepo`)

### MCP Craftrig (Orkestrasi Task DAG, File Lock & Quality Gate)
- Resource Craftrig (`craftrig://architecture`, `craftrig://development-principles`, `craftrig://modules`, `craftrig://agent-roles`, `craftrig://design-options`) sudah tercermin penuh di dalam folder `docs/`.
- Manifest rencana eksekusi lengkap proyek ini tersedia di `docs/craftrig-execution-blueprint.json`.
- **Catatan Aktivasi Tool:** Pastikan daftar tool `craftrig.*` dan `localhost.*` dalam keadaan **Enabled (Aktif)** pada pengaturan MCP di Antigravity IDE sebelum menjalankan `craftrig.ingest_blueprint`, `craftrig.get_ready_tasks`, `craftrig.claim_task`, dan `craftrig.evaluate_quality_gate`.
