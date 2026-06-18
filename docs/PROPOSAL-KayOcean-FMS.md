# PROPOSAL IMPLEMENTASI
# KayOcean — Forwarding Management System

---

**Nomor Proposal:** WDS/PROP/2026/001-REV.A  
**Tanggal:** 25 Mei 2026  
**Berlaku Sampai:** 25 Juni 2026  
**Diajukan oleh:** Wasilah Digital Sistem  
**Diajukan kepada:** PT Key Ocean Forwarding

---

## 1. Ringkasan Eksekutif

Wasilah Digital Sistem mengajukan proposal implementasi **KayOcean Forwarding Management System (FMS)**, yaitu platform digital terintegrasi yang dirancang untuk mendukung seluruh proses bisnis PT Key Ocean Forwarding mulai dari **lead management, quotation, sales order, job order, operasional shipment, invoicing, hingga laporan profitabilitas dan integrasi Accurate Online**.

Setelah dilakukan peninjauan ulang terhadap alur bisnis, kami menilai proposal sebelumnya masih belum menangkap proses awal penjualan secara utuh, karena langsung dimulai dari `quotation`. Padahal, kebutuhan bisnis yang lebih realistis untuk KayOcean adalah:

`Prospect -> Lead -> Qualified -> Customer -> Quotation -> Sales Order -> Job Order -> Invoice -> Payment`

Karena itu, proposal ini disusun sebagai **proposal utuh dan profesional** yang sudah memasukkan **modul CRM / Lead Management** sebagai fondasi awal proses sales. Dengan pendekatan ini, sistem tidak hanya kuat di operasional dan keuangan, tetapi juga mampu mengelola funnel penjualan dari awal sampai closing.

---

## 2. Latar Belakang

### 2.1 Kondisi Saat Ini

- Proses sales dan operasional masih tersebar di Excel, WhatsApp, email, dan dokumen manual.
- Belum ada sistem terpusat untuk memantau status lead, quotation, dan shipment.
- Proses follow-up sales belum terdokumentasi dengan baik.
- Quotation dan transaksi operasional belum memiliki jejak asal yang jelas dari pipeline sales.
- Profitabilitas per job order belum dapat dipantau secara real-time.
- Dokumen operasional dan komunikasi lintas tim belum terdokumentasi dalam satu platform.

### 2.2 Kebutuhan Bisnis

PT Key Ocean Forwarding membutuhkan sistem yang mampu:

- mendigitalisasi proses bisnis end-to-end dari lead sampai payment
- mendukung multi-cabang dan multi-user dengan role-based access
- mencatat aktivitas sales dan follow-up customer secara terstruktur
- mempercepat proses pembuatan quotation dan konversinya ke order
- memantau operasional shipment secara real-time
- mengintegrasikan transaksi ke Accurate Online
- menyediakan laporan manajerial yang akurat dan cepat

---

## 3. Tujuan Implementasi

Implementasi KayOcean FMS ditujukan untuk:

1. Meningkatkan efisiensi proses sales, operasional, dan finance.
2. Menyediakan alur kerja terintegrasi dari lead hingga invoice.
3. Mengurangi duplikasi data dan pekerjaan manual antar divisi.
4. Menyediakan visibilitas status transaksi dan profitabilitas secara real-time.
5. Menjadikan Accurate Online sebagai backend akuntansi yang terhubung langsung ke proses operasional.

---

## 4. Solusi yang Ditawarkan

### 4.1 Alur Bisnis Target

Sistem akan mendukung alur bisnis berikut:

1. Sales / Marketing membuat dan mengelola `Lead`
2. Follow-up lead dicatat dalam activity timeline
3. Lead yang potensial dinaikkan menjadi `Qualified`
4. Lead yang qualified dikonversi menjadi `Customer`
5. Sales membuat `Quotation`
6. Quotation melalui approval dan dikirim ke customer
7. Quotation yang disetujui dikonversi menjadi `Sales Order`
8. Sales Order dikonversi menjadi `Job Order`
9. Tim operasional menjalankan shipment, trucking, dan dokumentasi
10. Finance membuat invoice dan sinkronisasi ke Accurate Online
11. Sistem menyediakan monitoring, laporan, dan audit trail end-to-end

