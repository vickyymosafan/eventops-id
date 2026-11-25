# DESIGN.md — Kontrak Sistem Desain EventOps Indonesia

Dokumen ini mengunci pilihan desain antarmuka EventOps mengacu pada katalog resmi `craftrig://design-options` dan batasan identitas visual `craftrig://development-principles`. Seluruh pengembangan UI oleh **FE-1** dan **FE-2** wajib mengikuti token di dokumen ini agar tampilan aplikasi terasa satu kesatuan produk SaaS kelas profesional, bukan gabungan halaman yang berbeda gaya.

---

## 1. Keputusan Menu Desain Craftrig (`craftrig://design-options`)

| Parameter ID | Pilihan EventOps | Alasan Produk (Konteks EO & Kepanitiaan Indonesia) |
| :--- | :--- | :--- |
| `personality` | `modern-minimal` | Fokus pada kejelasan status operasional, tabel, Kanban, dan rundown tanpa dekorasi berlebihan. |
| `themeMode` | `light-and-dark` | Mode terang nyaman untuk rapat siang & administrasi keuangan; mode gelap krusial bagi panitia *backstage*/FOH saat *Live Operations* & *Scan QR* di venue redup. |
| `sectionPolarity` | `follow-active-theme` | Konsisten mengikuti tema aktif dengan pembeda permukaan (*surface*) yang tegas. |
| `themeToggle` | `three-way-system` | Pilihan *Terang / Gelap / Ikuti Sistem* di menu profil & header. |
| `lightCanvasTone` | `soft-tinted-neutral` | Latar kanvas `#F8FAFC` (Slate-50) agar kartu putih `#FFFFFF` dan kolom Kanban terlihat terpisah bersih tanpa bayangan tebal. |
| `colorFamily` | `slate-emerald` | Basis netral *Slate/Charcoal* dipadu aksen utama *Emerald* (`#059669` / `#10B981`) yang melambangkan kesiapan operasional (*Ready/Confirmed*). **Tanpa warna pink** sesuai aturan identitas visual. |
| `colorHarmony` | `neutral-with-single-accent` | 85% antarmuka memakai warna netral tenang agar warna status (Hijau/Kuning-Amber/Merah/Biru-Navy) langsung terbaca sebagai sinyal tindakan. |
| `accentUsage` | `functional-beacons` | Warna mencolok hanya dipakai untuk CTA utama, indikator kesiapan, keterlambatan (*overdue*), bentrok alat, dan status persetujuan. |
| `headingFont` | `plus-jakarta-sans` | Karya desainer tipografi Indonesia, modern, tegas untuk judul halaman, nama acara, dan angka ringkasan dashboard. |
| `bodyFont` | `inter` | Keterbacaan tinggi pada ukuran kecil (`13px–14px`) untuk kartu Kanban, tabel anggaran, dan daftar peserta. |
| `monoFont` | `jetbrains-mono` | Wajib digunakan (`tabular-nums`) untuk jam rundown (`08.00–09.15`), nominal Rupiah (`Rp50.000.000`), kuota stok, dan kode tiket QR agar kolom angka lurus sempurna. |
| `typeScale` | `minor-third-compact` | Skala padat terukur untuk aplikasi SaaS operasional yang memuat banyak informasi dalam satu layar. |
| `fontWeightStyle` | `balanced` | `400` untuk isi, `500` untuk label tabel/navigasi, `600–700` untuk judul & metrik utama. |
| `layoutPattern` | `sidebar-dashboard` | Sidebar kiri yang menjaga konteks Organisasi & Event (sesuai Bab 9 Blueprint), serta *Bento/Grid* terstruktur pada halaman Overview. |
| `density` | `comfortable` (dengan toggle `compact` di tabel/Kanban) | Nyaman untuk anggota baru, namun mendukung tampilan rapat bagi Event Manager & Finance. |
| `maxContentWidth` | `1440px` (`full-bleed` khusus Kanban & Rundown) | Kanban 6 kolom dan tabel keuangan membutuhkan ruang horizontal penuh di layar laptop/monitor. |
| `navigation` | `sidebar` + `bottom-tab-bar-mobile` (khusus mode lapangan) | Di desktop memakai sidebar kontekstual; di layar HP saat Hari-H menyediakan akses cepat ke *Rundown*, *Scan QR*, dan *Tugas Saya*. |
| `shape` | `rounded-md` (`8px` kartu, `6px` kontrol/input) | Tegas dan rapi; hindari bentuk kapsul (`pill-full`) berlebihan kecuali untuk indikator status kecil. |
| `surface` | `solid-with-border` | Permukaan solid dengan border `1px` tajam (`border-slate-200` / `dark:border-slate-800`), bebas efek kaca (*glassmorphism*) atau gradasi generik AI. |
| `iconStyle` | `outline-lucide` | Konsisten memakai `lucide-react` ukuran `16px–20px` dengan ketebalan garis `1.75px`. |
| `imagery` | `real-product-screenshots` | Landing page menampilkan pratinjau UI dashboard EventOps yang nyata dan interaktif, bukan ilustrasi stok generik. |
| `motionLevel` | `subtle-purposeful` | Transisi `150ms–200ms` untuk buka-tutup drawer detail task, perpindahan kartu Kanban, dan umpan balik berhasil scan QR. Menghormati `prefers-reduced-motion`. |
| `interactionFeedback` | `focus-ring`, `skeleton-loading`, `toast-notifications` | Wajib menyediakan kerangka *skeleton* saat memuat data dan notifikasi *toast* (`sonner`) yang jelas. |
| `accessibilityTarget` | `wcag-aa` | Kontras teks minimal `4.5:1`, seluruh aksi dapat dioperasikan dengan keyboard (`Tab`, `Enter`, `Esc`), dan area sentuh tombol mobile minimal `44x44px` (penting untuk petugas Check-in!). |
| `responsivePriority` | `equal-priority` | Perencanaan anggaran/vendor dominan di Desktop, sedangkan *My Tasks*, *Live Rundown*, dan *Scan QR Peserta* dominan dipakai di Smartphone panitia lapangan. |
| `contentTone` | `clear-professional` | Bahasa Indonesia lugas, sopan, langsung ke pokok tindakan, tanpa kalimat terjemahan kaku. |
| `language` | `id` | Bahasa Indonesia penuh untuk seluruh antarmuka pengguna. |

