# EventOps — Website End-to-End Experience

> **Tujuan dokumen:** menjelaskan bentuk website EventOps ketika sudah jadi dan dapat digunakan, dari pengunjung pertama kali membuka website sampai event selesai, dievaluasi, dan disimpan sebagai template.
>
> Dokumen ini berfokus pada **pengalaman pengguna, halaman, konten yang terlihat, tindakan pengguna, dan hasil dari tindakan tersebut**. Ini bukan spesifikasi teknis, arsitektur, database, API, atau roadmap pengembangan.

## 1. Gambaran website jadi

EventOps adalah website SaaS untuk mengelola operasional penyelenggaraan event. Pengguna masuk untuk mengatur organisasi, event, kepanitiaan, task, jadwal, vendor, perlengkapan, anggaran, peserta, hingga evaluasi.

Saat Event Manager membuka EventOps, ia dapat mengetahui kondisi event tanpa harus mencari informasi dari berbagai chat atau spreadsheet: apa yang sudah selesai, apa yang terlambat, siapa PIC-nya, apa yang menghambat, dan hal mana yang perlu ditangani.

**Karakter pengalaman:**

- Semua kegiatan berada dalam konteks organisasi dan event.
- Tiap event memiliki workspace khusus.
- Informasi operasional saling berhubungan.
- Setiap pekerjaan jelas PIC, status, prioritas, dan deadline.
- Perubahan penting dapat ditelusuri.
- Tampilan dan tindakan mengikuti akses pengguna.

EventOps bukan website pencarian event, marketplace vendor, atau platform ticketing sebagai produk utama. Fokusnya adalah koordinasi dan kontrol pekerjaan di balik acara.

## 2. Skenario contoh untuk memvisualisasikan produk

Contoh fiktif ini digunakan sepanjang dokumen supaya gambaran layar lebih nyata.

| Data          | Contoh                                   |
| ------------- | ---------------------------------------- |
| Organisasi    | Event Creative Committee                 |
| Event         | National Creative Conference 2027        |
| Tanggal       | 20 Juni 2027                             |
| Lokasi        | Jakarta                                  |
| Event Manager | Rafi                                     |
| Divisi        | Program, Publication, Logistics, Finance |
| Bentuk acara  | Seminar dan conference sehari            |

Nama, tanggal, angka, progres, status, dan isi contoh di dokumen ini adalah ilustrasi, bukan data aktual.

## 3. Peta halaman (sitemap)

```text
Public Website
├── Landing Page
├── Features / Product Overview
├── Pricing (bila paket ditampilkan)
├── Register
└── Login

Authenticated App
├── My Workspace
│   ├── My Tasks
│   ├── My Events
│   ├── Invitations
│   └── Notifications
└── Organization Workspace (organization switcher)
    ├── Overview
    ├── Events
    │   └── Event Workspace
    │       ├── Overview / Dashboard
    │       ├── Team & Divisions
    │       ├── Tasks
    │       ├── Preparation Timeline
    │       ├── Rundown
    │       ├── Vendors
    │       ├── Resources
    │        ├── Budget & Expenses
    │       ├── Participants / Registration
    │       ├── Documents
    │       ├── Reports & Evaluation
    │       └── Event Settings
    ├── Members
    ├── Organization Settings
    └── Subscription & Usage
```

## 4. Perjalanan pengguna secara end-to-end

### Stage 1 — Pengunjung mengenal EventOps

#### Screen 1: Landing Page

Pengunjung yang belum login membuka website.

**Bagian halaman:**

- Navbar: logo EventOps, Product/Features, Pricing (jika ada), Login, CTA **Get Started**.
- Hero: headline **“Make every event organized, visible, and accountable.”**
- Penjelasan ringkas: satukan pekerjaan panitia, jadwal, vendor, kebutuhan, dan anggaran dalam satu workspace.
- CTA utama: **Get Started / Create Workspace**.
- CTA sekunder: **Explore Features**.
- Visual produk: mockup dashboard/event workspace.
- Ringkasan fitur: event planning, team & task, timeline & rundown, vendors & resources, budget, participant check-in, reports.
- Bagian akhir: ajakan mencoba/membuat workspace.

**Yang dipahami pengunjung:** EventOps membantu mengelola operasional event, bukan mencari event atau menjual tiket.

