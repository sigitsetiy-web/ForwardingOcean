# PROPOSAL REVISI IMPLEMENTASI
# KayOcean FMS — Lead to Quotation Flow

---

**Dokumen:** Revisi ruang lingkup implementasi  
**Fokus revisi:** Menambahkan tahapan `Lead` sebelum `Quotation`  
**Tujuan:** Menutup gap proses sales agar alur bisnis dimulai dari prospek, bukan langsung dari penawaran

---

## 1. Ringkasan Revisi

Setelah ditinjau ulang, alur implementasi sebelumnya masih langsung dimulai dari `Quotation`, padahal kebutuhan bisnis KayOcean membutuhkan proses yang lebih lengkap di bagian awal, yaitu:

`Prospect -> Lead -> Qualified -> Customer -> Quotation -> Sales Order -> Job Order -> Invoice -> Payment`

Artinya, sistem tidak cukup hanya menyediakan modul quotation dan operasional. Sistem juga perlu memiliki **modul CRM / Lead Management** agar:

- prospek dan lead bisa dicatat sejak awal
- aktivitas follow-up sales terdokumentasi
- pipeline penjualan dapat dimonitor
- lead yang sudah qualified dapat dikonversi menjadi customer
- quotation memiliki asal-usul yang jelas dari lead yang dikerjakan

Tanpa modul ini, proses sales masih akan terpecah antara WhatsApp, Excel, dan sistem, sehingga data pipeline sebelum quotation tidak tercatat dengan baik.

---

## 2. Temuan Gap Saat Ini

Dari struktur sistem dan dokumen yang ada, gap utama yang perlu ditutup adalah:

1. Belum ada modul khusus untuk `Lead / Prospect / Opportunity`.
2. Data customer dan pipeline sales masih tercampur, belum dipisahkan antara calon customer dan customer aktif.
3. Belum ada activity log khusus sales untuk call, meeting, visit, follow-up, lost reason, dan next action.
4. Belum ada alur `Lead -> Customer -> Quotation`.
5. Quotation saat ini diasumsikan dibuat dari customer yang sudah ada, bukan dari hasil proses sales pipeline.
6. Monitoring funnel penjualan belum tersedia, sehingga conversion rate dari lead ke quotation dan ke job order belum dapat diukur.

---

## 3. Scope Revisi yang Diusulkan

Proposal implementasi direvisi menjadi mencakup modul berikut:

### 3.1 CRM & Lead Management

- Master lead / prospect
- Lead source (referral, website, canvassing, existing relation, dll.)
- PIC, kontak, perusahaan, alamat, layanan yang diminati
- Sales owner / account owner
- Status pipeline: `PROSPECT`, `LEAD`, `QUALIFIED`, `CUSTOMER`, `LOST`
- Follow-up scheduler dan reminder
- Activity timeline: call, meeting, visit, note, attachment
- Lost reason dan re-open lead

### 3.2 Lead Conversion

- Konversi lead menjadi customer
- Anti-duplicate customer checking
- Mapping lead ke quotation
- Riwayat konversi lead -> customer -> quotation

### 3.3 Marketing & Quotation

- Pembuatan quotation dari lead/customer
- Rate table per layanan
- Approval quotation
- Tracking status quotation

### 3.4 Sales Order, Job Order, dan Operasional

- Konversi quotation ke sales order
- Konversi sales order ke job order
- Monitoring shipment, trucking, document, cost, revenue

### 3.5 Finance & Accurate Integration

- Sinkronisasi customer ke Accurate
- AR/AP invoice
- Payment status sync
- Laporan profitabilitas

---

## 4. Alur Bisnis Target

Alur operasional yang direkomendasikan:

1. Sales / Marketing membuat `Lead`
2. Lead di-follow-up dan dicatat seluruh aktivitasnya
3. Jika potensial, lead diubah menjadi `Qualified`
4. Lead yang qualified dikonversi menjadi `Customer`
5. Sales membuat `Quotation` berdasarkan kebutuhan customer
6. Quotation melalui approval dan dikirim ke customer
7. Jika disetujui, quotation dikonversi menjadi `Sales Order`
8. Sales Order dikonversi menjadi `Job Order`
9. Operasional menjalankan shipment
10. Finance membuat invoice dan sinkron ke Accurate

---

## 5. Deliverable per Fase

### Fase 0 — Discovery & Blueprint

**Durasi:** 1 minggu

**Deliverable:**

- final business flow `Lead -> Quotation -> SO -> JO`
- final status lifecycle tiap dokumen
- final field list untuk lead, quotation, sales order, job order
- hak akses per role
- approval matrix
- blueprint database dan API

**Task utama:**

- workshop requirement dengan owner/sales/ops/finance
- finalisasi definisi lead, qualified, lost, customer
- finalisasi rule konversi lead ke customer
- finalisasi rule kapan quotation boleh dibuat
- finalisasi rule sync Accurate

---

### Fase 1 — Foundation & Master Data

**Durasi:** 2 minggu

**Deliverable:**

- autentikasi dan RBAC
- master branch, user, role
- struktur database inti
- audit log dan activity framework

**Task utama:**

- setup environment dev/staging/production
- setup schema database inti
- implementasi login, role, branch scope
- implementasi shared activity log
- implementasi notifikasi dasar

---

### Fase 2 — CRM & Lead Management

**Durasi:** 3 minggu

**Deliverable:**

- halaman list lead
- halaman detail lead
- form create/edit lead
- activity timeline lead
- reminder follow-up
- filter pipeline dan dashboard funnel awal

**Task utama:**

- model `Lead`, `LeadActivity`, `LeadFollowUp`, `LeadAssignment`
- API CRUD lead
- assign owner sales / marketing
- activity types: call, WA, email, meeting, visit, note
- next follow-up date dan reminder
- lost reason / reopen lead
- search, filter, pagination

---

### Fase 3 — Lead Conversion & Customer Sync

**Durasi:** 2 minggu

**Deliverable:**

- konversi lead menjadi customer
- duplicate checking
- integrasi awal customer ke Accurate
- relasi lead ke quotation

**Task utama:**

- rule validasi sebelum convert
- duplicate customer check by name/NPWP/email/phone
- create customer dari lead qualified
- activity log conversion
- sync customer ke Accurate setelah approved/qualified sesuai rule
- status update otomatis ke `CUSTOMER`

---

### Fase 4 — Quotation & Approval Workflow

**Durasi:** 3 minggu

**Deliverable:**

- quotation dari lead/customer
- multi-item rate table
- approval workflow
- status tracking quotation
- cetak / PDF quotation

**Task utama:**

- form quotation per service type
- kalkulasi amount, currency, validity date
- approval draft -> review -> approved
- sent / accepted / rejected tracking
- relasi quotation ke lead dan customer
- template cetak quotation

---

### Fase 5 — Sales Order & Job Order

**Durasi:** 4 minggu

**Deliverable:**

- sales order
- job order
- milestone operasional
- document handling
- trucking dan cost/revenue tracking
- cetak job order

**Task utama:**

- konversi quotation ke sales order
- konversi sales order ke job order
- numbering document
- milestones shipment
- upload dokumen
- assignment trucking
- revenue/cost monitoring
- status progress JO

---

### Fase 6 — Finance, Accurate, Reports

**Durasi:** 3 minggu

**Deliverable:**

- AR invoice
- AP invoice
- sync Accurate
- dashboard conversion dan profitability
- laporan export

**Task utama:**

- invoice customer dan vendor
- payment tracking
- sync AR/AP ke Accurate
- sync payment status
- report lead conversion
- report quotation conversion
- report profitability per JO/customer/cabang

---

### Fase 7 — UAT, Training, Go-Live

**Durasi:** 2 minggu

**Deliverable:**

- UAT pass
- SOP
- training user
- go-live production
- hypercare

**Task utama:**

