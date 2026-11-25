# EventOps Indonesia — Dokumentasi Teknis & Kontrak Tim

> **Platform SaaS Manajemen Operasional Event untuk Pasar Indonesia**
> Mengelola kepanitiaan, pembagian tugas (Kanban), timeline persiapan, rundown hari-H, vendor, peminjaman perlengkapan anti-bentrok, anggaran & persetujuan biaya (Rupiah), registrasi & check-in QR peserta, hingga evaluasi pasca-acara dalam satu ruang kerja terpadu.

Dokumen di repositori ini disusun berdasarkan [EventOps_WebApp_Blueprint.md](./EventOps_WebApp_Blueprint.md), standar **Craftrig Clean Architecture & Governance**, serta praktik terkini ekosistem **Next.js + NestJS + PostgreSQL** untuk **tim beranggotakan 4 developer (2 Backend + 2 Frontend)**.

---

## Peta Cepat Pembagian Tim (4 Orang)

Agar 4 orang dapat bekerja paralel tanpa saling tunggu dan tanpa bentrok file (*merge conflict*), tim dibagi menjadi **2 Squad Fungsional (Vertical Slice)** dengan kontrak bersama di `packages/contracts`:

| Kode Peran | Fokus Utama | Pasangan Kerja | Area Tanggung Jawab Inti |
| :--- | :--- | :--- | :--- |
| **BE-1** | Backend Core, Kepanitiaan & Eksekusi Acara | **FE-1** (Squad Alpha) | Auth/JWT, Multi-tenant Organisasi, RBAC Guard, Audit Log, Event Core & Readiness Engine, Divisi & Kepanitiaan, Kanban Task & Dependency, Timeline H-minus, Rundown & Live Ops (SSE/WebSocket). |
| **FE-1** | Frontend App Shell, Kanban & Live Ops | **BE-1** (Squad Alpha) | Design System (`packages/ui`), App Shell (Org Switcher + Event Sidebar), Auth & Onboarding, Workspace Pribadi (*My Tasks*), Dashboard Event, Struktur Divisi, Kanban Drag-and-Drop, Timeline, Rundown & Layar Hari-H. |
| **BE-2** | Backend Kebutuhan, Keuangan, Peserta & Laporan | **FE-2** (Squad Beta) | Storage Presigned URL (R2/S3), Antrean BullMQ (Email/WhatsApp), Database Vendor & Quotation, Resource & Anti-Conflict Booking, RAB & Approval Pengeluaran (IDR), Registrasi Publik & QR Check-in, Dokumen, Laporan, Template Event & Langganan (QRIS/VA). |
| **FE-2** | Frontend Publik, Keuangan, QR Check-in & Laporan | **BE-2** (Squad Beta) | Landing Page & Harga (SEO Indonesia), Direktori Vendor & Perbandingan Quotation, Inventaris & Deteksi Bentrok Perlengkapan, Dashboard RAB & Approval Biaya, Form Registrasi Publik, Tiket QR & Kamera Scanner Hari-H, Dokumen, Notifikasi, Laporan & Retrospective. |

---

## Daftar Isi Dokumentasi Wajib Baca

Baca dokumen secara berurutan sesuai kebutuhan peran masing-masing:

1. **[EventOps_WebApp_Blueprint.md](./EventOps_WebApp_Blueprint.md)**
   Dokumen visi pengalaman produk ujung-ke-ujung (14 tahap perjalanan pengguna, 41 layar, 7 peran kepanitiaan, dan alur status bisnis).
2. **[docs/01-TECH-STACK-DAN-ARSITEKTUR.md](./docs/01-TECH-STACK-DAN-ARSITEKTUR.md)**
   Rekomendasi lengkap tech stack (Turborepo, Next.js 16 App Router, NestJS 11 Fastify, Prisma v7, PostgreSQL 17, Redis + BullMQ, Zod v4), integrasi pasar Indonesia (Midtrans/Xendit QRIS & VA, WhatsApp Gateway, Cloudflare R2, WIB/WITA/WIT, Rupiah, UU PDP), serta struktur monorepo lengkap.
3. **[docs/02-PEMBAGIAN-TIM-DAN-MODUL.md](./docs/02-PEMBAGIAN-TIM-DAN-MODUL.md)**
   Pembagian kerja detail 4 orang (`BE-1`, `BE-2`, `FE-1`, `FE-2`), pemetaan seluruh **41 layar Blueprint** ke masing-masing developer, aturan kepemilikan folder (`ownedPaths`), dan **Roadmap Eksekusi 6 Sprint (12 Minggu)** yang langsung bisa dibagi ke tim.