#### Screen 2: Register / Login

Get Started membawa pengguna ke pendaftaran akun. Pengguna lama memilih Login.

**Register:** nama, email, password, validasi input, tombol Create Account, link Login.

**Login:** email, password, tombol Sign In, link Register.

Setelah berhasil masuk, pengguna diarahkan ke workspace yang tersedia. Jika belum memiliki organisasi atau belum bergabung ke organisasi, ia masuk ke onboarding.

### Stage 2 — Membuat atau bergabung dengan organisasi

#### Screen 3: Onboarding — Create or Join Organization

Pengguna melihat pilihan utama, bukan dashboard kosong:

- **Create an Organization** — membuat workspace baru.
- **Join an Organization** — bergabung menggunakan undangan.

Penjelasan singkat: organisasi adalah tempat anggota mengelola event dan data kerja bersama.

#### Screen 4: Create Organization

Form organisasi berisi Organization Name, logo (opsional), deskripsi (opsional), dan informasi dasar lainnya. Pengguna yang membuat organisasi menjadi **Owner**.

Setelah klik Create, organisasi dibuat dan halaman Organization Overview terbuka.

#### Screen 5: Invite Members (opsional)

Owner dapat mengundang anggota sekarang atau melewati langkah ini.

- Input email undangan.
- Role organisasi (Organization Admin atau Member).
- Daftar invite yang disiapkan.
- **Send Invitations** dan **Skip for now**.

Penerima memperoleh undangan untuk menerima atau menolak. Owner dapat melihat status Pending, Accepted, Rejected, Expired, atau Revoked.

### Stage 3 — Organization Workspace

#### Screen 6: Organization Overview

Ini adalah pusat workspace organisasi. Navigasi organisasi dapat berupa sidebar yang konsisten.

**Navigasi:** Overview, Events, Members, Organization Settings, Subscription & Usage. Header berisi organization switcher (bila pengguna berada di beberapa organisasi), pencarian, notifications, dan profil.

**Isi dashboard:**

1. Summary cards: Total Events, Active Events, Upcoming Events, Completed Events.
2. Upcoming Events: event berikutnya dengan tanggal, status, lokasi, dan progress singkat.
3. Events Needing Attention: event dengan deadline terlewat atau masalah penting.
4. Recent Activity: aktivitas organisasi.
5. Member Overview: ringkasan anggota.
6. Usage / Plan: pemakaian kuota jika fitur subscription aktif.

**Contoh kartu event:**

```text
National Creative Conference 2027
20 Jun 2027 · Jakarta
Preparation · 62% task completion
[Open Event]
```

Kartu ini menjadi shortcut untuk masuk ke event yang sedang dikelola.

#### Screen 7: Events — daftar event organisasi

Halaman Events menampilkan semua event milik organisasi.

- Judul Events dan tombol **+ Create Event**.
- Search dan filter status, tanggal/periode, Event Manager.
- Cards atau list view.
- Tiap item: cover/ikon, nama, tanggal, lokasi, status, Event Manager, progress ringkas, dan aksi buka.

Status yang dapat terlihat: Draft, Planning, Preparation, Ready, Ongoing, Completed, Cancelled, Archived. Pengguna berwenang dapat membuka, mengedit, mengarsipkan, atau membatalkan event.

### Stage 4 — Membuat event

#### Screen 8: Create Event

Create Event membuka form (halaman atau wizard) dengan field:

- Event name dan description
- Category
- Start date / end date
- Start time / end time
- Location dan time zone
- Event Manager
- Participant capacity (optional)
- Cover / visual event (optional)

Aksi: **Save Draft** atau **Create Event**. Setelah disimpan, event muncul pada daftar organisasi dan pengguna masuk ke Event Workspace.

### Stage 5 — Event Workspace sebagai pusat operasional

Event Workspace adalah ruang kerja utama event. Nama event dan konteks (tanggal, lokasi, status) tetap terlihat. Menu event menyediakan Overview, Team, Tasks, Timeline, Rundown, Vendors, Resources, Budget, Participants, Documents, Reports, dan Settings sesuai fitur/akses yang tersedia.

#### Screen 9: Event Overview / Dashboard

**Header:** nama event, tanggal, lokasi, status, Event Manager.

