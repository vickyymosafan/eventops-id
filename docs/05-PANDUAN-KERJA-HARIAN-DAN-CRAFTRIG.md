# 05 — Panduan Kerja Harian Tim 4 Orang, Standar Bahasa Indonesia & Craftrig

Dokumen ini adalah buku saku praktis agar kolaborasi **BE-1, BE-2, FE-1, dan FE-2** tetap rapi dari minggu pertama sampai rilis akhir tanpa drama *merge conflict* atau salah paham fitur.

---

## 1. Ritme Kerja Mingguan Anti-Blokir (Workflow Contract-First)

Agar tim Frontend **tidak pernah menganggur menunggu Backend selesai**, ikuti siklus 4 langkah ini di setiap awal Sprint:

### Langkah 1 — Senin (45 Menit): Kunci Kontrak di `packages/contracts`
- `BE-1` + `FE-1` menyepakati skema Zod fitur Squad Alpha sprint tersebut.
- `BE-2` + `FE-2` menyepakati skema Zod fitur Squad Beta sprint tersebut.
- Merge PR kontrak ke branch `main` lebih dulu. Sejak detik itu, tipe data request & response sudah resmi terkunci!

### Langkah 2 — Selasa s.d. Kamis: Jalan Paralel 100%
- **Tim Backend (`BE-1`, `BE-2`)** membangun migrasi Prisma, domain logic, endpoint NestJS, dan unit/integration test hingga tampil di Swagger `http://localhost:4000/docs`.
- **Tim Frontend (`FE-1`, `FE-2`)** langsung membangun halaman Next.js, form validasi memakai skema Zod dari `@eventops/contracts`, dan menggunakan data *fixture/mock* bertipe sama persis sambil menunggu endpoint siap.

### Langkah 3 — Jumat: Sambung API & Review Silang Pasangan
- `FE-1` menyambungkan TanStack Query ke endpoint `BE-1`; `FE-2` menyambungkan TanStack Query ke endpoint `BE-2`.
- Karena keduanya memakai skema `@eventops/contracts` yang sama, penyambungan biasanya langsung klop tanpa bongkar ulang UI.

### Langkah 4 — Sabtu Pagi (30 Menit): Demo Lintas Squad & Quality Check
- Jalankan `pnpm turbo check-types lint test build`.
- Uji skenario terintegrasi (contoh: `FE-1` geser task poster ke *Blocked* -> cek apakah muncul di laporan `FE-2`).

---

## 2. Konvensi Git, Branching & Pull Request

1. **Penamaan Branch (Selalu Awali Kode Peran):**
   - `feat/be1-event-readiness`
   - `feat/be2-resource-conflict-lock`
   - `feat/fe1-kanban-board`
   - `feat/fe2-qr-checkin-scanner`
   - `contract/s3-tasks-and-finance` *(khusus perubahan kontrak bersama)*
2. **Aturan Commit (Conventional Commits):**
   - `feat(tasks): add dependency blocker detection`
   - `feat(finance): reset approved expense on amount change`
   - `fix(checkin): handle camera permission denied fallback`
3. **Aturan PR Review Sederhana tapi Ketat:**
   - PR milik `BE-1` di-review oleh `BE-2` (dan sebaliknya).
   - PR milik `FE-1` di-review oleh `FE-2` (dan sebaliknya).
   - PR yang menyentuh `packages/contracts` wajib di-approve minimal oleh **1 BE + 1 FE**.

---

## 3. Pedoman Bahasa & Glosarium UI Bahasa Indonesia

Karena target pasar EventOps adalah **penyelenggara acara di Indonesia** (EO profesional, kepanitiaan kampus/BEM, asosiasi industri, komunitas kreatif, dan tim event korporat), teks antarmuka harus terasa **alami di dunia kepanitiaan Indonesia** — tidak kaku seperti hasil terjemahan mesin, tetapi tetap rapi dan profesional.

### Tabel Istilah Baku Antarmuka EventOps (Wajib Konsisten FE-1 & FE-2)

