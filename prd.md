**PRODUCT REQUIREMENTS DOCUMENT**

**FinSheet - Aplikasi Keuangan Perusahaan**

_Sistem Manajemen Keuangan Terintegrasi untuk Perusahaan_

| **Versi Dokumen**  | 1.0 (Draft)                |
| ------------------ | -------------------------- |
| **Tanggal Dibuat** | April 2026                 |
| **Status**         | Draft - Untuk Review       |
| **Tim Produk**     | Product & Engineering Team |
| **Klasifikasi**    | Rahasia & Konfidensial     |

# **Riwayat Revisi**

| **Versi** | **Tanggal** | **Deskripsi Perubahan**          | **Author**   |
| --------- | ----------- | -------------------------------- | ------------ |
| 1.0       | April 2026  | Dokumen awal - Draft PRD pertama | Product Team |

# **1\. Ikhtisar Produk**

## **1.1 Latar Belakang**

Banyak perusahaan, terutama skala menengah ke bawah, masih mengelola keuangan secara manual menggunakan spreadsheet (Microsoft Excel atau Google Sheets). Pendekatan ini rentan terhadap kesalahan manusia, sulit diaudit, tidak real-time, dan tidak mendukung kolaborasi tim yang efektif.

FinSheet hadir sebagai solusi aplikasi keuangan berbasis web yang dirancang khusus untuk memenuhi kebutuhan manajemen keuangan perusahaan secara terstruktur, aman, dan efisien - mulai dari pencatatan transaksi harian hingga pelaporan keuangan komprehensif.

## **1.2 Visi Produk**

_"Menjadi platform manajemen keuangan perusahaan yang paling mudah digunakan, transparan, dan dapat diandalkan - menggantikan spreadsheet manual dengan sistem yang cerdas, terintegrasi, dan real-time."_

## **1.3 Tujuan Produk**

- Menyederhanakan pencatatan pemasukan dan pengeluaran perusahaan
- Menyediakan visibilitas keuangan real-time kepada manajemen
- Mengurangi risiko kesalahan pencatatan keuangan manual
- Memfasilitasi proses audit keuangan yang lebih efisien
- Mendukung pengambilan keputusan bisnis berbasis data keuangan

## **1.4 Cakupan Produk**

Versi awal (MVP) FinSheet mencakup:

- Manajemen transaksi keuangan (pemasukan & pengeluaran)
- Dashboard ringkasan keuangan
- Manajemen anggaran per kategori
- Laporan keuangan dasar
- Manajemen pengguna dengan kontrol akses berbasis peran

Di luar cakupan MVP:

- Integrasi dengan software akuntansi pihak ketiga (e.g., Accurate, SAP)
- Modul payroll & penggajian
- Modul perpajakan otomatis

# **2\. Pemangku Kepentingan**

## **2.1 Target Pengguna**

| **Persona**      | **Peran**                | **Kebutuhan Utama**                          |
| ---------------- | ------------------------ | -------------------------------------------- |
| Admin Keuangan   | Staff Keuangan / Akuntan | Input transaksi, rekonsiliasi, cetak laporan |
| Manajer Keuangan | Kepala Keuangan / CFO    | Monitoring anggaran, persetujuan, analisis   |
| Direktur / Owner | Manajemen Puncak         | Dashboard ringkasan, laporan eksekutif       |
| IT Admin         | Administrator Sistem     | Manajemen user, keamanan, backup data        |

## **2.2 Pemangku Kepentingan Proyek**

- Product Owner: Bertanggung jawab atas visi produk dan prioritas fitur
- Product Manager: Pengelola backlog, komunikasi stakeholder, dan roadmap
- Engineering Lead: Arsitektur teknis dan estimasi pengembangan
- UI/UX Designer: Desain antarmuka dan pengalaman pengguna
- QA Engineer: Pengujian kualitas dan penjaminan mutu

# **3\. User Stories & Use Cases**

## **3.1 Epic: Manajemen Transaksi**

