# 04 — Kontrak REST API, Shared Zod DTO, Kode Error & Real-Time

Dokumen ini menjadi pegangan langsung saat **FE-1 / FE-2** menyambungkan UI ke endpoint **BE-1 / BE-2**. Seluruh endpoint berada di bawah prefix versi **`/api/v1`**.

---

## 1. Standar Protokol, Header & Amplop JSON

### A. Header Standar
| Header | Wajib? | Keterangan |
| :--- | :---: | :--- |
| `Authorization: Bearer <accessToken>` | Ya (kecuali `@Public()`) | JWT berumur pendek (15 menit); refresh token dikelola otomatis lewat `HttpOnly` cookie pada `/api/v1/auth/refresh`. |
| `X-Organization-Id: <uuid>` | Opsional / Kontekstual | Divalidasi silang terhadap parameter rute organisasi/event untuk mencegah kebocoran lintas organisasi. |
| `Idempotency-Key: <uuid-v4>` | Wajib pada POST Keuangan & Check-in | Mencegah duplikasi pengajuan biaya atau registrasi ganda ketika koneksi internet panitia di venue tidak stabil. |

### B. Amplop Respons Sukses (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "0195c8d0-7a12-7000-91ab-8812ef901122",
    "name": "National Creative Conference 2027"
  },
  "meta": {
    "requestId": "req_01JXYZ89AB",
    "timestamp": "2027-06-01T09:15:00.000Z"
  }
}
```

### C. Amplop Daftar Berhalaman (`Pagination`)
```json
{
  "success": true,
  "data": [ /* array item */ ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 68,
    "totalPages": 4,
    "hasNextPage": true
  }
}
```

### D. Amplop Respons Gagal & Katalog Kode Error Bahasa Indonesia
Seluruh error (baik validasi Zod maupun aturan domain) mengembalikan struktur yang konsisten agar komponen Toast/Form di Frontend tinggal menampilkan `error.message` atau `error.details`:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_BOOKING_CONFLICT",
    "message": "Stok proyektor tidak mencukupi pada rentang waktu yang dipilih (tersedia 1 dari 3 unit, diminta 2 unit).",
    "details": [
      {
        "field": "quantity",
        "issue": "Bentrok dengan Event 'Workshop Desain Nasional' pada 20 Jun 2027 08.00–12.00 WIB (2 unit)."
      }
    ]
  },
  "meta": {
    "requestId": "req_01JXYZ99CD",
    "timestamp": "2027-06-01T09:16:12.000Z"
  }
}
```

| Kode Error (`error.code`) | HTTP | Arti & Penanganan di UI |
| :--- | :---: | :--- |
| `VALIDATION_ERROR` | `400` | Input form tidak sesuai skema Zod; petakan `details[].field` ke `setError()` React Hook Form. |
| `UNAUTHORIZED_SESSION` | `401` | Token kedaluwarsa; `api-client.ts` otomatis mencoba `/auth/refresh` satu kali sebelum arahkan ke `/login`. |
| `FORBIDDEN_INSUFFICIENT_ROLE` | `403` | Peran pengguna di organisasi/event tidak mengizinkan aksi ini (misal anggota biasa membuka detail RAB). |
| `RESOURCE_NOT_FOUND` | `404` | Data tidak ditemukan di dalam ruang lingkup organisasi/event aktif. |
| `RESOURCE_BOOKING_CONFLICT` | `409` | Jumlah peminjaman alat melebihi ketersediaan pada jam beririsan; tampilkan kartu detail bentrok. |
| `TICKET_ALREADY_CHECKED_IN` | `409` | QR sudah pernah dipakai check-in; tampilkan layar merah berisi jam & nama petugas scan pertama. |
| `TICKET_NOT_ELIGIBLE` | `409` | Status pendaftaran peserta `CANCELLED`, `REJECTED`, atau masih `PENDING`. |
| `EXPENSE_ALREADY_PAID` | `409` | Transaksi sudah dibayar lunas; tolak penghapusan atau perubahan langsung. |
| `EVENT_READINESS_OVERRIDE_REASON_REQUIRED` | `422` | Mengubah status event ke `READY` saat masih ada blocker tanpa menyertakan alasan tertulis. |
| `EVENT_IS_ARCHIVED` | `409` | Event sudah diarsipkan sehingga bersifat baca-saja (*read-only*). |
| `SUBSCRIPTION_QUOTA_EXCEEDED` | `402` | Batas paket event aktif atau jumlah anggota organisasi terlampaui; arahkan ke halaman upgrade paket. |