**Panel dashboard:**

1. **Event Readiness** — kesiapan berdasarkan kriteria penting.
2. **Task Progress** — jumlah total, completed, in progress, overdue, blocked.
3. **Critical Issues** — masalah yang perlu ditindaklanjuti.
4. **Upcoming Milestones** — tanggal penting yang mendekat.
5. **Team & Divisions** — ringkasan struktur panitia.
6. **Vendor Status** — status konfirmasi vendor.
7. **Resource Status** — kebutuhan dan ketersediaan barang/fasilitas.
8. **Budget Snapshot** — planned, committed, actual, remaining.
9. **Recent Activity** — perubahan terbaru.

**Ilustrasi tampilan data:**

```text
NATIONAL CREATIVE CONFERENCE 2027
20 June 2027 · Jakarta · PREPARATION

READINESS: NEEDS ATTENTION
Tasks:                 42 / 68 completed
Overdue:                5
Blocked:                 2
Vendors confirmed:       6 / 8
Resource conflicts:       1
Planned budget:          Rp50.000.000
Actual expense:          Rp12.450.000

NEEDS ATTENTION
- Backdrop design approval is pending
- 2 logistics tasks are blocked
- Projector booking conflict detected

UPCOMING MILESTONES
- Technical Meeting — 10 June
- Final Equipment Check — 18 June
- Event Day — 20 June
```

Dashboard tidak sekadar menampilkan angka: isu dapat dibuka untuk menuju task, vendor, resource, atau item anggaran yang terkait.

#### Screen 10: Event Details / Settings

Event Manager membuka Settings untuk melihat atau mengubah informasi event, tanggal/waktu, lokasi, kapasitas, penanggung jawab, cover, status, dan anggota event. Cancel Event memerlukan konfirmasi dan alasan. Archive mengubah event menjadi arsip dan membatasi aktivitas normal. Perubahan penting masuk ke history.

### Stage 6 — Menyusun tim

#### Screen 11: Team & Divisions

Halaman ini memperlihatkan struktur kepanitiaan event.

**Komponen layar:** jumlah anggota, daftar divisi, leader, anggota, **Create Division**, **Add Event Member/Invite**, search/filter.

**Contoh struktur tim:**

```text
Event Manager: Rafi
├── Program Division
│   ├── Leader: Nadia
│   └── Members: Dimas, Fajar
├── Publication Division
│   ├── Leader: Alya
│   └── Members: Bima, Sinta
├── Logistics Division
│   ├── Leader: Reza
│   └── Members: Ardi, Naufal
└── Finance Division
    ├── Leader: Putri
    └── Member: Maya
```

Pengguna membuka divisi untuk melihat deskripsi, pemimpin, anggota, dan tugas divisi. Seorang anggota dapat bergabung dengan beberapa divisi sesuai kebutuhan.

### Stage 7 — Mengelola pekerjaan

#### Screen 12: Tasks — Kanban Board

Task Board adalah layar harian untuk mengatur pekerjaan. Board memiliki kolom status:

- Backlog
- To Do
- In Progress
- In Review
- Blocked
- Completed

Cancelled dapat dilihat melalui filter atau status, tidak harus menjadi kolom aktif.

**Task card berisi:** judul, divisi, assignee, deadline, priority, status, indikator komentar/lampiran.

**Kontrol:** Create Task, search, filter divisi/assignee/priority/deadline, filter overdue, dan switch Kanban/List View.

Task dapat dipindah status. Overdue diberi penanda waktu; Blocked menampilkan penyebab/dependency. Status update tercatat di activity history.

#### Screen 13: Task Detail

Klik task membuka drawer/panel detail atau halaman detail tanpa kehilangan konteks board.

**Isi panel:** title, description, status, priority, division, assignee, creator, dates, subtasks/checklist, dependency, attachments, comments, dan activity history. Pengguna yang berwenang dapat edit/update status.

**Contoh task:**

```text
Finalisasi Poster Conference
Division: Publication · Assignee: Alya
Priority: High · Due: 5 June · Status: In Review
Checklist:\u2611 Draft poster
 Revisi sponsor logo
 Approval Event Manager
```

Di komentar, anggota dapat menyampaikan revisi, menanyakan detail, atau memberikan update terkait task. File hasil pekerjaan dapat dilampirkan. Activity history mencatat perubahan seperti assignee, deadline, dan status.