- Sebagai Admin Keuangan, saya ingin mencatat transaksi pemasukan dengan detail (tanggal, jumlah, kategori, deskripsi, bukti) agar catatan keuangan lengkap dan dapat diaudit.
- Sebagai Admin Keuangan, saya ingin mencatat transaksi pengeluaran dan menghubungkannya ke pos anggaran tertentu agar pengeluaran dapat dipantau terhadap anggaran.
- Sebagai Admin Keuangan, saya ingin mengedit atau membatalkan transaksi yang keliru dengan jejak audit (audit trail) agar integritas data terjaga.
- Sebagai Admin Keuangan, saya ingin mengunggah bukti transaksi (foto/PDF) agar dokumentasi keuangan lengkap.

## **3.2 Epic: Dashboard & Pelaporan**

- Sebagai Manajer Keuangan, saya ingin melihat dashboard ringkasan keuangan real-time (total pemasukan, pengeluaran, saldo, tren) agar dapat memantau kesehatan keuangan perusahaan.
- Sebagai Manajer Keuangan, saya ingin menghasilkan laporan Laba Rugi, Arus Kas, dan Neraca dalam format yang dapat diekspor (PDF, Excel).
- Sebagai Direktur, saya ingin melihat grafik tren keuangan bulanan/kuartalan/tahunan untuk mendukung pengambilan keputusan strategis.

## **3.3 Epic: Manajemen Anggaran**

- Sebagai Manajer Keuangan, saya ingin membuat anggaran per kategori untuk periode tertentu agar pengeluaran dapat dikontrol.
- Sebagai Manajer Keuangan, saya ingin mendapatkan notifikasi ketika pengeluaran mendekati atau melampaui batas anggaran.

## **3.4 Epic: Manajemen Pengguna**

- Sebagai IT Admin, saya ingin mengelola akun pengguna dan menetapkan peran (role) agar hak akses sesuai dengan tanggung jawab masing-masing.
- Sebagai IT Admin, saya ingin mengaktifkan autentikasi dua faktor (2FA) untuk meningkatkan keamanan akses.

# **4\. Persyaratan Fungsional**

## **4.1 Daftar Fitur & Prioritas**

| **ID** | **Fitur**                    | **Prioritas**    | **Estimasi (Sprint)** |
| ------ | ---------------------------- | ---------------- | --------------------- |
| F-001  | Manajemen Akun & Autentikasi | **Wajib**        | 2                     |
| F-002  | Dashboard Keuangan           | **Wajib**        | 3                     |
| F-003  | Pencatatan Pemasukan         | **Wajib**        | 2                     |
| F-004  | Pencatatan Pengeluaran       | **Wajib**        | 2                     |
| F-005  | Manajemen Anggaran (Budget)  | **Wajib**        | 2                     |
| F-006  | Laporan Keuangan             | **Wajib**        | 3                     |
| F-007  | Manajemen Kategori Transaksi | **Wajib**        | 1                     |
| F-008  | Ekspor & Impor Data          | **Penting**      | 2                     |
| F-009  | Notifikasi & Peringatan      | **Penting**      | 1                     |
| F-010  | Multi-Mata Uang              | **Nice-to-Have** | 2                     |
| F-011  | Rekonsiliasi Bank            | **Penting**      | 2                     |
| F-012  | Manajemen Aset & Liabilitas  | **Nice-to-Have** | 3                     |

## **4.2 Detail Persyaratan per Fitur**

### **F-001: Manajemen Akun & Autentikasi**

- Login dengan email & password dengan enkripsi bcrypt
- Autentikasi Dua Faktor (2FA) via aplikasi authenticator
- Sistem peran: Super Admin, Admin Keuangan, Manajer, Viewer
- Session timeout otomatis setelah periode tidak aktif (configurable)
- Log aktivitas login (IP, waktu, perangkat)

### **F-002: Dashboard Keuangan**