---

## 2. Pola Kode Kontrak Bersama (`packages/contracts` -> NestJS -> Next.js)

Contoh nyata bagaimana **1 kontrak Zod** menghilangkan miskomunikasi antara pasangan BE dan FE:

### Langkah 1: Definisi di `packages/contracts/src/finance/expense.contract.ts`
```typescript
import { z } from 'zod';

export const CreateExpenseRequestSchema = z.object({
  title: z
    .string()
    .min(5, 'Nama pengeluaran minimal 5 karakter')
    .max(150, 'Nama pengeluaran maksimal 150 karakter'),
  budgetCategoryId: z.string().uuid('Kategori anggaran wajib dipilih'),
  divisionId: z.string().uuid('Divisi pengaju wajib dipilih'),
  vendorEngagementId: z.string().uuid().nullable().optional(),
  amountIdr: z
    .number()
    .int('Nominal Rupiah harus bilangan bulat tanpa desimal')
    .positive('Nominal pengeluaran harus lebih besar dari Rp0')
    .max(100_000_000_000, 'Nominal melebihi batas transaksi maksimum'),
  expenseDate: z.iso.date('Format tanggal harus YYYY-MM-DD'),
  description: z.string().max(1000).optional(),
  attachmentDocumentIds: z
    .array(z.string().uuid())
    .min(1, 'Wajib melampirkan minimal 1 bukti nota atau quotation'),
});

export type CreateExpenseRequestInput = z.infer<typeof CreateExpenseRequestSchema>;
```

### Langkah 2: Pemakaian di Backend NestJS (`apps/api` oleh `BE-2`)
```typescript
import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CreateExpenseRequestSchema } from '@eventops/contracts/finance';
import { RequireEventPermission } from '@/core/auth/decorators';

export class CreateExpenseDto extends createZodDto(CreateExpenseRequestSchema) {}

@ApiTags('Finance & Expenses')
@Controller('api/v1/events/:eventId/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @RequireEventPermission('EXPENSE_CREATE')
  @ApiOperation({ summary: 'Buat pengajuan pengeluaran baru beserta bukti nota' })
  async create(
    @Param('eventId') eventId: string,
    @Headers('idempotency-key') idempotencyKey: string,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expensesService.createRequest(eventId, idempotencyKey, dto);
  }
}
```

### Langkah 3: Pemakaian di Frontend Next.js (`apps/web` oleh `FE-2` dengan TanStack Query v5)
```typescript
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { type CreateExpenseRequestInput } from '@eventops/contracts/finance';
import { apiClient } from '@/lib/api-client';

export const eventExpensesOptions = (eventId: string) =>
  queryOptions({
    queryKey: ['events', eventId, 'expenses'] as const,
    queryFn: () => apiClient.get(`/api/v1/events/${eventId}/expenses`),
  });

export const eventBudgetSummaryOptions = (eventId: string) =>
  queryOptions({
    queryKey: ['events', eventId, 'budget-summary'] as const,
    queryFn: () => apiClient.get(`/api/v1/events/${eventId}/budget/summary`),
  });

export function useCreateExpenseMutation(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpenseRequestInput) =>
      apiClient.post(`/api/v1/events/${eventId}/expenses`, payload, {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventExpensesOptions(eventId).queryKey }),
        queryClient.invalidateQueries({ queryKey: eventBudgetSummaryOptions(eventId).queryKey }),
      ]);
    },
  });
}
```

---

## 3. Katalog Lengkap Endpoint REST API per Squad

### BAGIAN A — Kontrak Squad Alpha (`Owner: BE-1` ↔ `Consumer: FE-1`)

