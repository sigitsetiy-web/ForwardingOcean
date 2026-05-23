# PROPOSAL IMPLEMENTASI
# KayOcean — Forwarding Management System

---

**Nomor Proposal:** WDS/PROP/2026/001  
**Tanggal:** 16 Mei 2026  
**Berlaku Sampai:** 16 Juni 2026  
**Diajukan oleh:** Wasilah Digital Sistem  
**Diajukan kepada:** PT Key Ocean Forwarding

---

## 1. RINGKASAN EKSEKUTIF

Wasilah Digital Sistem mengajukan proposal implementasi **KayOcean Forwarding Management System (FMS)** — sebuah platform digital terintegrasi yang dirancang khusus untuk mengoptimalkan seluruh alur kerja operasional perusahaan jasa freight forwarding.

Sistem ini mencakup pengelolaan quotation, sales order, job order, kepabeanan, trucking, invoicing (AR/AP), hingga pelaporan profitabilitas — terintegrasi dengan **Accurate Online** sebagai backend akuntansi.

---

## 2. LATAR BELAKANG

### 2.1 Kondisi Saat Ini
- Proses operasional masih manual/semi-manual (Excel, WhatsApp, email)
- Tidak ada sistem terpusat untuk tracking status pengiriman
- Kesulitan menghitung profitabilitas per job order secara real-time
- Dokumen tersebar di berbagai tempat
- Komunikasi tim tidak terdokumentasi

### 2.2 Kebutuhan
- Sistem digital terintegrasi end-to-end
- Real-time monitoring seluruh job order
- Kalkulasi profit otomatis
- Integrasi dengan Accurate Online
- Multi-cabang, multi-user dengan role-based access
- Aksesibel dari mana saja (web-based)

---

## 3. SOLUSI YANG DITAWARKAN

### 3.1 Modul Sistem

| No | Modul | Deskripsi |
|----|-------|-----------|
| 1 | **Sales Quotation** | Pembuatan penawaran harga dengan SAP Fiori UI, multi-item, approval workflow |
| 2 | **Sales Order** | Konfirmasi order dari quotation, payment terms, assignment |
| 3 | **Job Order** | Eksekusi operasional lengkap: booking, customs, trucking, cost monitoring |
| 4 | **Custom Clearance** | PIB/PEB, jalur pabean, PDRI calculation, SPPB tracking |
| 5 | **Trucking** | Assignment kendaraan, tracking status, POD |
| 6 | **Invoice AR** | Multi-party billing, Faktur Pajak, payment tracking, aging |
| 7 | **Invoice AP** | Vendor invoice + internal fleet cost, approval workflow |
| 8 | **Control Center** | Dashboard real-time: Kanban, Timeline, Table view |
| 9 | **Chat System** | Internal messaging, JO-linked threads, document sharing |
| 10 | **Approval System** | Multi-level approval dengan notifikasi real-time |
| 11 | **Laporan** | Profitabilitas per JO/customer/cabang, export CSV |
| 12 | **Integrasi Accurate** | Sync customer, AR/AP invoice, payment status, kurs |
| 13 | **Master Data** | Pelanggan (dari Accurate), Cabang, User, Vendor |

### 3.2 Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| UI Design | SAP Fiori / SAP B1 Theme |
| Backend | Next.js API Routes + Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Integrasi | Accurate Online REST API |
| Hosting | VPS / Cloud Server |
| Real-time | Polling + Notification System |

### 3.3 Fitur Unggulan
- ✅ Desain enterprise-grade (SAP Fiori style)
- ✅ Multi-cabang dengan RBAC (9 role)
- ✅ Integrasi langsung ke Accurate Online
- ✅ Real-time dashboard & control center
- ✅ Internal chat terintegrasi dengan JO
- ✅ PWA — bisa di-install sebagai app di desktop/mobile
- ✅ Responsive — bisa diakses dari HP
- ✅ Buku panduan digital (PDF downloadable)

---

## 4. TIMELINE IMPLEMENTASI

| Fase | Durasi | Deliverable |
|------|--------|-------------|
| **Fase 1** — Setup & Core | 4 minggu | Login, Master Data, Quotation, Approval |
| **Fase 2** — Operations | 4 minggu | Sales Order, Job Order, Customs, Trucking |
| **Fase 3** — Finance | 3 minggu | Invoice AR/AP, Payment, Laporan |
| **Fase 4** — Integration | 2 minggu | Accurate Online, Dashboard, Chat |
| **Fase 5** — UAT & Go-Live | 2 minggu | Testing, Training, Go-Live |
| **Total** | **15 minggu** | |

---

## 5. INVESTASI

### 5.1 Biaya Pengembangan

| No | Item | Harga (IDR) |
|----|------|-------------|
| 1 | Analisis & Desain Sistem | Rp 15.000.000 |
| 2 | Pengembangan Frontend (13 modul, SAP Fiori UI) | Rp 85.000.000 |
| 3 | Pengembangan Backend & API (28 endpoints) | Rp 45.000.000 |
| 4 | Database Design & Setup (PostgreSQL, 25+ tabel) | Rp 10.000.000 |
| 5 | Integrasi Accurate Online | Rp 20.000.000 |
| 6 | Chat System & Real-time Features | Rp 15.000.000 |
| 7 | Control Center (Kanban/Timeline/Table) | Rp 15.000.000 |
| 8 | Testing & QA | Rp 10.000.000 |
| 9 | Deployment & Server Setup | Rp 5.000.000 |
| 10 | Training & Dokumentasi (SOP + Buku Panduan) | Rp 10.000.000 |
| 11 | Project Management | Rp 10.000.000 |
| | **SUBTOTAL PENGEMBANGAN** | **Rp 240.000.000** |