#### Screen 14: My Tasks (personal workspace)

Anggota yang membuka My Tasks melihat pekerjaan miliknya, bukan seluruh board event.

- Task assigned to me.
- Deadline terdekat.
- Overdue tasks.
- Tasks menunggu review.
- Filter status dan event.

Anggota dapat membuka detail, memperbarui status, menambahkan komentar/attachment, dan menandai hambatan. Ini menjadi landing yang praktis bagi anggota panitia.

### Stage 8 — Timeline persiapan dan rundown hari acara

#### Screen 15: Preparation Timeline

Timeline memetakan milestone dan aktivitas sebelum event.

**Contoh milestone:**
| Tanggal | Milestone |
|---|---|
| 1 Mei | Registration opens |
| 5 Mei | Promotional post stage 2 |
| 10 Mei | Speaker confirmation |
| 15 Mei | Technical meeting |
| 19 Juni | Final equipment check |
| 20 Juni | Event day |

Pengguna dapat menambah/edit milestone, menetapkan tanggal, PIC, menghubungkan task, dan melihat progres. Timeline membantu Event Manager memahami urutan pekerjaan dan tenggat besar.

#### Screen 16: Rundown

Rundown berbeda dari timeline persiapan: rundown berisi susunan sesi pada hari acara.

**Tampilan:** daftar/grid agenda berdasarkan waktu dan (bila diperlukan) lokasi atau hari. Setiap sesi berisi nama, waktu mulai/selesai, durasi, lokasi, PIC, divisi, deskripsi, kebutuhan teknis, status.

**Contoh rundown:**
| Waktu | Agenda | PIC | Status |
|---|---|---|---|
| 08.00–09.00 | Registration & Welcome | Registration Team | Planned |
| 09.00–09.15 | Opening | MC / Program | Planned |
| 09.15–10.00 | Keynote Session | Program | Planned |
| 10.00–10.15 | Break | Logistics | Planned |
| 10.15–11.30 | Panel Discussion | Program | Planned |

Pengguna dapat mengurutkan sesi, mengubah waktu/durasi, menghubungkan task, menetapkan PIC, dan mencatat actual start/end saat acara berlangsung. Planned time tetap tersimpan; actual time dicatat terpisah. Perubahan rundown dapat memicu pemberitahuan kepada PIC terkait.

### Stage 9 — Mengelola vendor dan perlengkapan

#### Screen 17: Vendors

Halaman vendor merupakan database organisasi sekaligus daftar vendor yang terlibat pada event.

**Vendor list:** nama, kategori, kontak, status engagement, vendor yang digunakan event, search/filter.

**Vendor detail:** kontak, email/telepon, alamat, catatan, dokumen, histori kerja sama, engagement event, ruang lingkup layanan, quotation.

**Status vendor:** Prospect, Contacted, Quotation Received, Under Review, Approved, Confirmed, Completed, Cancelled.

Event Manager dapat menambahkan vendor, mencatat quotation, membandingkan penawaran, memilih/meninjau vendor, menetapkan scope dan jadwal, dan menandai konfirmasi. Confirmed tidak berarti pembayaran otomatis lunas.

#### Screen 18: Vendor Engagement / Quotation

Pada detail keterlibatan vendor, pengguna melihat vendor yang terkait dengan event, layanan yang disepakati, jadwal, harga/quotation, dokumen, status, dan catatan. Beberapa quotation dapat dibandingkan sebelum keputusan dibuat. Perubahan harga/status penting memiliki histori.

#### Screen 19: Resources

Resource page mengelola barang/fasilitas yang dimiliki, disewa, disediakan vendor, atau dipinjam.

**Tampilan daftar resource:** nama, kategori, jumlah tersedia, kondisi, lokasi penyimpanan, pemilik, status ketersediaan.

**Detail resource:** inventaris, kondisi, booking yang sedang berjalan, jadwal penggunaan, permintaan, pengembalian, kondisi sebelum/sesudah.

#### Screen 20: Resource Booking / Request

Panitia memilih resource, jumlah, tanggal dan rentang waktu, event, serta catatan kebutuhan. Sistem memeriksa ketersediaan dan konflik. Booking yang belum disetujui tidak dianggap alokasi final.