#### Modul 1: Autentikasi, Profil & Organisasi
| Method & Path | Deskripsi Singkat | Hak Akses |
| :--- | :--- | :--- |
| `POST /api/v1/auth/register` | Daftar akun baru (`fullName`, `email`, `password`) | `@Public()` |
| `POST /api/v1/auth/login` | Masuk & set HttpOnly Refresh Cookie + kembalikan `accessToken` | `@Public()` |
| `POST /api/v1/auth/refresh` | Perbarui `accessToken` menggunakan Refresh Cookie | Cookie |
| `POST /api/v1/auth/logout` | Cabut sesi refresh token aktif | Terautentikasi |
| `GET /api/v1/users/me` | Ambil profil pengguna, preferensi tema/notifikasi, & daftar organisasi yang diikuti | Terautentikasi |
| `PATCH /api/v1/users/me` | Ubah profil pribadi & preferensi notifikasi (Screen 41) | Terautentikasi |
| `POST /api/v1/organizations` | Buat organisasi baru; pembuat otomatis menjadi `OWNER` (Screen 4) | Terautentikasi |
| `GET /api/v1/organizations/:orgId/overview` | Kartu ringkasan organisasi, event terdekat, event butuh perhatian & kuota (Screen 6) | Anggota Org |
| `PATCH /api/v1/organizations/:orgId` | Ubah profil & kebijakan akses organisasi (Screen 39) | `OWNER`, `ADMIN` |
| `GET /api/v1/organizations/:orgId/members` | Daftar anggota organisasi & undangan (Screen 38) | Anggota Org |
| `POST /api/v1/organizations/:orgId/invitations` | Kirim batch undangan email (`ADMIN` / `MEMBER`) (Screen 5 & 38) | `OWNER`, `ADMIN` |
| `POST /api/v1/invitations/:token/respond` | Terima atau tolak undangan bergabung organisasi (Screen 3 & 14) | Terautentikasi |
| `PATCH /api/v1/organizations/:orgId/members/:memberId` | Ubah role anggota atau nonaktifkan akses anggota | `OWNER`, `ADMIN` |

#### Modul 2: Event Core, Readiness & Kepanitiaan
| Method & Path | Deskripsi Singkat | Hak Akses |
| :--- | :--- | :--- |
| `GET /api/v1/organizations/:orgId/events` | Daftar event organisasi dengan filter `status`, `managerId`, `search`, periode (Screen 7) | Anggota Org |
| `POST /api/v1/organizations/:orgId/events` | Buat event baru (`DRAFT` atau `PLANNING`, dukung `templateId` opsional) (Screen 8) | `OWNER`, `ADMIN` |
| `GET /api/v1/events/:eventId/overview` | Dashboard kesiapan event: readiness status, task stats, critical issues, milestones, vendor/resource/budget snapshot (Screen 9) | Anggota Event |
| `PATCH /api/v1/events/:eventId` | Ubah detail event, lokasi, tanggal, kapasitas, zona waktu (Screen 10) | `EVENT_MANAGER`+ |
| `POST /api/v1/events/:eventId/status` | Transisi status event (`READY` cek kriteria/alasan, `CANCELLED` wajib alasan, `COMPLETED`, `ARCHIVED`) | `EVENT_MANAGER`+ |
| `GET /api/v1/events/:eventId/divisions` | Struktur lengkap divisi, leader, dan anggota kepanitiaan (Screen 11) | Anggota Event |
| `POST /api/v1/events/:eventId/divisions` | Buat divisi baru (Program, Publikasi, Logistik, Keuangan, dll.) | `EVENT_MANAGER`+ |
| `POST /api/v1/events/:eventId/members` | Tambahkan anggota organisasi ke kepanitiaan event & multi-divisi | `EVENT_MANAGER`+ |
| `PATCH /api/v1/events/:eventId/members/:eventMemberId` | Ubah role event atau izin spesifik (`canViewBudget`, `canManageCheckin`) | `EVENT_MANAGER`+ |