- test scenario end-to-end
- bug fixing prioritas tinggi
- training sales, ops, finance, admin
- final data seeding / migration
- go-live checklist
- support intensif minggu pertama

---

## 6. Timeline Implementasi Revisi

| Fase | Nama Fase | Durasi | Output Utama |
|------|-----------|--------|--------------|
| 0 | Discovery & Blueprint | 1 minggu | Final business flow & blueprint |
| 1 | Foundation & Master Data | 2 minggu | Auth, RBAC, master data, audit framework |
| 2 | CRM & Lead Management | 3 minggu | Lead pipeline & follow-up |
| 3 | Lead Conversion & Customer Sync | 2 minggu | Lead -> Customer + Accurate prep |
| 4 | Quotation & Approval | 3 minggu | Quotation end-to-end |
| 5 | Sales Order & Job Order | 4 minggu | Operational flow |
| 6 | Finance, Accurate, Reports | 3 minggu | Invoice, sync, report |
| 7 | UAT, Training, Go-Live | 2 minggu | Production readiness |
|  | **Total** | **20 minggu** | **End-to-end FMS dari Lead sampai Finance** |

---

## 7. Work Breakdown Structure

### Stream A — Product & Process

- requirement workshop
- SOP mapping
- approval matrix
- role matrix
- final acceptance criteria

### Stream B — Backend & Database

- schema design
- migration
- API CRUD
- validation & business rules
- Accurate integration
- reporting endpoints

### Stream C — Frontend

- CRM pages
- pipeline dashboard
- quotation pages
- sales order pages
- job order pages
- finance pages
- print / PDF layouts

### Stream D — QA & Delivery

- test case preparation
- integration testing
- UAT support
- training material
- deployment & rollback plan

---

## 8. Prioritas Implementasi

Jika proyek ingin dibuat bertahap, urutan prioritas yang disarankan adalah:

### Prioritas 1 — Mandatory

- auth & role
- lead pipeline
- lead conversion
- quotation
- approval

### Prioritas 2 — Core Operations

- sales order
- job order
- dokumen
- trucking

### Prioritas 3 — Finance & Integration

- AR/AP invoice
- Accurate sync
- report profitability

---

## 9. Risiko dan Dependensi

Beberapa dependensi penting agar timeline realistis:

1. Final alur bisnis harus disepakati di awal, terutama relasi antara `Lead`, `Customer`, `Quotation`, `Sales Order`, dan `Job Order`.
2. Data master awal dari klien harus tersedia sejak awal proyek.
3. Access token dan environment Accurate harus siap untuk integrasi.
4. PIC dari sales, ops, dan finance perlu aktif saat UAT.
5. Scope freeze setelah Fase 1 agar timeline tidak terus bergeser.

Risiko utama:

- perubahan workflow setelah development berjalan
- data customer existing belum bersih / duplikat
- rule approval antar cabang belum final
- ketergantungan ke Accurate API untuk sinkronisasi

---

## 10. Rekomendasi

Rekomendasi kami adalah **merevisi proposal implementasi** agar proyek resmi dimulai dari **CRM & Lead Management**, bukan langsung dari quotation. Dengan demikian:

- seluruh funnel sales tercatat
- quotation tidak berdiri sendiri
- owner dapat memonitor conversion rate lead -> quotation -> job order
- nilai investasi sistem menjadi lebih tinggi karena mendukung proses sales hingga finance secara utuh

Dengan tambahan modul lead di awal, total implementasi yang realistis menjadi **20 minggu** untuk scope end-to-end yang rapi dan production-ready.

---

## 11. Penutup

Dokumen revisi ini dapat digunakan sebagai lampiran proposal implementasi atau sebagai versi proposal yang diperbarui untuk presentasi ke manajemen. Jika diperlukan, proposal ini dapat dilanjutkan menjadi:

- versi komersial dengan nilai investasi
- versi presentasi manajemen
- versi timeline Gantt
- versi backlog sprint per minggu