**Contoh konflik:** organisasi memiliki 3 proyektor; Event A meminta 2 dan Event B meminta 2 pada waktu bersamaan. Sistem menampilkan warning karena kebutuhan 4 unit melebihi 3 unit tersedia. Pengguna dapat membuka konflik dan menyesuaikan jumlah, waktu, atau sumber peminjaman.

### Stage 10 — Anggaran dan pengeluaran

#### Screen 21: Budget Overview

Finance dashboard menampilkan ringkasan kondisi keuangan event.

**Summary cards:** Planned Budget, Committed, Actual Expense, Remaining. Di bawahnya terdapat alokasi per kategori/divisi, breakdown, daftar expense, dan pengajuan yang menunggu approval.

**Contoh kategori:** Venue, Equipment, Speakers, Catering, Publication, Transport, Other.

Pengguna dapat membandingkan rencana dana dengan komitmen dan transaksi aktual. Angka committed, actual, dan remaining ditampilkan dengan definisi/status yang jelas, tidak digabung menjadi satu nilai ambigu.

#### Screen 22: Budget Allocation

Finance Staff atau pengguna berizin mengatur total budget dan kategori. Setiap kategori dapat memiliki planned amount dan alokasi per divisi. Pengguna dapat melihat total alokasi dibanding total budget, dan sistem menandai jika alokasi melampaui batas.

#### Screen 23: Expense Request / Expense Detail

Pengajuan biaya menampilkan:

- Nama/tujuan pengeluaran.
- Kategori dan divisi.
- Nominal.
- Requester.
- Vendor (jika relevan).
- Tanggal.
- Bukti/quotation/attachment.
- Status dan catatan approval.

**Alur di layar:** Finance Staff membuat request → mengisi detail dan bukti → Submit → Approver membuka daftar pending → melihat detail → Approve atau Reject beserta catatan → requester mendapat pemberitahuan. Setelah transaksi benar-benar dibayar, pembayaran dicatat sehingga actual expense diperbarui sesuai aturan.

Status yang terlihat: Draft, Submitted, Under Review, Approved, Rejected, Paid, Cancelled. Perubahan nominal setelah approval memerlukan approval ulang; transaksi yang sudah dibayar tidak dihapus lewat alur normal.

#### Screen 24: Finance Reports

Laporan menampilkan total planned, committed, actual, remaining, pengeluaran per kategori dan per divisi, serta item pending approval. Pengguna dapat melihat detail transaksi dan mengekspor laporan jika fungsi export tersedia.

### Stage 11 — Registrasi peserta dan check-in

#### Screen 25: Participant / Registration Setup

Event Manager mengatur form registrasi publik: field yang diminta, kapasitas, dan apakah pendaftaran memerlukan approval. Data peserta hanya mengumpulkan informasi yang dibutuhkan.

#### Screen 26: Registration List

Daftar pendaftar menampilkan informasi yang diizinkan, status (Pending, Approved, Rejected, Cancelled, Waitlisted), waktu pendaftaran, dan filter. Pengguna berwenang dapat membuka detail, menerima/menolak, atau mengelola data.

#### Screen 27: Ticket / QR

Ketika registrasi diterima, peserta memperoleh tiket atau kode registrasi dengan identifier unik dan QR, jika fitur tiket/QR telah diaktifkan.

#### Screen 28: Check-in

Pada hari event, petugas membuka halaman check-in untuk memindai atau memvalidasi QR. Setelah QR valid, status check-in dicatat beserta waktu dan petugas/perangkat. QR yang sama tidak bisa digunakan untuk check-in kedua kali; peserta cancelled tidak dapat check-in.

#### Screen 29: Attendance Dashboard

Event team melihat jumlah pendaftar, accepted, hadir, belum hadir, dan attendance rate. Data dapat ditinjau atau diekspor sesuai permission.

### Stage 12 — Documents, notifications, dan aktivitas

#### Screen 30: Documents

Area Documents menjadi tempat file operasional event yang mudah ditemukan (misalnya dokumen venue, proposal, surat, quotation, rundown final, atau materi briefing). Dokumen memiliki konteks event dan kontrol akses. Attachment task/vendor/expense juga tetap dapat diakses dari item asalnya.