#### Modul 3: Tasks (Kanban, Detail, Dependency) & My Workspace
| Method & Path | Deskripsi Singkat | Hak Akses |
| :--- | :--- | :--- |
| `GET /api/v1/events/:eventId/tasks` | Ambil task Kanban/List dengan filter `divisionId`, `assigneeId`, `priority`, `overdueOnly`, `search` (Screen 12) | Anggota Event |
| `POST /api/v1/events/:eventId/tasks` | Buat task baru beserta checklist awal & dependency | Panitia Berizin |
| `GET /api/v1/events/:eventId/tasks/:taskId` | Detail lengkap task: checklist, dependency, lampiran, komentar & histori (Screen 13) | Anggota Event |
| `PATCH /api/v1/events/:eventId/tasks/:taskId` | Edit isi task, PIC, tenggat, atau prioritas | Panitia Berizin |
| `PATCH /api/v1/events/:eventId/tasks/:taskId/move` | Geser kolom status Kanban (`status`, `boardOrder`, `blockedReason` jika `BLOCKED`) | PIC / Leader / EM |
| `POST /api/v1/events/:eventId/tasks/:taskId/checklists` | Tambah/ubah centang item checklist pada task | PIC / Leader / EM |
| `POST /api/v1/events/:eventId/tasks/:taskId/comments` | Kirim komentar diskusi atau catatan revisi pada task | Anggota Event |
| `GET /api/v1/me/tasks` | Daftar seluruh task milik pengguna lintas semua event & organisasi (Screen 14) | Terautentikasi |
| `GET /api/v1/me/events` | Daftar seluruh event yang diikuti pengguna aktif | Terautentikasi |

#### Modul 4: Preparation Timeline, Rundown & Live Operations
| Method & Path | Deskripsi Singkat | Hak Akses |
| :--- | :--- | :--- |
| `GET /api/v1/events/:eventId/milestones` | Daftar milestone persiapan beserta progres task terhubung (Screen 15) | Anggota Event |
| `POST /api/v1/events/:eventId/milestones` | Tambah milestone persiapan baru | `EVENT_MANAGER`, `LEADER` |
| `PATCH /api/v1/events/:eventId/milestones/:id` | Ubah tanggal/PIC/task terkait pada milestone | `EVENT_MANAGER`, `LEADER` |
| `GET /api/v1/events/:eventId/rundown-sessions` | Susunan sesi acara terurut per hari & panggung/ruangan (Screen 16) | Anggota Event |
| `POST /api/v1/events/:eventId/rundown-sessions` | Tambah sesi agenda rundown | `EVENT_MANAGER`, `LEADER` |
| `PATCH /api/v1/events/:eventId/rundown-sessions/:id` | Ubah jadwal rencana (`plannedStartAt/EndAt`); otomatis kirim notifikasi ke PIC sesi | `EVENT_MANAGER`, `LEADER` |
| `POST /api/v1/events/:eventId/rundown-sessions/reorder` | Urutkan ulang sesi rundown secara atomik | `EVENT_MANAGER`, `LEADER` |
| `PATCH /api/v1/events/:eventId/rundown-sessions/:id/live` | Catat `actualStartAt`, `actualEndAt`, dan status sesi aktual saat hari-H tanpa menimpa waktu rencana (Screen 33) | PIC Sesi / EM |
| `GET /api/v1/events/:eventId/live/stream` | **Server-Sent Events (SSE)** stream pembaruan sesi aktif, keterlambatan, isu terbuka, & counter check-in (Screen 33) | Anggota Event |

---

### BAGIAN B — Kontrak Squad Beta (`Owner: BE-2` ↔ `Consumer: FE-2`)

#### Modul 5 & 6: Vendors, Quotations & Resources Anti-Bentrok
| Method & Path | Deskripsi Singkat | Hak Akses |
| :--- | :--- | :--- |
| `GET /api/v1/organizations/:orgId/vendors` | Database vendor organisasi dengan filter kategori & riwayat event (Screen 17) | Panitia Berizin |
| `POST /api/v1/organizations/:orgId/vendors` | Tambah profil vendor baru ke database organisasi | `EVENT_MANAGER`+ |
| `GET /api/v1/events/:eventId/vendor-engagements` | Daftar keterlibatan vendor pada event beserta status & nilai sepakatan | Panitia Berizin |
| `POST /api/v1/events/:eventId/vendor-engagements` | Hubungkan vendor ke event beserta ruang lingkup layanan (Screen 18) | `EVENT_MANAGER`+ |
| `POST /api/v1/events/:eventId/vendor-engagements/:id/quotations` | Catat penawaran harga (*quotation*) baru untuk dibandingkan | `EVENT_MANAGER`, `FINANCE` |
| `PATCH /api/v1/events/:eventId/vendor-engagements/:id/status` | Perbarui status kerjasama vendor (`CONFIRMED`, `COMPLETED`, dll.) | `EVENT_MANAGER`+ |
| `GET /api/v1/organizations/:orgId/resources` | Daftar inventaris perlengkapan/fasilitas organisasi & ketersediaan (Screen 19) | Anggota Org |
| `POST /api/v1/organizations/:orgId/resources` | Tambah item inventaris baru (contoh: Proyektor Epson, HT Motorola) | `ADMIN`, `EVENT_MANAGER` |
| `POST /api/v1/events/:eventId/resource-bookings/check-conflict` | Simulasi cek bentrok jadwal real-time saat panitia mengisi form peminjaman (Screen 20) | Anggota Event |
| `POST /api/v1/events/:eventId/resource-bookings` | Buat pengajuan peminjaman perlengkapan | Panitia Berizin |
| `PATCH /api/v1/events/:eventId/resource-bookings/:id/decision` | Setujui (`APPROVED` dengan lock transaksi stok), tolak, atau catat pengembalian & kondisi barang | `ADMIN`, `EVENT_MANAGER` |