| Konsep di Blueprint | Istilah Resmi di UI EventOps (Indonesia) | Hindari Menulis... |
| :--- | :--- | :--- |
| Organization Workspace | **Ruang Kerja Organisasi** | *Tempat Kerja Organisasi* |
| Event Workspace | **Workspace Event** / **Ruang Kerja Event** | *Ruang Acara Peristiwa* |
| Event Manager | **Event Manager** / **Ketua Pelaksana** *(tooltip)* | *Manajer Peristiwa* |
| Division & PIC | **Divisi** & **PIC** | *Pembagian* / *Orang yang Bertanggung Jawab* |
| Tasks / My Tasks | **Tugas** / **Tugas Saya** | *Pekerjaan-pekerjaan Saya* |
| Backlog / To Do / In Progress / In Review / Blocked / Completed | **Backlog** / **Belum Dikerjakan** / **Sedang Dikerjakan** / **Menunggu Review** / **Terhambat** / **Selesai** | *Di Belakang Log* / *Untuk Dilakukan* / *Diblokir* |
| Overdue | **Lewat Tenggat** | *Kadaluarsa* |
| Preparation Timeline | **Linimasa Persiapan** | *Garis Waktu Persiapan* |
| Rundown | **Rundown Acara** *(istilah baku dunia EO Indonesia)* | *Susunan Penurunan Waktu* |
| Vendors & Quotation | **Vendor** & **Penawaran Harga (Quotation)** | *Penjual* & *Kutipan* |
| Resources & Resource Booking | **Perlengkapan** & **Peminjaman Perlengkapan** | *Sumber Daya* & *Pemesanan Sumber Daya* |
| Planned / Committed / Actual / Remaining Budget | **Pagu Anggaran** / **Dana Terikat (Committed)** / **Pengeluaran Aktual** / **Sisa Anggaran** | *Rencana* / *Berkomitmen* / *Nyata* |
| Expense Request | **Pengajuan Biaya** | *Permintaan Pengeluaran* |
| Registration & Waitlisted | **Registrasi Peserta** & **Daftar Tunggu** | *Pendaftaran Masuk* & *Daftar Menunggu* |
| Check-in | **Check-in Peserta** | *Lapor Masuk* |
| Event Readiness: Ready / Needs Attention | **Siap Dilaksanakan** / **Perlu Perhatian** | *Siap* / *Butuh Perhatian* |
| Retrospective | **Evaluasi & Pembelajaran** | *Retrospektif Masa Lalu* |

### Contoh Copywriting Hero Landing Page (Screen 1 — Bahasa Indonesia)
> **Headline:** *Buat setiap event tertata, terpantau, dan jelas penanggung jawabnya.*
> **Subheadline:** *Satukan pembagian tugas panitia, linimasa persiapan, rundown hari-H, vendor, peminjaman perlengkapan, anggaran Rupiah, hingga check-in QR peserta dalam satu ruang kerja.*
> **CTA Utama:** *Mulai Buat Workspace Gratis* · **CTA Sekunder:** *Lihat Fitur Lengkap*

---

## 4. Quality Checkpoints & Cara Menjalankan MCP Craftrig

Proyek ini telah dilengkapi manifest eksekusi Craftrig di [docs/craftrig-execution-blueprint.json](./craftrig-execution-blueprint.json) yang memetakan kapabilitas dari **70-Module Catalog Craftrig** (`craftrig://modules`):

- **Module #1 (`Requirements-to-Evidence Graph`):** Setiap layar di Blueprint terhubung ke `REQ-001` s.d. `REQ-014` dan daftar verifikasi.
- **Module #21 (`Cross-Layer Semantic Consistency Engine`):** Menjaga kesamaan nama enum & rumus antara PostgreSQL, NestJS DTO, dan Next.js UI melalui `packages/contracts`.
- **Module #25 (`Multi-Agent Workspace & Concurrency Coordinator`):** Batas `ownedPaths` eksklusif untuk 4 anggota tim / paralel subagents (`maxParallelTasks: 4`).
- **Module #60 (`Formal Behavioral Contract & Temporal Invariant`):** Menjaga aturan satu kali scan QR, larangan hapus transaksi `PAID`, re-approval biaya, dan deteksi konflik peminjaman alat.

### Cara Mengimpor Blueprint Ini ke Engine MCP Craftrig:
1. Buka pengaturan **MCP Servers** di Antigravity IDE, lalu aktifkan (*enable*) daftar tools pada server **`craftrig`** (khususnya `craftrig.ingest_blueprint`, `craftrig.create_execution_plan`, `craftrig.get_ready_tasks`, `craftrig.claim_task`, `craftrig.complete_task`, dan `craftrig.evaluate_quality_gate`).
2. Setelah tools aktif, minta agent menjalankan `craftrig.ingest_blueprint` dengan merujuk pada [docs/craftrig-execution-blueprint.json](./craftrig-execution-blueprint.json).
3. Craftrig akan otomatis membangun database state `.craftrig/` berisi antrean task paralel (`wave`) yang siap diklaim baik oleh subagent maupun oleh ke-4 developer!