### 4.2 Modul Sistem

| No | Modul | Deskripsi |
|----|-------|-----------|
| 1 | **CRM & Lead Management** | Pengelolaan prospect, lead, qualified lead, follow-up, assignment, lost reason, dan timeline aktivitas sales |
| 2 | **Customer Management** | Master data customer, segmentasi, kontak, NPWP, credit limit, rating, dan histori transaksi |
| 3 | **Sales Quotation** | Pembuatan quotation multi-item berdasarkan jenis layanan, validitas, approval workflow, dan tracking status |
| 4 | **Sales Order** | Konfirmasi order dari quotation berikut payment terms, assignment, dan referensi transaksi |
| 5 | **Job Order** | Eksekusi operasional lengkap: shipment, booking, milestones, dokumen, vendor, dan cost/revenue |
| 6 | **Custom Clearance** | Tracking proses kepabeanan, dokumen PIB/PEB, dan milestone customs |
| 7 | **Trucking** | Assignment kendaraan, SPK, status perjalanan, POD, dan histori pengiriman darat |
| 8 | **Invoice AR** | Penagihan customer, billing multi-party, due date, payment tracking, dan aging |
| 9 | **Invoice AP** | Pengelolaan tagihan vendor, hutang operasional, dan approval pembayaran |
| 10 | **Approval System** | Multi-level approval untuk quotation, invoice, dan dokumen penting |
| 11 | **Control Center & Dashboard** | Monitoring real-time untuk lead funnel, quotation, order, shipment, dan alert operasional |
| 12 | **Reporting** | Laporan conversion funnel, quotation performance, profitability per JO/customer/cabang, dan export data |
| 13 | **Integrasi Accurate Online** | Sinkronisasi customer, AR/AP invoice, payment status, dan referensi kurs |
| 14 | **Master Data & Security** | User, role, cabang, vendor, service type, dan kontrol akses berbasis role |

### 4.3 Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | Next.js API Routes + Prisma ORM |
| Database | PostgreSQL (Supabase) |
| UI Design | SAP Fiori / enterprise-style dashboard |
| Integrasi | Accurate Online REST API |
| Hosting | VPS / Cloud Server |
| Auth & Access | Supabase Auth / JWT + RBAC |
| Document Output | Print-ready layout + PDF export |

### 4.4 Fitur Unggulan

- Alur end-to-end dari **lead sampai payment**
- Dashboard funnel sales dan conversion rate
- Approval workflow lintas divisi
- Integrasi langsung dengan Accurate Online
- Multi-cabang dengan RBAC
- Print/PDF dokumen operasional
- Audit trail dan histori aktivitas
- Responsive dan dapat diakses dari desktop maupun mobile browser

---

## 5. Ruang Lingkup Pekerjaan

Proposal ini mencakup:

- analisis proses bisnis dan finalisasi blueprint sistem
- desain database dan arsitektur aplikasi
- pengembangan frontend dan backend
- implementasi modul CRM, operasional, finance, dan reporting
- integrasi Accurate Online
- deployment ke server production
- training user dan dokumentasi penggunaan
- masa hypercare setelah go-live

Proposal ini tidak mencakup:

- pengembangan mobile app native terpisah
- integrasi ke sistem pihak ketiga selain Accurate Online, kecuali disepakati kemudian
- perubahan scope besar setelah blueprint disetujui

---

## 6. Timeline Implementasi

Durasi implementasi yang direkomendasikan untuk scope ini adalah **20 minggu**.