#### Screen 31: Notification Center

Pengguna membuka ikon notifikasi untuk melihat hal yang relevan:

- Undangan organisasi.
- Ditambahkan ke event.
- Task assignment.
- Deadline mendekat.
- Task overdue atau blocked.
- Rundown berubah.
- Expense menunggu approval atau diputuskan.
- Konflik resource.

Notifikasi dapat dibuka untuk menuju item terkait. Notifikasi bukan pengganti activity history.

#### Screen 32: Activity History

Activity feed menampilkan siapa melakukan apa, objek yang berubah, waktu, nilai sebelum/sesudah jika relevan, dan alasan jika diwajibkan. Feed dapat difilter berdasarkan waktu, aktivitas, atau objek. Notifikasi bersifat pemberitahuan; history adalah jejak catatan.

### Stage 13 — Hari pelaksanaan event

#### Screen 33: Event Day / Live Operations View

Pada hari event, Event Manager membuka Event Workspace dan memusatkan perhatian pada rundown, isu aktif, dan kesiapan operasional.

**Yang ditampilkan:**

- Rundown saat ini dan agenda berikutnya.
- Planned versus actual time.
- PIC tiap sesi.
- Status sesi (Planned, In Progress, Completed, atau status pelaksanaan yang disepakati).
- Isu operasional yang masih terbuka.
- Check-in / attendance summary.
- Vendor dan resource yang perlu perhatian.
- Shortcut untuk membuka item terkait.

Event Manager atau PIC dapat memperbarui status sesi, mencatat waktu aktual, dan menginformasikan keterlambatan/perubahan. Perubahan penting disimpan dan diteruskan kepada orang terkait, bukan seluruh anggota tanpa alasan.

### Stage 14 — Event selesai, evaluasi, dan arsip

#### Screen 34: Mark Event Completed

Setelah event selesai, Event Manager menandai event Completed sesuai izin dan melengkapi data yang masih diperlukan. Sistem tetap menyediakan proses penutupan, rekonsiliasi, dan evaluasi; Completed bukan berarti semua data langsung terkunci tanpa kemungkinan koreksi berizin.

#### Screen 35: Post-Event Reports

Laporan akhir mengumpulkan informasi lintas modul:

- **Operational:** task completion, on-time completion, overdue, blocked, progres timeline, rundown actualization.
- **Financial:** planned, committed, actual, remaining, expense by category/division.
- **Participant:** pendaftar, peserta diterima, hadir, attendance rate, feedback.
- **Vendor:** ketepatan waktu, kesesuaian scope, kualitas, catatan kerja sama.

Pengguna dapat membuka angka ringkasan untuk melihat detail sumber data. Export tersedia jika fungsi tersebut diaktifkan.

#### Screen 36: Event Retrospective

Event Manager/team mengisi evaluasi:

- Hal yang berjalan baik.
- Masalah yang terjadi.
- Penyebab.
- Dampak.
- Solusi yang dilakukan.
- Rekomendasi event berikutnya.

Retrospective menyimpan pembelajaran, bukan hanya angka. Tim dapat meninjau kembali evaluasi sebelum event serupa dibuat.

#### Screen 37: Archive Event / Create Template

Event yang selesai dapat diarsipkan. Event archived menjadi referensi dengan aktivitas normal yang dibatasi.

Pilihan berikutnya:

- **Archive Event** — menyimpan event sebagai catatan historis.
- **Create Template from Event** — mengambil struktur yang berguna untuk event berikutnya: divisi, task, timeline, rundown awal, kategori budget, dan checklist.

Data transaksi dan data pribadi peserta tidak disalin otomatis ke template. Pengguna membuat event baru dari template, lalu menyesuaikan tanggal, lokasi, anggota, task, dan detail event.

## 5. Area website di luar event

### Screen 38: Members

Organization Members menampilkan anggota organisasi, role, status, dan pengelolaan undangan. Owner/Admin dapat mengundang, mengubah role sesuai izin, menonaktifkan anggota, atau melihat status undangan. Anggota yang dinonaktifkan kehilangan akses ke workspace organisasi.

### Screen 39: Organization Settings

Pengaturan organisasi meliputi profil, pengelolaan role, kebijakan akses, preferensi notifikasi, dan pengaturan organisasi lain yang tersedia. Perubahan akses penting dapat tercatat.