#### Modul 7: Budget (RAB), Pengajuan Biaya & Rekonsiliasi Keuangan
| Method & Path | Deskripsi Singkat | Hak Akses |
| :--- | :--- | :--- |
| `GET /api/v1/events/:eventId/budget/summary` | Kartu `plannedIdr`, `committedIdr`, `actualIdr`, `remainingIdr`, breakdown kategori & divisi (Screen 21) | Izin Budget |
| `PUT /api/v1/events/:eventId/budget/allocations` | Atur total pagu anggaran & alokasi per kategori/divisi (Screen 22) | `EVENT_MANAGER`, `FINANCE` |
| `GET /api/v1/events/:eventId/expenses` | Daftar pengajuan pengeluaran & antrean menunggu persetujuan (Screen 23) | Izin Budget / Pengaju |
| `POST /api/v1/events/:eventId/expenses` | Buat pengajuan pengeluaran baru (wajib `Idempotency-Key`) | `FINANCE`, `LEADER`, `EM` |
| `PATCH /api/v1/events/:eventId/expenses/:id` | Ubah detail pengajuan; bila status sebelumnya `APPROVED` & nominal berubah -> otomatis reset ke `UNDER_REVIEW` | Pengaju / `FINANCE` |
| `POST /api/v1/events/:eventId/expenses/:id/decision` | `APPROVE` atau `REJECT` pengajuan beserta catatan wajib | Approver Berizin |
| `POST /api/v1/events/:eventId/expenses/:id/payment` | Catat pembayaran aktual (`PAID`, metode bayar, nomor referensi, bukti transfer) -> menambah `actualIdr` | `FINANCE`, `EVENT_MANAGER` |
| `GET /api/v1/events/:eventId/finance-reports/export` | Unduh laporan rekonsiliasi keuangan format CSV / PDF (Screen 24) | `FINANCE`, `EVENT_MANAGER` |

#### Modul 8: Registrasi Peserta Publik, Tiket QR & Check-in Hari-H
| Method & Path | Deskripsi Singkat | Hak Akses |
| :--- | :--- | :--- |
| `PUT /api/v1/events/:eventId/registration-config` | Atur status buka/tutup form publik, kuota, approval, & field tambahan (Screen 25) | `EVENT_MANAGER`+ |
| `GET /api/v1/public/events/:eventSlug/registration` | Ambil informasi acara & konfigurasi form pendaftaran publik | `@Public()` |
| `POST /api/v1/public/events/:eventSlug/register` | Kirim pendaftaran peserta publik (rate-limited + `Idempotency-Key`) | `@Public()` |
| `GET /api/v1/public/tickets/:ticketCode` | Tampilkan E-Ticket & payload QR peserta yang sudah `APPROVED` (Screen 27) | `@Public()` (bertoken unik) |
| `GET /api/v1/events/:eventId/registrations` | Daftar pendaftar, filter status, pencarian nama/instansi (Screen 26) | Izin Peserta |
| `POST /api/v1/events/:eventId/registrations/:id/status` | Terima (`APPROVED` -> kirim email/WA tiket QR), tolak, atau masukkan `WAITLISTED` | Izin Peserta |
| `POST /api/v1/events/:eventId/check-in/scan` | **Validasi QR / Kode Tiket Atomik** oleh petugas hari-H (Screen 28) | `canManageCheckin` |
| `GET /api/v1/events/:eventId/attendance/summary` | Statistik pendaftar, diterima, hadir, belum hadir, & persentase kehadiran (Screen 29) | Anggota Event |