4. **[docs/03-KONTRAK-DATABASE-DAN-STATE-MACHINE.md](./docs/03-KONTRAK-DATABASE-DAN-STATE-MACHINE.md)**
   Kontrak ERD PostgreSQL & Prisma v7 lengkap seluruh modul, matriks hak akses 2 tingkat (Organisasi & Event), aturan transisi 5 *State Machine* resmi, rumus baku *Budget Snapshot* (`Planned`, `Committed`, `Actual`, `Remaining`), dan *Event Readiness Engine*.
5. **[docs/04-KONTRAK-API-DAN-INTEGRASI.md](./docs/04-KONTRAK-API-DAN-INTEGRASI.md)**
   Kontrak REST API (`/api/v1/...`), pola berbagi skema **Zod v4** antara Next.js dan NestJS (`nestjs-zod`), format respons & kode error Bahasa Indonesia, kontrak SSE/WebSocket *Live Operations* hari-H, serta alur *Presigned Upload* file.
6. **[docs/05-PANDUAN-KERJA-HARIAN-DAN-CRAFTRIG.md](./docs/05-PANDUAN-KERJA-HARIAN-DAN-CRAFTRIG.md)**
   SOP harian tim (alur *Contract-First*, Git branching, PR review antar-pasangan, cara jalan paralel dengan mock sebelum API selesai), pedoman bahasa & istilah UI Indonesia, serta panduan kualitas & eksekusi Craftrig.

### Dokumen Tata Kelola, Visual Portal & Harness Craftrig
- **[docs/visual/index.html](./docs/visual/index.html)** — **Portal Visual Dokumentasi Interaktif** (buka langsung di browser untuk melihat diagram arsitektur, filter 41 layar per developer, simulator Budget/Resource, Explorer State Machine, dan 24 Task DAG Craftrig).
- **[AGENTS.md](./AGENTS.md)** — Kontrak batas kerja (*file ownership*), aturan kolaborasi manusia + AI agent, dan integrasi MCP Craftrig & Context7.
- **[docs/PRINCIPAL_DEVELOPMENT.md](./docs/PRINCIPAL_DEVELOPMENT.md)** — Prinsip rekayasa perangkat lunak (Clean Architecture, keamanan finansial & privasi, bukti pengujian, dan *Definition of Done*).
- **[docs/DESIGN.md](./docs/DESIGN.md)** — Kontrak sistem desain antarmuka EventOps (tipografi, palet warna operasional tanpa warna pink, kepadatan data dashboard, dan responsivitas mobile lapangan).
- **[docs/craftrig-execution-blueprint.json](./docs/craftrig-execution-blueprint.json)** — Manifest terstruktur berisi daftar kebutuhan (`REQ-001` s.d. `REQ-014`), *Task DAG* lintas fase, pemilik peran, `ownedPaths`, dan *Quality Checkpoints* yang siap diimpor ke MCP Craftrig.

---

## Cara Memulai Kerja Tim (Hari ke-1)

1. **Samakan pemahaman produk (30 menit):** Seluruh anggota tim membaca ringkasan alur di `EventOps_WebApp_Blueprint.md` (khususnya Bab 3 Peta Halaman, Bab 6 Role, dan Bab 8 Status).
2. **Kunci pembagian Squad (30 menit):** Tentukan siapa yang memegang kursi `BE-1`, `BE-2`, `FE-1`, dan `FE-2` mengacu pada [docs/02-PEMBAGIAN-TIM-DAN-MODUL.md](./docs/02-PEMBAGIAN-TIM-DAN-MODUL.md).
3. **Jalankan Fase 0 / Sprint 1 Hari 1–2 (Setup Monorepo):** `BE-1` dan `FE-1` menginisialisasi kerangka Turborepo (`apps/api`, `apps/web`, `packages/contracts`, `packages/ui`), sementara `BE-2` menyiapkan `docker-compose.yml` (PostgreSQL 17 + Redis 7 + MinIO lokal setara Cloudflare R2) dan `FE-2` menyiapkan token desain di `packages/ui` serta struktur halaman publik.
4. **Terapkan budaya *Contract-First*:** Setiap awal sprint, perubahan skema request/response ditulis lebih dulu di `packages/contracts` menggunakan Zod v4 dan di-merge ke `main`. Setelah itu, tim FE dan BE langsung bekerja paralel tanpa saling menunggu.