### Screen 40: Subscription & Usage

Jika monetisasi subscription diterapkan, halaman ini menampilkan plan, kuota event/anggota, penggunaan saat ini, batas paket, dan opsi upgrade/downgrade. Pengguna tidak dikejutkan oleh batas penggunaan; informasi kuota ditampilkan transparan. Saat paket berakhir/kuota terlampaui, kebijakan grace period atau read-only diterapkan dengan jelas dan data tidak dihapus mendadak.

### Screen 41: Profile & Personal Preferences

Menu profil berisi informasi akun dan preferensi pribadi, termasuk pengaturan notifikasi yang tersedia, serta akses ke workspace yang diikuti. Ini menjadi tempat pengguna mengelola preferensi dirinya, bukan data organisasi.

## 6. Perbedaan pengalaman berdasarkan role

| Role               | Gambaran halaman utama dan fokus                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| Organization Owner | Organization dashboard, event lintas organisasi, anggota, settings, usage, kontrol penuh sesuai kebijakan |
| Organization Admin | Overview dan pengelolaan anggota/settings sesuai izin                                                     |
| Event Manager      | Event dashboard, kesiapan, isu, semua modul event sesuai permission                                       |
| Division Leader    | Divisi sendiri, board task, assignee, deadline, kebutuhan, blocker, laporan divisi                        |
| Committee Member   | My Tasks, deadline, task detail, komentar, file, update status, event yang diikutinya                     |
| Finance Staff      | Budget, expense requests, approvals yang diizinkan, transaksi, finance reports                            |
| Viewer / Client    | Ringkasan dan item/dokumen yang dibagikan; tidak dapat mengubah data                                      |

Pengguna tidak otomatis melihat seluruh data hanya karena menjadi anggota organisasi atau event. Akses budget, data peserta, vendor, dan approval dapat dibatasi.

## 7. Bagaimana satu perubahan terlihat di seluruh website

EventOps terasa terintegrasi karena satu item dapat memengaruhi halaman lain.

### Contoh A — Task poster belum di-approve

1. Publication membuat task poster dan menetapkan Alya sebagai PIC.
2. Task muncul di Kanban, My Tasks Alya, dan ringkasan dashboard.
3. Alya mengunggah revisi dan mengubah status menjadi In Review.
4. Event Manager mendapat pemberitahuan untuk review.
5. Jika approval belum selesai dan publikasi bergantung padanya, task publikasi berikutnya terlihat blocked.
6. Setelah disetujui, task bergerak ke tahap berikutnya; history tetap menyimpan perubahan.

### Contoh B — Rundown berubah

1. Event Manager mengubah waktu sesi panel.
2. Rundown menyimpan revisi; planned time terbaru ditampilkan.
3. PIC terkait diberi notifikasi perubahan.
4. Task, kebutuhan teknis, dan resource yang berkaitan ditampilkan agar dapat ditinjau.
5. Waktu aktual pada hari event tetap dicatat terpisah dari waktu rencana.

### Contoh C — Resource bentrok

1. Logistics meminta proyektor untuk event.
2. Sistem memeriksa jumlah dan rentang waktu terhadap booking lain.
3. Jika kapasitas tidak cukup, conflict warning muncul.
4. Pengguna membuka detail bentrok dan menyesuaikan booking.
5. Setelah disetujui, resource dialokasikan; cancellation melepaskan alokasi.

### Contoh D — Pengeluaran diajukan

1. Finance membuat expense request dan melampirkan bukti.
2. Request masuk ke daftar approval.
3. Approver memeriksa, menyetujui atau menolak.
4. Status dan keputusan dicatat; requester diberi notifikasi.
5. Setelah pembayaran dicatat, nilai actual expense diperbarui.

## 8. Status yang pengguna akan sering temui

### Event

Draft → Planning → Preparation → Ready → Ongoing → Completed → Archived

Event juga dapat berstatus Cancelled. Ready sebaiknya ditentukan dari checklist/kriteria readiness, bukan sekadar dropdown status; override oleh Event Manager perlu alasan dan history.

### Task

Backlog → To Do → In Progress → In Review → Completed

Task dapat menjadi Blocked atau Cancelled. Overdue adalah kondisi deadline terlewati, bukan status task tersendiri.