- Widget ringkasan: Total Pemasukan, Total Pengeluaran, Saldo Bersih (periode tertentu)
- Grafik batang: Perbandingan pemasukan vs pengeluaran per bulan
- Grafik donat: Distribusi pengeluaran per kategori
- Indikator anggaran: Progress bar per kategori vs realisasi
- Tabel 5 transaksi terbaru
- Filter periode: Hari ini, Minggu ini, Bulan ini, Kuartal, Tahun, Custom

### **F-003 & F-004: Pencatatan Pemasukan & Pengeluaran**

- Form input: Tanggal, Jumlah, Mata Uang, Kategori, Sub-kategori, Metode Pembayaran, Deskripsi, Referensi/Nomor Invoice, Tags
- Upload bukti transaksi (JPG, PNG, PDF, maks. 10MB per file)
- Validasi input real-time (format angka, tanggal, field wajib)
- Auto-suggest kategori berdasarkan riwayat transaksi
- Input transaksi berulang (recurring) dengan frekuensi konfigurasi
- Batch import transaksi via file CSV/Excel

### **F-005: Manajemen Anggaran**

- Buat anggaran per kategori untuk periode bulanan/kuartalan/tahunan
- Alokasi anggaran ke sub-kategori
- Perbandingan anggaran vs realisasi secara visual
- Notifikasi email/in-app saat penggunaan anggaran mencapai 75%, 90%, dan 100%
- Revisi anggaran dengan persetujuan Manajer (approval workflow)

### **F-006: Laporan Keuangan**

- Laporan Arus Kas (Cash Flow Statement)
- Laporan Laba Rugi (Income Statement)
- Laporan Neraca sederhana (Balance Sheet)
- Laporan Rincian Transaksi (dengan filter multi-dimensi)
- Laporan Ringkasan per Kategori
- Ekspor ke PDF (dengan kop perusahaan) dan Excel
- Penjadwalan laporan otomatis (email report bulanan)

### **F-008: Ekspor & Impor Data**

- Ekspor transaksi ke CSV, Excel (.xlsx), PDF
- Impor transaksi dari CSV dengan template yang disediakan
- Validasi dan preview data sebelum import final
- Log hasil import (berhasil, gagal, duplikat)

# **5\. Persyaratan Non-Fungsional**

## **5.1 Performa**

- Waktu muat halaman utama (dashboard): < 2 detik pada koneksi 10 Mbps
- Response API: 95% permintaan < 500ms, 99% < 1 detik
- Sistem mampu menangani minimal 200 pengguna konkuren
- Kapasitas penyimpanan transaksi: minimum 10 juta record per perusahaan

## **5.2 Keamanan**

- Enkripsi data saat transit: TLS 1.3
- Enkripsi data saat istirahat (at-rest): AES-256
- Semua input divalidasi untuk mencegah SQL Injection dan XSS
- Audit trail tidak dapat dihapus (immutable log) untuk seluruh operasi keuangan
- Backup otomatis harian dengan retensi 90 hari
- Penetration testing minimal 1 kali per tahun

## **5.3 Ketersediaan & Reliabilitas**

- Uptime SLA: 99.5% per bulan (downtime maks. ~3.6 jam/bulan)
- Recovery Time Objective (RTO): < 4 jam
- Recovery Point Objective (RPO): < 1 jam
- Maintenance window: Setiap Minggu pukul 02.00-04.00 WIB

## **5.4 Skalabilitas**

- Arsitektur mendukung horizontal scaling
- Desain multi-tenant untuk mendukung beberapa entitas perusahaan
- API dirancang RESTful untuk memudahkan integrasi di masa depan

## **5.5 Aksesibilitas & Kompatibilitas**

- Mendukung browser: Chrome, Firefox, Safari, Edge (versi 2 terakhir)
- Desain responsif: Optimal pada desktop (1280px+) dan tablet (768px+)
- Kompatibilitas WCAG 2.1 Level AA untuk aksesibilitas

# **6\. Desain UX & Antarmuka Pengguna**