#### Contoh Respons Validasi Check-in (`POST /api/v1/events/:eventId/check-in/scan`)
```json
{
  "success": true,
  "data": {
    "status": "CHECKED_IN_SUCCESS",
    "registrationCode": "NCC27-00418",
    "participantName": "Bagas Pratama",
    "institution": "Universitas Indonesia",
    "checkedInAt": "2027-06-20T01:12:04.000Z",
    "checkedInDisplay": "08.12 WIB",
    "attendanceSnapshot": {
      "approvedTotal": 300,
      "checkedInTotal": 184,
      "attendanceRatePercent": 61.3
    }
  }
}
```

#### Modul 9: Dokumen, Notifikasi, Jejak Aktivitas, Laporan Akhir, Template & Langganan
| Method & Path | Deskripsi Singkat | Hak Akses |
| :--- | :--- | :--- |
| `POST /api/v1/uploads/presign` | Hasilkan Presigned PUT URL Cloudflare R2 / MinIO (`fileName`, `mimeType`, `sizeBytes`) | Terautentikasi |
| `GET /api/v1/events/:eventId/documents` | Daftar dokumen operasional event sesuai `visibilityScope` pengguna (Screen 30) | Anggota Event |
| `POST /api/v1/events/:eventId/documents` | Simpan metadata dokumen setelah upload ke R2 selesai | Panitia Berizin |
| `GET /api/v1/notifications` | Daftar notifikasi pengguna + jumlah belum dibaca (`unreadCount`) (Screen 31) | Terautentikasi |
| `PATCH /api/v1/notifications/read-all` | Tandai notifikasi sudah dibaca | Terautentikasi |
| `GET /api/v1/events/:eventId/activities` | Jejak audit perubahan beserta nilai sebelum/sesudah (Screen 32) | Anggota Event |
| `GET /api/v1/events/:eventId/reports/post-event` | Laporan terpadu operasional, keuangan, peserta & evaluasi vendor (Screen 35) | `EVENT_MANAGER`+ |
| `PUT /api/v1/events/:eventId/retrospective` | Simpan catatan evaluasi & pembelajaran pasca-acara (Screen 36) | `EVENT_MANAGER`, `LEADER` |
| `POST /api/v1/events/:eventId/create-template` | Ekstrak struktur acara ke `EventTemplate` bersih tanpa PII & transaksi (Screen 37) | `OWNER`, `ADMIN`, `EM` |
| `GET /api/v1/organizations/:orgId/subscription` | Lihat paket aktif, pemakaian kuota event/anggota, & riwayat tagihan (Screen 40) | `OWNER`, `ADMIN` |
| `POST /api/v1/organizations/:orgId/subscription/checkout` | Buat transaksi pembayaran paket baru via Midtrans/Xendit (QRIS / Virtual Account) | `OWNER` |
| `POST /api/v1/webhooks/payment-gateway` | Webhook verifikasi tanda tangan pembayaran lokal untuk aktivasi kuota otomatis | Signature Verified |

---

## 4. Kontrak Event Real-Time Hari-H (SSE `/live/stream`)

Saat Event Manager dan koordinator lapangan membuka **Screen 33 (Live Operations)** atau **Screen 29 (Attendance Dashboard)**, koneksi SSE menerima event ringan berformat berikut:

| Nama Event SSE | Pengirim | Payload Utama | Efek di Layar Panitia |
| :--- | :---: | :--- | :--- |
| `rundown.session_updated` | **BE-1** | `{ sessionId, status, actualStartAt, actualEndAt, delayMinutes }` | Memperbarui kartu sesi aktif & menggeser penanda keterlambatan secara langsung. |
| `task.blocker_changed` | **BE-1** | `{ taskId, title, status, divisionName, blockedReason }` | Menampilkan atau menghapus peringatan pada panel *Isu Operasional Terbuka*. |
| `checkin.counter_updated` | **BE-2** | `{ approvedTotal, checkedInTotal, attendanceRatePercent, lastCheckInAt }` | Menggerakkan angka kehadiran real-time setiap kali petugas pintu memindai QR peserta. |
| `resource.conflict_detected` | **BE-2** | `{ resourceId, resourceName, shortageQty }` | Memunculkan lencana perhatian pada panel perlengkapan. |