### Vendor engagement

Prospect → Contacted → Quotation Received → Under Review → Approved → Confirmed → Completed

Engagement dapat Cancelled. Confirmed bukan bukti pembayaran lunas.

### Expense request

Draft → Submitted → Under Review → Approved → Paid

Request juga dapat Rejected atau Cancelled. Actual hanya merepresentasikan transaksi yang benar-benar terjadi.

### Registration

Pending → Approved / Rejected / Waitlisted

Registrasi dapat Cancelled. Check-in hanya sekali untuk QR/tiket valid.

## 9. Gambaran navigasi yang konsisten

```text
[Organization switcher]                         [Search] [Notifications] [Profile]

Organization Sidebar                Main Content
-------------------                ----------------------------------
Overview                           Dashboard / table / board / detail
Events                            Event list
Members                            Member list & invitations
Organization Settings              Settings
Subscription & Usage               Plan / usage

Saat masuk Event:
[Back to Organization] [Event name] [Date] [Status]

Event Navigation
---------------
Overview
Team & Divisions
Tasks
Timeline
Rundown
Vendors
Resources
Budget & Expenses
Participants
Documents
Reports & Evaluation
Event Settings
```

Navigasi harus menjaga konteks pengguna: ketika pindah ke modul, pengguna tetap tahu organisasi dan event mana yang sedang dikelola.

## 10. End-to-end journey ringkas dalam satu alur

```text
Buka EventOps
   ↓
Landing page → Register / Login
   ↓
Create Organization atau Join Organization
   ↓
Organization Dashboard
   ↓
Create Event
   ↓
Event Workspace
   ↓
Bentuk Team & Divisions
   ↓
Buat Tasks → Assign PIC → Deadline → Update Status
   ↓
Susun Preparation Timeline dan Rundown
   ↓
Kelola Vendors dan Resources
   ↓
Kelola Budget → Expense Request → Approval → Payment Record
   ↓
Buka Registration → Peserta mendaftar → Validasi → QR/ticket
   ↓
Event Day: Rundown aktual + Check-in + Monitor issues
   ↓
Event Completed
   ↓
Reports → Finance reconciliation → Feedback → Retrospective
   ↓
Archive event / Create template untuk acara selanjutnya
```

## 11. Kesan akhir produk

Ketika EventOps sudah jadi, pengguna seharusnya merasa bahwa:

- **Saya tahu event apa yang sedang berjalan dan mana yang butuh perhatian.**
- **Saya tahu pekerjaan saya, PIC, deadline, dan prioritasnya.**
- **Saya dapat melihat apakah divisi lain atau kebutuhan terkait menghambat pekerjaan saya.**
- **Saya tidak perlu mencari status terbaru di banyak tempat.**
- **Saya bisa mengontrol jadwal, vendor, perlengkapan, dan anggaran.**
- **Saat event berlangsung, rundown dan status aktual dapat dipantau.**
- **Setelah event, saya punya laporan dan pembelajaran untuk kegiatan berikutnya.**

Inti website bukan sekadar menyediakan banyak menu. Website harus membuat seluruh proses penyelenggaraan event terasa sebagai satu alur yang terhubung: **rencana → tim → pekerjaan → kebutuhan → pelaksanaan → evaluasi → reuse**.

---

## 12. Hal yang masih berupa asumsi visual / perlu keputusan produk

Blueprint asal belum menetapkan seluruh detail UI secara final. Bagian berikut merupakan pilihan visual atau pengalaman yang perlu dikonfirmasi saat desain produk dibuat:

- Bentuk final navigasi (sidebar, topbar, atau kombinasi).
- Cards versus tabel pada daftar event, vendor, resource, dan peserta.
- Wizard atau satu form panjang untuk create event.
- Drawer versus halaman penuh untuk detail task.
- Apakah My Workspace menjadi landing default setelah login.
- Tampilan public registration dan mekanisme approval.
- Tampilan live operations khusus hari acara.
- Fitur export, plan pricing, dan batas kuota yang benar-benar masuk versi awal.

Dokumen ini sengaja mengisi celah dengan **gambaran pengalaman yang masuk akal untuk memvisualisasikan produk**, bukan menganggap pilihan UI tersebut sudah menjadi keputusan final.