## **6.1 Prinsip Desain**

- Clarity First: Informasi keuangan disajikan dengan jelas, tanpa ambiguitas
- Minimal Friction: Pencatatan transaksi harus dapat diselesaikan dalam < 5 langkah
- Consistent: Konsistensi visual, terminologi, dan interaksi di seluruh aplikasi
- Trust & Security: Desain yang mencerminkan kepercayaan dan keamanan data

## **6.2 Struktur Navigasi**

- Navigasi utama (sidebar): Dashboard, Transaksi, Anggaran, Laporan, Pengaturan
- Navigasi sekunder: Breadcrumb untuk sub-halaman
- Quick Action: Tombol floating '+' untuk input transaksi cepat

## **6.3 Komponen Utama UI**

- Design System berbasis komponen (atomic design)
- Palet warna: Biru perusahaan (#1B4F72) sebagai warna primer, dengan status colors (hijau=positif, merah=negatif, kuning=peringatan)
- Tipografi: Inter atau Roboto untuk keterbacaan optimal
- Grafik menggunakan library Chart.js atau Recharts

## **6.4 Wireframe & Prototipe**

Wireframe low-fidelity dan prototipe high-fidelity perlu dikembangkan oleh tim UI/UX sebelum development sprint dimulai. Tool yang direkomendasikan: Figma.

# **7\. Persyaratan Teknis**

## **7.1 Arsitektur Sistem**

- Arsitektur: Monolith modular untuk MVP, dengan rencana migrasi ke microservices pada fase berikutnya
- Pola: MVC (Model-View-Controller) di backend
- Komunikasi: RESTful API dengan JSON sebagai format data

## **7.2 Technology Stack (Rekomendasi)**

| **Layer**        | **Teknologi**              | **Keterangan**               |
| ---------------- | -------------------------- | ---------------------------- |
| Frontend         | React.js + TypeScript      | UI framework utama           |
| State Management | Zustand / Redux Toolkit    | Manajemen state global       |
| Backend          | Node.js + Express / NestJS | API server                   |
| Database         | PostgreSQL                 | Database utama relasional    |
| Cache            | Redis                      | Caching & session management |
| File Storage     | AWS S3 / MinIO             | Penyimpanan bukti transaksi  |
| Authentication   | JWT + Refresh Token        | Sistem autentikasi           |
| Deployment       | Docker + Kubernetes        | Containerisasi & orkestrasi  |
| CI/CD            | GitHub Actions             | Pipeline otomatis            |

## **7.3 Integrasi**

- Email Service: SendGrid / Nodemailer untuk notifikasi dan laporan email
- Notifikasi Push: Firebase Cloud Messaging (opsional, fase 2)
- Export Engine: PDFKit (PDF), ExcelJS (Excel)

# **8\. Metrik Keberhasilan**

## **8.1 Key Performance Indicators (KPI)**

| **Metrik**                 | **Target (6 Bulan)**          | **Target (12 Bulan)**         |
| -------------------------- | ----------------------------- | ----------------------------- |
| Monthly Active Users (MAU) | 80% dari total user terdaftar | 90% dari total user terdaftar |
| User Retention Rate        | \> 70%                        | \> 80%                        |
| Waktu Input Transaksi      | < 60 detik rata-rata          | < 45 detik rata-rata          |
| Tingkat Error Input        | < 5% transaksi perlu koreksi  | < 2% transaksi perlu koreksi  |
| Net Promoter Score (NPS)   | \> 30                         | \> 50                         |
| System Uptime              | \> 99.5%                      | \> 99.9%                      |

# **9\. Roadmap Pengembangan**

## **9.1 Fase 1 - MVP (Sprint 1-8, ~4 Bulan)**

- Sprint 1-2: Setup infrastruktur, autentikasi, manajemen pengguna & peran
- Sprint 3-4: Modul transaksi pemasukan & pengeluaran (CRUD lengkap)
- Sprint 5-6: Dashboard keuangan & visualisasi data
- Sprint 7-8: Manajemen anggaran, notifikasi dasar, laporan dasar, ekspor PDF/Excel

## **9.2 Fase 2 - Peningkatan (Sprint 9-14, ~3 Bulan)**

- Rekonsiliasi bank & import statement
- Laporan keuangan lanjutan (Neraca, Arus Kas, Laba Rugi)
- Approval workflow untuk transaksi & revisi anggaran
- Multi-mata uang dengan konversi otomatis

## **9.3 Fase 3 - Ekspansi (Sprint 15+)**

- Manajemen aset & liabilitas
- Integrasi API dengan bank lokal
- Aplikasi mobile (React Native)
- AI-powered insights & forecasting

# **10\. Risiko & Mitigasi**

| **Risiko**                   | **Kemungkinan** | **Dampak** | **Strategi Mitigasi**                                          |
| ---------------------------- | --------------- | ---------- | -------------------------------------------------------------- |
| Kebocoran data keuangan      | **Rendah**      | **Kritis** | Enkripsi end-to-end, audit keamanan rutin, penetration testing |
| Resistensi adopsi pengguna   | **Sedang**      | **Tinggi** | Pelatihan onboarding, UI intuitif, dukungan CS responsif       |
| Scope creep                  | **Tinggi**      | **Sedang** | Backlog prioritization ketat, change request process formal    |
| Keterlambatan pengembangan   | **Sedang**      | **Sedang** | Agile sprints, buffer waktu 20%, MVP fokus                     |
| Integrasi pihak ketiga gagal | **Rendah**      | **Sedang** | Fallback manual, API versioning, testing end-to-end            |

# **11\. Asumsi & Batasan**

## **11.1 Asumsi**

- Pengguna memiliki akses internet stabil minimal 1 Mbps
- Perusahaan klien menyediakan server/infrastruktur cloud atau bersedia menggunakan SaaS
- Data historis keuangan yang perlu di-migrasi telah dibersihkan sebelum import
- Tim keuangan memiliki pemahaman dasar penggunaan komputer dan browser

## **11.2 Batasan**

- Versi MVP tidak mencakup modul perpajakan - hanya pencatatan dasar
- Tidak ada integrasi real-time dengan rekening bank pada fase MVP
- Laporan keuangan bersifat internal - bukan format laporan audit eksternal resmi
- Satu instalasi untuk satu entitas perusahaan pada MVP (multi-tenant di fase 2)

# **12\. Glosarium**

| **Pemasukan**                        | Arus masuk uang ke kas perusahaan dari berbagai sumber pendapatan                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| **Pengeluaran**                      | Arus keluar uang dari kas perusahaan untuk berbagai keperluan operasional                   |
| **Anggaran (Budget)**                | Rencana keuangan yang menetapkan batas pengeluaran per kategori untuk periode tertentu      |
| **Rekonsiliasi**                     | Proses pencocokan catatan keuangan internal dengan laporan bank                             |
| **Audit Trail**                      | Log tidak dapat diubah yang mencatat semua perubahan data keuangan beserta identitas pelaku |
| **MVP**                              | Minimum Viable Product - versi produk dengan fitur paling esensial                          |
| **Sprint**                           | Periode pengembangan dalam metodologi Agile (biasanya 2 minggu)                             |
| **Role-Based Access Control (RBAC)** | Sistem kontrol akses berdasarkan peran pengguna dalam organisasi                            |

# **Persetujuan Dokumen**

Dokumen PRD ini telah ditinjau dan disetujui oleh pemangku kepentingan berikut:

| **Nama** | **Jabatan**      | **Tanda Tangan** | **Tanggal** |
| -------- | ---------------- | ---------------- | ----------- |
|          | Product Owner    |                  | April 2026  |
|          | Engineering Lead |                  | April 2026  |
|          | CFO / Sponsor    |                  | April 2026  |
|          | IT Security      |                  | April 2026  |
