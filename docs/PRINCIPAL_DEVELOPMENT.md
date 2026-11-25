# Principal Development Principles — EventOps Indonesia

Dokumen ini mengadaptasi `craftrig://development-principles` secara spesifik untuk arsitektur **EventOps Indonesia** (Next.js + NestJS + PostgreSQL) agar 4 developer di dalam tim memegang standar rekayasa yang seragam.

---

## 1. Batas Arsitektur (Clean Architecture Pragmatis)

Kami menerapkan **Vertical Slice per Modul Bisnis** di dalam NestJS dan Next.js dengan arah ketergantungan satu arah:

```text
Interface / Transport Layer (NestJS Controller, WebSocket Gateway, Next.js Route/Page)
          │
          ▼
Application Layer (Use Cases / Command & Query Services, Orchestration, DTO Validation)
          │
          ▼
Domain Layer (Aturan State Machine, Rumus Readiness & Budget, Policy Hak Akses Murni)
          ▲
          │
Infrastructure Layer (Prisma Repository, BullMQ Producer/Worker, S3/R2 Adapter, Midtrans/WA Adapter)
```

### Aturan Ketergantungan:
1. **Domain Layer (`*.domain.ts` / `*.policy.ts`)** murni berisi aturan bisnis TypeScript (misal: fungsi `assertValidExpenseTransition()`, `calculateBudgetSnapshot()`, `evaluateEventReadiness()`). Dilarang mengimpor `@nestjs/*`, `@prisma/client`, `bullmq`, atau SDK pihak ketiga di file domain agar mudah diuji dengan unit test dalam hitungan milidetik.
2. **Application Layer (`*.service.ts`)** mengatur alur transaksi, memanggil fungsi domain, menyimpan audit trail (`ActivityService`), dan mengirim event/antrean melalui interface/port.
3. **Infrastructure Layer (`infra/**` & `*.repository.ts`)** membungkus detail teknis database Prisma, Redis/BullMQ, S3/Cloudflare R2, Midtrans/Xendit, dan WhatsApp Gateway. Jika suatu saat tim mengganti provider WhatsApp dari Fonnte ke Meta Cloud API, cukup ganti 1 file adapter tanpa menyentuh modul bisnis.
4. **Satu Sumber Kebenaran (`Single Source of Truth`):**
   - Skema validasi & kontrak API berada di `packages/contracts`.
   - Komponen desain dasar & token warna berada di `packages/ui`.
   - Definisi peran & matriks izin berada di satu konstanta terpusat, bukan tersebar sebagai `if (user.role === '...')` liar di puluhan komponen.

---

## 2. Standar Kualitas Kode (Clean Code)

- **Tipe Eksplisit & Ketat:** `strict: true` dan `noUncheckedIndexedAccess: true` wajib aktif di seluruh `tsconfig.json`. Dilarang menggunakan `any` tanpa alasan tertulis yang disetujui saat review PR.
- **Validasi di Pintu Masuk:** Seluruh `@Body()`, `@Query()`, dan `@Param()` pada NestJS divalidasi otomatis memakai `ZodValidationPipe` dari `nestjs-zod`. Jangan pernah memercayai data mentah dari klien.
- **Kejelasan Status Error:** Gunakan kode error bisnis yang terstruktur (contoh: `RESOURCE_BOOKING_CONFLICT`, `EXPENSE_ALREADY_PAID`, `TICKET_ALREADY_CHECKED_IN`), jangan melempar `500 Internal Server Error` untuk kesalahan aturan bisnis.
- **Hindari Abstraksi Prematur (YAGNI):** Jangan membuat *generic base repository* berlapis-lapis yang menyulitkan pembacaan query Prisma. Buat kode yang lugas, kecil, dan mudah dibaca oleh rekan satu tim.

---

## 3. Aturan Khusus Pasar Indonesia & Keamanan Data

1. **Mata Uang Rupiah (`IDR`):**
   - Semua kolom uang di PostgreSQL bertipe `BIGINT` dalam satuan Rupiah penuh (contoh: `Rp50.000.000` disimpan sebagai `50000000`).
   - Dilarang keras memakai tipe `FLOAT`, `DOUBLE PRECISION`, atau operasi pecahan desimal yang memicu bug pembulatan.
2. **Zona Waktu Nusantara (`WIB`, `WITA`, `WIT`):**
   - Database PostgreSQL selalu menyimpan waktu dalam `TIMESTAMPTZ` (UTC).
   - Setiap `Event` menyimpan kolom `timezone` eksplisit (`Asia/Jakarta`, `Asia/Makassar`, atau `Asia/Jayapura`).
   - Frontend menampilkan waktu sesuai zona waktu event lengkap dengan labelnya (contoh: `20 Juni 2027 · 08.00–09.00 WIB`) agar panitia dan peserta lintas pulau tidak salah jam.
3. **Pelindungan Data Pribadi (UU PDP No. 27 Tahun 2022):**
   - Form registrasi peserta publik hanya meminta field yang diaktifkan oleh Event Manager (*data minimization*) serta menampilkan persetujuan pemrosesan data acara.
   - Data pribadi peserta (email, nomor WhatsApp, identitas) hanya dapat dilihat dan diekspor oleh role yang memiliki izin eksplisit (`EVENT_MANAGER` atau petugas registrasi berizin), **tidak terbuka** bagi seluruh anggota panitia biasa atau `VIEWER`.
   - Fitur **Create Template from Event** wajib membuang seluruh data peserta, lampiran kuitansi, dan riwayat transaksi keuangan sebelum menyalin struktur acara.
4. **Jejak Audit (`Activity History`):**
   - Perubahan kritikal (override status Event ke `READY`, pembatalan Event, perubahan waktu Rundown, persetujuan/penolakan Pengeluaran, perubahan role anggota) wajib menulis record ke tabel `activity_logs` di dalam transaksi database yang sama (`tx.activityLog.create(...)`), mencatat `beforeSnapshot`, `afterSnapshot`, `actorId`, dan `reason`.

---

## 4. Bukti Verifikasi & Definition of Done (DoD)

Sesuai Craftrig Module **#10 (Verification Receipt)** dan **#54 (Independent Evidence Diversity Gate)**, sebuah fitur atau tiket (`TASK-ID`) baru dinyatakan **SELESAI (DONE)** apabila:

1. Seluruh kriteria penerimaan (*Acceptance Criteria*) pada modul tersebut terpenuhi.
2. `pnpm turbo check-types`, `pnpm turbo lint`, dan `pnpm turbo test` berjalan hijau tanpa error.
3. Untuk perubahan Backend: unit test aturan domain + integration test endpoint utama (termasuk kasus gagal/otorisasi ditolak `403`) lulus dan terdokumentasi di Swagger `/docs`.
4. Untuk perubahan Frontend: halaman telah dibuka dan diuji nyata di browser lokal pada ukuran Desktop (`1440px`), Tablet (`768px`), dan Mobile (`375px`), mencakup *loading skeleton*, *empty state*, *error state*, dan *success state*.
5. PR telah di-review oleh pasangan Squad atau developer silang (implementer tidak boleh langsung merge ke `main` sendirian untuk modul berisiko tinggi seperti Keuangan, RBAC, dan Check-in).