| Fase | Durasi | Fokus | Deliverable Utama |
|------|--------|-------|-------------------|
| **Fase 0** | 1 minggu | Discovery & Blueprint | Final flow bisnis, role matrix, approval matrix, blueprint modul |
| **Fase 1** | 2 minggu | Foundation & Master Data | Auth, RBAC, branch, user, struktur data inti, audit framework |
| **Fase 2** | 3 minggu | CRM & Lead Management | Lead pipeline, lead detail, assignment, follow-up, activity timeline |
| **Fase 3** | 2 minggu | Lead Conversion & Customer Sync | Lead ke customer, duplicate check, customer sync preparation |
| **Fase 4** | 3 minggu | Quotation & Approval | Quotation multi-item, approval workflow, status tracking, print/PDF |
| **Fase 5** | 4 minggu | Sales Order & Job Order | SO, JO, milestones, document handling, trucking, cost/revenue |
| **Fase 6** | 3 minggu | Finance, Accurate, Reports | AR/AP, Accurate integration, payment tracking, dashboard, laporan |
| **Fase 7** | 2 minggu | UAT, Training, Go-Live | UAT, bug fixing, training, deployment, hypercare |
|  | **Total** |  | **20 minggu** |

---

## 7. Task Utama per Fase

### 7.1 Fase 0 — Discovery & Blueprint

- workshop requirement dengan owner, sales, operasional, dan finance
- finalisasi status lead, quotation, sales order, dan job order
- finalisasi rule konversi lead ke customer
- finalisasi rule kapan quotation dan sinkronisasi Accurate dilakukan
- finalisasi blueprint data, API, dan dashboard

### 7.2 Fase 1 — Foundation & Master Data

- setup environment development, staging, production
- setup auth, role, branch scope, dan permission matrix
- penyusunan schema database inti
- implementasi shared activity log dan audit trail dasar
- setup notifikasi dasar dan struktur logging

### 7.3 Fase 2 — CRM & Lead Management

- CRUD lead dan prospect
- assignment sales owner / account owner
- activity timeline: call, email, meeting, visit, note
- next follow-up date dan reminder
- lost reason, re-open lead, dan filter pipeline
- dashboard funnel awal

### 7.4 Fase 3 — Lead Conversion & Customer Sync

- validasi sebelum convert lead
- duplicate customer checking
- create customer dari qualified lead
- relasi lead -> customer -> quotation
- activity log conversion
- sinkronisasi customer ke Accurate sesuai aturan bisnis

### 7.5 Fase 4 — Quotation & Approval

- pembuatan quotation per service type
- rate table dan kalkulasi nilai quotation
- approval draft -> review -> approved
- sent / accepted / rejected tracking
- numbering quotation
- template print / PDF quotation

### 7.6 Fase 5 — Sales Order & Job Order

- konversi quotation ke sales order
- konversi sales order ke job order
- numbering dokumen
- milestone operasional
- upload dokumen
- trucking assignment
- monitoring revenue dan cost per job order

### 7.7 Fase 6 — Finance, Accurate, Reports

- AR invoice dan AP invoice
- payment tracking
- sinkronisasi AR/AP ke Accurate Online
- sync payment status
- dashboard conversion funnel
- report quotation conversion dan profitability

### 7.8 Fase 7 — UAT, Training, Go-Live

- test end-to-end
- bug fixing prioritas tinggi
- training sales, ops, finance, dan admin
- deployment production
- go-live checklist
- hypercare minggu awal

---

## 8. Nilai Investasi

### 8.1 Prinsip Penetapan Investasi

Nilai investasi pada proposal ini disusun berdasarkan:

- penambahan scope **CRM & Lead Management** sebelum quotation
- durasi implementasi yang meningkat dari 15 minggu menjadi 20 minggu
- kebutuhan integrasi lintas modul sales, operasional, finance, dan accounting
- kebutuhan audit trail, approval workflow, dashboard, reporting, dan production hardening

Untuk scope end-to-end seperti ini, nilai investasi yang kami anggap **wajar dan kompetitif** adalah **Rp 295.000.000**.

Harga tersebut diposisikan sebagai harga custom development yang masih kompetitif untuk produk internal perusahaan freight forwarding dengan scope dan integrasi sedalam ini.

