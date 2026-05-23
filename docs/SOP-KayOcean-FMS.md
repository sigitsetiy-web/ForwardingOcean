# 📋 STANDAR OPERASIONAL PROSEDUR (SOP)
# KayOcean — Forwarding Management System

**Versi:** 1.0  
**Tanggal:** 16 Mei 2026  
**Dibuat oleh:** Wasilah Digital Sistem  
**Untuk:** PT Key Ocean Forwarding

---

## 📌 DAFTAR ISI

1. [Pendahuluan](#1-pendahuluan)
2. [Alur Bisnis Utama](#2-alur-bisnis-utama)
3. [Login & Akses Sistem](#3-login--akses-sistem)
4. [SOP Sales Quotation](#4-sop-sales-quotation)
5. [SOP Sales Order](#5-sop-sales-order)
6. [SOP Job Order](#6-sop-job-order)
7. [SOP Custom Clearance](#7-sop-custom-clearance)
8. [SOP Trucking](#8-sop-trucking)
9. [SOP Invoice (AR)](#9-sop-invoice-ar)
10. [SOP Vendor Invoice (AP)](#10-sop-vendor-invoice-ap)
11. [SOP Approval](#11-sop-approval)
12. [SOP Chat & Komunikasi](#12-sop-chat--komunikasi)
13. [SOP Laporan](#13-sop-laporan)
14. [Peran & Hak Akses](#14-peran--hak-akses)

---

## 1. PENDAHULUAN

### 1.1 Tujuan
SOP ini mengatur tata cara penggunaan sistem KayOcean FMS untuk seluruh tim operasional, sales, keuangan, dan manajemen PT Key Ocean Forwarding.

### 1.2 Ruang Lingkup
Sistem ini mencakup seluruh alur kerja freight forwarding:
- Penawaran harga (Quotation)
- Konfirmasi order (Sales Order)
- Eksekusi pengiriman (Job Order)
- Kepabeanan (Custom Clearance)
- Pengiriman darat (Trucking)
- Penagihan (Invoice AR/AP)
- Pelaporan & monitoring

### 1.3 Akses Sistem
- **URL:** https://kayocean.wasilah.digital
- **Browser:** Chrome / Edge (recommended)
- **Mobile:** Responsive — bisa diakses via HP

---

## 2. ALUR BISNIS UTAMA

### 2.1 Diagram Alur End-to-End

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  QUOTATION  │────▶│ SALES ORDER │────▶│  JOB ORDER  │
│   (Sales)   │     │  (Sales)    │     │   (Ops)     │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
            ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
            │   BOOKING   │          │   CUSTOMS   │          │  TRUCKING   │
            │  (Traffic)  │          │   (PPJK)    │          │   (Ops)     │
            └─────────────┘          └─────────────┘          └─────────────┘
                    │                          │                          │
                    └──────────────────────────┼──────────────────────────┘
                                               │
                                               ▼
                    ┌──────────────────────────────────────────────────────┐
                    │                                                      │
                    ▼                                                      ▼
            ┌─────────────┐                                      ┌─────────────┐
            │  INVOICE AR │                                      │  INVOICE AP │
            │ (ke Customer)│                                      │(dari Vendor)│
            └─────────────┘                                      └─────────────┘
                    │                                                      │
                    ▼                                                      ▼
            ┌─────────────┐                                      ┌─────────────┐
            │  PENERIMAAN │                                      │ PEMBAYARAN  │
            │  (Finance)  │                                      │  (Finance)  │
            └─────────────┘                                      └─────────────┘
                    │                                                      │
                    └──────────────────────────┬──────────────────────────┘
                                               │
                                               ▼
                                      ┌─────────────┐
                                      │   LAPORAN   │
                                      │PROFITABILITAS│
                                      └─────────────┘
```

### 2.2 Status Flow per Dokumen

**Quotation:**
```
DRAFT → REVIEW → APPROVED → SENT → ACCEPTED → (Convert ke SO/JO)
                         └→ REJECTED
```

**Job Order:**
```
DRAFT → CONFIRMED → IN PROGRESS → COMPLETED → INVOICED → CLOSED
```

**Invoice AR:**
```
DRAFT → SENT → PARTIAL PAID → PAID → CLOSED
                                └→ OVERDUE
```

**Invoice AP:**
```
DRAFT → PENDING APPROVAL → APPROVED → SCHEDULED → PAID
                                              └→ OVERDUE
```

---

## 3. LOGIN & AKSES SISTEM

### 3.1 Cara Login
1. Buka https://kayocean.wasilah.digital
2. Masukkan **Email** dan **Password**
3. Klik **"Masuk"**
4. Sistem akan mengarahkan ke Dashboard

### 3.2 Logout
1. Klik nama user di pojok kanan atas
2. Pilih **"Keluar"**

### 3.3 Lupa Password
Hubungi Admin untuk reset password.

---

## 4. SOP SALES QUOTATION

### 4.1 Tujuan
Membuat penawaran harga resmi kepada pelanggan untuk jasa forwarding.

### 4.2 Penanggung Jawab
- **Pembuat:** Sales / Marketing
- **Reviewer:** Branch Manager
- **Approver:** Owner / Manager

### 4.3 Prosedur

| Step | Aksi | PIC | Menu |
|------|------|-----|------|
| 1 | Buka menu **Quotation** → klik **"Buat Quotation"** | Sales | Operasional > Quotation |
| 2 | Pilih **Pelanggan** dari dropdown (data dari Accurate Online) | Sales | |
| 3 | Isi **Service Type** (Sea/Air/Domestic) | Sales | |
| 4 | Isi **Origin** dan **Destination** | Sales | |
| 5 | Isi **Rate Details** (tabel harga per item) | Sales | |
| 6 | Isi **Terms & Conditions** | Sales | |
| 7 | Klik **"Save Draft"** | Sales | |
| 8 | Klik **"Kirim ke Review"** → status berubah ke REVIEW | Sales | |
| 9 | Approval muncul di menu **Approval** | Manager | Keuangan > Approval |
| 10 | Manager klik **"Review & Proses"** → lihat ringkasan → **"Setujui"** | Manager | |
| 11 | Status berubah ke **APPROVED** | System | |
| 12 | Kirim ke customer (email/WA) | Sales | |
| 13 | Jika customer setuju → **Convert ke Job Order** | Sales | |

### 4.4 Diagram Alur Quotation

```
Sales membuat QT          Manager review           Customer
      │                        │                      │
      ▼                        ▼                      ▼
┌──────────┐  Submit   ┌──────────┐  Approve  ┌──────────┐
│  DRAFT   │─────────▶│  REVIEW  │─────────▶│ APPROVED │
└──────────┘           └──────────┘           └──────────┘
                              │                      │
                              ▼                      ▼ Accept
                       ┌──────────┐           ┌──────────┐
                       │ REJECTED │           │ ACCEPTED │
                       └──────────┘           └──────────┘
                                                     │
                                                     ▼
                                              ┌──────────┐
                                              │ JOB ORDER│
                                              └──────────┘
```

---

## 5. SOP SALES ORDER

### 5.1 Tujuan
Mengkonfirmasi order dari pelanggan berdasarkan quotation yang disetujui.

### 5.2 Prosedur

| Step | Aksi | PIC |
|------|------|-----|
| 1 | Dari Quotation yang APPROVED, klik **"Konversi ke Job Order"** | Sales |
| 2 | Atau buka menu **Sales Order** → **"Buat Sales Order"** | Sales |
| 3 | Data otomatis ter-import dari Quotation | System |
| 4 | Lengkapi **Payment Terms**, **PO Number** customer | Sales |
| 5 | Assign **Traffic Officer** dan **Vendor** | Sales/Manager |
| 6 | Submit for Approval | Sales |
| 7 | Manager approve → status CONFIRMED | Manager |

---

## 6. SOP JOB ORDER

### 6.1 Tujuan
Dokumen eksekusi operasional — digunakan oleh tim traffic/operations.

### 6.2 Penanggung Jawab
- **Pembuat:** Sales / Traffic Officer
- **Eksekutor:** Traffic Officer, CSO
- **Monitor:** Branch Manager

### 6.3 Prosedur

| Step | Aksi | PIC | Milestone |
|------|------|-----|-----------|
| 1 | JO dibuat dari SO/QT yang approved | System | JO Created |
| 2 | Traffic submit **Booking** ke shipping line | Traffic | Booking |
| 3 | Konfirmasi booking diterima | Traffic | Booking Confirmed |
| 4 | Koordinasi **dokumen** dari customer | Admin | Document Received |
| 5 | Submit **PIB/PEB** ke Bea Cukai | PPJK | Customs Started |
| 6 | **SPPB terbit** — barang bisa keluar | PPJK | Customs Done |
| 7 | Arrange **trucking** untuk delivery | Traffic | Cargo Released |
| 8 | Barang dikirim ke consignee | Trucking | Delivery |
| 9 | **POD** (Proof of Delivery) diterima | Trucking | POD Received |
| 10 | Buat **Invoice** ke customer | Finance | Invoice Issued |
| 11 | Pembayaran diterima | Finance | Payment Received |
| 12 | **Close JO** | Manager | JO Closed |

### 6.4 Update Status JO
1. Buka detail JO
2. Klik **"Update Status"**
3. Pilih status baru dari dropdown
4. Tambahkan catatan (opsional)
5. Klik **"Update"**

---

## 7. SOP CUSTOM CLEARANCE

### 7.1 Import (PIB)

| Step | Aksi | PIC |
|------|------|-----|
| 1 | Buka JO → tab **Customs** | PPJK |
| 2 | Isi data importir, NPWP, API | PPJK |
| 3 | Hitung **PDRI** (Bea Masuk + PPN + PPh22 + PNBP) | PPJK |
| 4 | Bayar PDRI via billing code | Finance |
| 5 | Daftarkan **PIB** ke KPPBC | PPJK |
| 6 | Tunggu **jalur pabean** (Hijau/Kuning/Merah) | PPJK |
| 7 | Jika Hijau → **SPPB terbit** otomatis | System |
| 8 | Jika Merah → jadwalkan pemeriksaan fisik | PPJK |
| 9 | Update status clearance di sistem | PPJK |

### 7.2 Export (PEB)

| Step | Aksi | PIC |
|------|------|-----|
| 1 | Isi data eksportir | PPJK |
| 2 | Daftarkan **PEB** | PPJK |
| 3 | Tunggu **NPE** (Nota Pelayanan Ekspor) | PPJK |
| 4 | NPE terbit → barang bisa dimuat | System |

---

## 8. SOP TRUCKING

### 8.1 Prosedur

| Step | Aksi | PIC |
|------|------|-----|
| 1 | Buka JO → tab **Trucking** | Traffic |
| 2 | Klik **"Tambah Kendaraan"** | Traffic |
| 3 | Isi: Vendor, Driver, Plat, Rute, Jadwal | Traffic |
| 4 | Driver berangkat → update status **DEPARTED** | Driver/Traffic |
| 5 | Barang sampai → update status **DELIVERED** | Driver/Traffic |
| 6 | Upload foto **POD** | Driver |
| 7 | Status → **POD RECEIVED** | Traffic |

---

## 9. SOP INVOICE (AR)

### 9.1 Tujuan
Menagih biaya jasa forwarding kepada pelanggan.

### 9.2 Prosedur

| Step | Aksi | PIC |
|------|------|-----|
| 1 | Buka menu **Keuangan** → **AR Invoicing** | Finance |
| 2 | Pilih JO yang akan diinvoice | Finance |
| 3 | Pilih **Billing Party** (bisa multi-party) | Finance |
| 4 | Import line items dari JO | Finance |
| 5 | Set **Payment Terms** dan **Due Date** | Finance |
| 6 | Generate **Faktur Pajak** (jika PKP) | Finance |
| 7 | Klik **"Send to Customer"** | Finance |
| 8 | Catat pembayaran saat diterima → **"Record Payment"** | Finance |

### 9.3 Multi-Party Billing
Satu JO bisa menghasilkan beberapa invoice ke pihak berbeda:
- Invoice ke **Consignee** (IDR, domestik)
- Invoice ke **Overseas Agent** (USD, 0% PPN)
- Invoice ke **Trading House** (USD/SGD)

---

## 10. SOP VENDOR INVOICE (AP)

### 10.1 Tujuan
Mencatat tagihan dari vendor (shipping line, EMKL, trucking, dll).

### 10.2 Prosedur — External Vendor

| Step | Aksi | PIC |
|------|------|-----|
| 1 | Buka **Keuangan** → **AP Invoice** | Finance |
| 2 | Pilih **"Vendor Eksternal"** | Finance |
| 3 | Pilih JO terkait | Finance |
| 4 | Isi data vendor dan nomor invoice vendor | Finance |
| 5 | Input line items sesuai invoice fisik | Finance |
| 6 | Upload scan invoice + Faktur Pajak | Finance |
| 7 | Submit for Approval | Finance |
| 8 | Manager approve | Manager |
| 9 | Schedule payment | Finance |
| 10 | Proses pembayaran → **"Mark as Paid"** | Finance |

### 10.3 Prosedur — Armada Internal

| Step | Aksi | PIC |
|------|------|-----|
| 1 | Pilih **"Armada Sendiri"** | Traffic |
| 2 | Isi data truck, driver, rute | Traffic |
| 3 | Input biaya: BBM, Tol, Uang Jalan, dll | Driver/Traffic |
| 4 | Hitung selisih kasbon | Finance |
| 5 | Post to Fleet Module | Finance |

---

## 11. SOP APPROVAL

### 11.1 Alur Approval

```
Staff Submit → Notification muncul di 🔔 → Reviewer buka Approval
     → Lihat ringkasan dokumen → Approve / Reject
```

### 11.2 Matrix Approval

| Nilai Transaksi | Approver |
|-----------------|----------|
| < Rp 5 juta | Traffic Officer |
| Rp 5 – 25 juta | Supervisor |
| Rp 25 – 100 juta | Manager |
| > Rp 100 juta | Direktur / Owner |

### 11.3 Cara Approve
1. Klik 🔔 (bell) di header → lihat notifikasi pending
2. Atau buka menu **Keuangan > Approval**
3. Klik **"Review & Proses"**
4. Lihat ringkasan dokumen (detail lengkap)
5. Tambahkan catatan (opsional)
6. Klik **"Setujui"** atau **"Tolak"**

---

## 12. SOP CHAT & KOMUNIKASI

### 12.1 Tujuan
Komunikasi internal tim terkait operasional JO — tersimpan otomatis di Activity Log.

### 12.2 Cara Menggunakan
1. Klik icon 💬 di header (samping bell)
2. Pilih channel atau buat percakapan baru
3. Ketik pesan → Enter untuk kirim
4. Pesan di **JO Thread** otomatis tersimpan di Activity Log JO

### 12.3 Tipe Percakapan
- **# Channel** — grup per divisi (operasional, keuangan, dll)
- **DM** — pesan langsung antar user
- **JO Thread** — percakapan terkait Job Order tertentu

---

## 13. SOP LAPORAN

### 13.1 Laporan Profitabilitas
1. Buka menu **Keuangan > Laporan**
2. Set filter: tanggal, cabang, jenis layanan
3. Pilih grouping: per JO / per Customer / per Cabang
4. Klik **"Export CSV"** untuk download

### 13.2 Dashboard / Papan Control
- **Dashboard** — KPI ringkasan (revenue, profit, JO aktif)
- **Papan Control** — monitoring real-time semua JO (Kanban / Timeline / Table)

---

## 14. PERAN & HAK AKSES

| Role | Akses |
|------|-------|
| **Owner** | Semua modul, semua cabang, approval tertinggi |
| **Branch Manager** | Semua modul cabang sendiri, approval level 2 |
| **Sales** | Quotation, SO, Customer, JO (buat) |
| **CSO** | JO (monitor), Dokumen, Trucking |
| **Traffic/Ops** | JO (eksekusi), Booking, Trucking, Dokumen |
| **Finance** | Invoice AR/AP, Pembayaran, Laporan |
| **Admin** | Master data, User, Cabang, Settings |

---

## 📞 KONTAK SUPPORT

| Kebutuhan | Kontak |
|-----------|--------|
| Bug / Error sistem | Wasilah Digital Sistem |
| Reset password | Admin internal |
| Training | Branch Manager |

---

*Dokumen ini bersifat rahasia dan hanya untuk penggunaan internal PT Key Ocean Forwarding.*
*© 2026 Wasilah Digital Sistem*