### 5.2 Biaya Berlangganan (Bulanan)

| No | Item | Harga/Bulan (IDR) |
|----|------|-------------------|
| 1 | VPS Server (4GB RAM, 80GB SSD) | Rp 300.000 |
| 2 | Database Supabase (Pro Plan) | Rp 400.000 |
| 3 | Domain & SSL | Rp 50.000 |
| 4 | Maintenance & Support | Rp 2.500.000 |
| | **TOTAL BULANAN** | **Rp 3.250.000** |

### 5.3 Perbandingan Harga Pasar

| Solusi | Harga | Catatan |
|--------|-------|---------|
| **Software SaaS Freight (Linbis, GoFreight)** | $50-500/user/bulan | Tidak customizable, data di luar negeri |
| **Custom Development (Agency Jakarta)** | Rp 300-500 juta | Referensi: Logique.co.id |
| **Custom Development (International)** | $20,000-$100,000 | Referensi: SpdLoad, Clockwise |
| **Oaktree.id (Lokal)** | Rp 150-300 juta | Fitur terbatas |
| **KayOcean FMS (Proposal ini)** | **Rp 240 juta** | Full custom, integrasi Accurate, SAP UI |

### 5.4 Opsi Pembayaran

**Opsi A — Pembayaran Bertahap:**
| Termin | Waktu | Jumlah | Keterangan |
|--------|-------|--------|------------|
| DP | Awal proyek | Rp 72.000.000 (30%) | Kick-off |
| Termin 2 | Fase 2 selesai | Rp 72.000.000 (30%) | Operations module |
| Termin 3 | Fase 4 selesai | Rp 48.000.000 (20%) | Integration |
| Pelunasan | Go-Live | Rp 48.000.000 (20%) | Final delivery |

**Opsi B — Pembayaran Bulanan (24 bulan):**
- Rp 12.000.000/bulan × 24 bulan = Rp 288.000.000
- Termasuk maintenance & support

---

## 6. GARANSI & SUPPORT

| Item | Ketentuan |
|------|-----------|
| Garansi Bug Fix | 6 bulan setelah go-live (gratis) |
| Response Time | Maks. 4 jam (hari kerja) |
| Maintenance Bulanan | Update minor, backup, monitoring |
| Training | 2 sesi training (online/onsite) |
| Dokumentasi | SOP lengkap + Buku Panduan digital |
| Source Code | Diserahkan sepenuhnya kepada klien |

---

## 7. KEUNTUNGAN IMPLEMENTASI

### 7.1 Efisiensi Operasional
- Pengurangan waktu input data: **60-70%**
- Eliminasi duplikasi data antar departemen
- Tracking real-time tanpa perlu tanya via WA

### 7.2 Kontrol Keuangan
- Profit per JO terlihat real-time
- Invoice tidak terlewat (reminder otomatis)
- AP vendor terkontrol dengan approval

### 7.3 Skalabilitas
- Mudah tambah cabang baru
- Mudah tambah user baru
- Sistem bisa berkembang sesuai kebutuhan

### 7.4 ROI (Return on Investment)
Estimasi penghematan per bulan:
- Efisiensi waktu staff (5 orang × 2 jam/hari × Rp 50.000/jam) = **Rp 15.000.000/bulan**
- Pengurangan invoice terlewat (2 invoice × Rp 5.000.000) = **Rp 10.000.000/bulan**
- Pengurangan kesalahan data = **Rp 5.000.000/bulan**
- **Total penghematan: ~Rp 30.000.000/bulan**
- **Payback period: ~8 bulan**

---

## 8. TIM PROYEK

| Peran | Nama | Tanggung Jawab |
|-------|------|----------------|
| Project Manager | Wasilah Digital | Koordinasi, timeline, deliverable |
| Lead Developer | Wasilah Digital | Arsitektur, coding, deployment |
| UI/UX Designer | Wasilah Digital | Desain SAP Fiori, responsiveness |
| QA Engineer | Wasilah Digital | Testing, bug tracking |
| **PIC Klien** | PT Key Ocean | Requirement, UAT, feedback |

---

## 9. SYARAT & KETENTUAN

1. Proposal berlaku 30 hari sejak tanggal penerbitan
2. Harga belum termasuk PPN 12%
3. Perubahan scope setelah kick-off akan dikenakan biaya tambahan
4. Klien menyediakan akses Accurate Online (API Token)
5. Klien menyediakan data master awal (pelanggan, cabang, user)
6. Source code menjadi milik klien setelah pelunasan
7. Wasilah Digital berhak mencantumkan sebagai portfolio (tanpa data sensitif)

---

## 10. PENUTUP

Kami yakin implementasi KayOcean FMS akan memberikan dampak signifikan terhadap efisiensi operasional dan kontrol keuangan PT Key Ocean Forwarding. Dengan pengalaman kami dalam pengembangan sistem enterprise dan pemahaman mendalam terhadap industri freight forwarding, kami siap menjadi mitra teknologi jangka panjang.

Kami menantikan kesempatan untuk berdiskusi lebih lanjut mengenai proposal ini.

---

**Hormat kami,**

**Wasilah Digital Sistem**  
Email: info@wasilah.digital  
Website: wasilah.digital  

---

*Dokumen ini bersifat rahasia dan ditujukan hanya untuk PT Key Ocean Forwarding.*