### 8.2 Rincian Biaya Pengembangan

| No | Item | Nilai (IDR) |
|----|------|-------------|
| 1 | Analisis bisnis, discovery, dan blueprint sistem | Rp 20.000.000 |
| 2 | UI/UX design, wireframe, dan prototype alur utama | Rp 18.000.000 |
| 3 | Pengembangan modul CRM & Lead Management | Rp 30.000.000 |
| 4 | Pengembangan Quotation, Approval, Sales Order, dan Job Order | Rp 82.000.000 |
| 5 | Pengembangan Finance, Accurate Integration, dan Reporting | Rp 48.000.000 |
| 6 | Pengembangan backend, API, database, auth, dan audit trail | Rp 52.000.000 |
| 7 | QA, UAT assistance, training, dan dokumentasi | Rp 25.000.000 |
| 8 | Deployment, hardening production, dan hypercare awal | Rp 20.000.000 |
|  | **TOTAL INVESTASI PENGEMBANGAN** | **Rp 295.000.000** |

### 8.3 Biaya Operasional Bulanan

| No | Item | Nilai / Bulan (IDR) |
|----|------|---------------------|
| 1 | VPS / Cloud Server production | Rp 500.000 |
| 2 | Database / Supabase / managed service | Rp 500.000 |
| 3 | Domain, SSL, dan email service dasar | Rp 100.000 |
| 4 | Backup, monitoring, dan maintenance server | Rp 250.000 |
| 5 | Support & maintenance aplikasi | Rp 3.500.000 |
|  | **TOTAL BULANAN** | **Rp 4.850.000** |

### 8.4 Opsi Pembayaran

**Opsi A — Pembayaran Bertahap**

| Termin | Waktu | Jumlah | Keterangan |
|--------|-------|--------|------------|
| DP | Awal proyek | Rp 88.500.000 (30%) | Kick-off, discovery, dan setup awal |
| Termin 2 | Setelah Fase 2 selesai | Rp 73.750.000 (25%) | CRM & Lead Management selesai |
| Termin 3 | Setelah Fase 5 selesai | Rp 73.750.000 (25%) | Core operational modules selesai |
| Pelunasan | Go-Live | Rp 59.000.000 (20%) | Final delivery dan handover |

**Opsi B — Retainer 24 Bulan**

- Rp 14.000.000 / bulan x 24 bulan = Rp 336.000.000
- termasuk maintenance aplikasi dan support pasca implementasi

### 8.5 Posisi Harga di Pasar

| Solusi | Perkiraan Harga | Catatan |
|--------|------------------|---------|
| SaaS freight forwarding | USD 50-500 / user / bulan | Cepat digunakan, tetapi sulit di-custom dan bergantung vendor |
| Custom development agency lokal | Rp 300-500 juta | Umumnya untuk scope end-to-end enterprise |
| Custom development regional / internasional | USD 20.000-100.000 | Kuat secara teknologi, tetapi biaya lebih tinggi |
| **KayOcean FMS (proposal ini)** | **Rp 295.000.000** | Scope end-to-end, custom, terintegrasi Accurate, lebih kompetitif |

---

## 9. Manfaat Implementasi

### 9.1 Efisiensi Operasional

- pengurangan waktu input dan koordinasi manual sebesar 50-70%
- satu sumber data terpusat untuk sales, ops, dan finance
- status transaksi lebih mudah dipantau tanpa ketergantungan pada chat pribadi

### 9.2 Kontrol Sales

- funnel sales dari prospect sampai quotation tercatat
- follow-up sales lebih disiplin karena ada reminder dan activity timeline
- conversion rate lead -> quotation -> order dapat diukur

### 9.3 Kontrol Keuangan

- profitability per job order terlihat lebih cepat
- invoice customer dan vendor lebih terkontrol
- sinkronisasi ke Accurate mengurangi double entry

### 9.4 ROI (Return on Investment)

Estimasi penghematan per bulan:

- efisiensi waktu staf lintas divisi = **Rp 15.000.000**
- pengurangan invoice / follow-up yang terlewat = **Rp 10.000.000**
- pengurangan kesalahan data dan rework = **Rp 5.000.000**
- **total estimasi manfaat = sekitar Rp 30.000.000 / bulan**

Dengan total investasi pengembangan Rp 295.000.000, estimasi **payback period** adalah sekitar **10 bulan**, belum termasuk manfaat manajerial berupa kontrol, transparansi, dan kesiapan scale-up cabang.

---

## 10. Tim Proyek

| Peran | Tanggung Jawab |
|-------|----------------|
| Project Manager | Koordinasi proyek, timeline, risk tracking, komunikasi dengan klien |
| Business Analyst / System Analyst | Requirement gathering, SOP mapping, blueprint sistem |
| Lead Developer | Arsitektur, backend, integrasi, deployment |
| Frontend Developer | UI implementation, workflow screens, print/PDF layout |
| QA Engineer | Test case, regression test, UAT support |
| PIC Klien | Klarifikasi requirement, review proses, UAT, approval deliverable |

---

## 11. Asumsi dan Dependensi

Proposal ini menggunakan asumsi berikut:

1. Klien menyediakan akses Accurate Online yang diperlukan untuk integrasi.
2. Klien menyediakan data master awal: user, cabang, customer, vendor, dan referensi layanan.
3. PIC dari sales, operasional, dan finance tersedia untuk workshop dan UAT.
4. Perubahan besar pada proses bisnis setelah blueprint disetujui dapat memengaruhi timeline dan biaya.
5. Scope proyek dibekukan setelah fase discovery untuk menjaga kepastian delivery.

---

## 12. Garansi dan Support

| Item | Ketentuan |
|------|-----------|
| Garansi bug fix | 6 bulan setelah go-live |
| Response time support | Maksimal 4 jam kerja untuk tiket prioritas tinggi |
| Maintenance bulanan | Minor enhancement, monitoring, backup, dan preventive maintenance |
| Training | 2 sesi training utama + dokumentasi digital |
| Dokumentasi | SOP, panduan penggunaan, dan handover document |
| Kepemilikan source code | Diserahkan kepada klien setelah pelunasan |

---

## 13. Syarat dan Ketentuan

1. Proposal berlaku selama 30 hari sejak tanggal penerbitan.
2. Harga belum termasuk PPN 12%.
3. Perubahan scope di luar blueprint yang disetujui akan dibahas sebagai change request.
4. Integrasi pihak ketiga di luar Accurate Online akan dihitung terpisah.
5. Klien bertanggung jawab atas keakuratan data master awal yang diberikan.
6. Jadwal implementasi dapat berubah bila terjadi keterlambatan approval, data, atau akses pihak ketiga.
7. Wasilah Digital dapat mencantumkan proyek ini sebagai portofolio tanpa membuka data sensitif operasional klien.

---

## 14. Penutup

Kami meyakini bahwa implementasi KayOcean FMS akan memberikan dampak nyata terhadap efisiensi operasional, kualitas kontrol sales, dan akurasi pengelolaan keuangan PT Key Ocean Forwarding.

Dengan memasukkan modul **Lead Management** sejak awal, proposal ini menjadi lebih lengkap dan lebih sesuai dengan kebutuhan bisnis nyata perusahaan. Sistem yang dibangun tidak hanya berfungsi sebagai alat operasional, tetapi juga sebagai platform manajemen pertumbuhan bisnis.

Kami siap mendiskusikan proposal ini lebih lanjut dan menyesuaikan detail implementasi agar tetap selaras dengan prioritas bisnis PT Key Ocean Forwarding.

---

**Hormat kami,**

**Wasilah Digital Sistem**  
Email: info@wasilah.digital  
Website: wasilah.digital

---

*Dokumen ini bersifat rahasia dan ditujukan khusus untuk PT Key Ocean Forwarding.*