---

## 2. Token Warna Semantik (`packages/ui/src/styles/tokens.css`)

**Larangan Keras:** Dilarang menggunakan warna pink/magenta/rose maupun gradasi ungu-biru generik AI di komponen mana pun.

| Token Semantik | Light Mode | Dark Mode | Kegunaan Spesifik di EventOps |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#F8FAFC` (Slate 50) | `#090D16` (Slate 950) | Latar utama ruang kerja aplikasi |
| `--bg-surface` | `#FFFFFF` | `#111827` (Gray 900) | Kartu ringkasan, baris tabel, panel drawer |
| `--bg-subtle` | `#F1F5F9` (Slate 100) | `#1E293B` (Slate 800) | Latar kolom Kanban, header tabel, hover item sidebar |
| `--border-default` | `#E2E8F0` (Slate 200) | `#1F2937` (Gray 800) | Garis pembatas utama antarkomponen |
| `--text-primary` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Judul, nama task, angka nominal utama |
| `--text-secondary` | `#475569` (Slate 600) | `#94A3B8` (Slate 400) | Subjudul, nama divisi, metadata tanggal |
| `--brand-primary` | `#0F172A` (Navy/Slate 900) | `#10B981` (Emerald 500) | Tombol aksi utama, indikator navigasi aktif |
| `--accent-operational` | `#059669` (Emerald 600) | `#34D399` (Emerald 400) | Status `Ready`, `Completed`, `Confirmed`, `Paid`, Check-in Valid |
| `--status-info` | `#1D4ED8` (Blue 700) | `#60A5FA` (Blue 400) | Status `In Progress`, `In Review`, `Submitted`, `Ongoing` |
| `--status-warning` | `#D97706` (Amber 600) | `#FBBF24` (Amber 400) | Status `Needs Attention`, tenggat H-3, kuota hampir penuh, `Waitlisted` |
| `--status-danger` | `#DC2626` (Red 600) | `#F87171` (Red 400) | Status `Blocked`, `Overdue`, Bentrok Resource, `Rejected`, QR Ganda/Tidak Valid |

---

## 3. Pola Komponen Wajib Seragam Lintas Tim (`FE-1` & `FE-2`)

1. **Header Konteks Event (Selalu Terlihat di Dalam Event Workspace):**
   Menampilkan breadcrumb kembali ke Organisasi, Nama Event, Tanggal & Zona Waktu (`20 Jun 2027 · WIB`), Lokasi, Badge Status Event (`PREPARATION`), serta tombol cepat ke *Live Mode* saat hari acara.
2. **Format Angka & Waktu Terstandar (`packages/ui/src/lib/formatters.ts`):**
   - `formatRupiah(50000000)` -> `Rp50.000.000` (tanpa `,00` di belakang untuk tampilan ringkas dashboard, dengan font `tabular-nums`).
   - `formatTanggalIndo(date, tz)` -> `20 Jun 2027` atau `Sabtu, 20 Juni 2027`.
   - `formatRentangJam(start, end, tz)` -> `08.00–09.15 WIB` (menggunakan titik pemisah jam-menit sesuai EYD V).
3. **Drawer Detail Kontekstual:**
   Klik pada kartu Task (Screen 13), pengajuan Expense (Screen 23), atau item Vendor Engagement (Screen 18) membuka **Slide-over Drawer kanan (`width: 560px–680px` di desktop, layar penuh di mobile)** dengan URL sinkron (`?taskId=...`) agar link bisa dibagikan ke grup chat panitia tanpa menghilangkan posisi scroll halaman utama.
4. **Halaman Kamera Scan QR Hari-H (Screen 28):**
   Dirancang khusus *thumb-friendly* untuk layar HP satu tangan: umpan balik warna layar penuh + getar/suara singkat (**Hijau Besar** = Berhasil Check-in + Nama Peserta, **Merah Besar** = Sudah Pernah Check-in jam sekian / Dibatalkan), dilengkapi kolom pencarian manual nama/kode tiket jika kamera HP terkendala cahaya.
