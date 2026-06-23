"use client";

import { Download, ArrowLeft, Ship, FileText, Package, Truck, DollarSign, CheckCircle, MessageCircle, BarChart3, Users, Shield, BookOpen } from "lucide-react";
import Link from "next/link";

export default function GuidePage() {
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F6F7" }}>
      {/* Header - hidden in print */}
      <div className="print:hidden sticky top-0 z-50 bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between" style={{ borderColor: "#D1D2D4" }}>
        <div className="flex items-center gap-4">
          <Link href="/login" className="flex items-center gap-2 text-sm font-medium" style={{ color: "#0070F2" }}>
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Login
          </Link>
        </div>
        <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "#0070F2" }}>
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 print:px-0 print:py-0 print:max-w-none">

        {/* Cover Page */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 print:rounded-none print:shadow-none print:mb-0 print:break-after-page">
          <div className="p-12 text-center" style={{ background: "linear-gradient(135deg, #003B62 0%, #0070F2 100%)" }}>
            <img src="/images/logo-keyocean.svg" alt="KayOcean" className="h-16 w-auto mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-2">BUKU PANDUAN</h1>
            <h2 className="text-2xl text-white/80 mb-6">KayOcean Forwarding Management System</h2>
            <div className="h-1 w-24 mx-auto rounded-full mb-6" style={{ background: "#F59E0B" }} />
            <p className="text-white/60 text-sm">Standar Operasional Prosedur & Panduan Pengguna</p>
            <p className="text-white/40 text-xs mt-4">Versi 2.0 — Juni 2026</p>
            <p className="text-white/40 text-xs">Dibuat oleh: Wasilah Digital Sistem</p>
          </div>
        </div>

        {/* Table of Contents */}
        <Section title="📋 Daftar Isi" color="#003B62">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { num: "1", title: "Pendahuluan & Akses Sistem", icon: BookOpen, id: "pendahuluan" },
              { num: "2", title: "Alur Bisnis Utama", icon: Ship, id: "alur-bisnis" },
              { num: "3", title: "Dashboard & Widget", icon: BarChart3, id: "dashboard" },
              { num: "4", title: "Sales Quotation", icon: FileText, id: "quotation" },
              { num: "5", title: "Sales Order", icon: FileText, id: "sales-order" },
              { num: "6", title: "Job Order", icon: Package, id: "job-order" },
              { num: "7", title: "Custom Clearance", icon: Shield, id: "customs" },
              { num: "8", title: "Trucking", icon: Truck, id: "trucking" },
              { num: "9", title: "Invoice (AR)", icon: DollarSign, id: "invoice-ar" },
              { num: "10", title: "Vendor Invoice (AP)", icon: DollarSign, id: "invoice-ap" },
              { num: "11", title: "Approval", icon: CheckCircle, id: "approval" },
              { num: "12", title: "Chat & Komunikasi", icon: MessageCircle, id: "chat" },
              { num: "13", title: "Laporan & Grafik", icon: BarChart3, id: "laporan" },
              { num: "14", title: "Peran & Hak Akses", icon: Users, id: "peran" },
            ].map((item) => (
              <a key={item.num} href={`#${item.id}`} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "#E8F0FE" }}>
                  <item.icon className="h-4 w-4" style={{ color: "#0070F2" }} />
                </div>
                <span className="text-sm"><b className="mr-2" style={{ color: "#0070F2" }}>{item.num}.</b>{item.title}</span>
              </a>
            ))}
          </div>
        </Section>

        {/* Section 1 */}
        <Section id="pendahuluan" title="1. Pendahuluan & Akses Sistem" color="#003B62" pageBreak>
          <InfoBox color="#0070F2" title="Tentang KayOcean FMS">
            Sistem manajemen forwarding terintegrasi untuk mengelola seluruh alur kerja perusahaan jasa freight forwarding — dari quotation hingga invoice, terintegrasi dengan Accurate Online.
          </InfoBox>

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Cara Login:</h4>
          <StepList steps={[
            "Buka https://kayocean.wasilah.digital",
            "Masukkan Email dan Password",
            "Klik tombol \"Masuk\"",
            "Anda akan diarahkan ke Dashboard",
          ]} />

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Cara Logout:</h4>
          <StepList steps={[
            "Klik nama Anda di pojok kanan atas",
            "Pilih \"Keluar\"",
          ]} />
        </Section>

        {/* Section 2 - Flow */}
        <Section id="alur-bisnis" title="2. Alur Bisnis Utama" color="#003B62" pageBreak>
          <p className="text-sm mb-4" style={{ color: "#6A6D70" }}>Berikut adalah alur dokumen dari awal hingga akhir:</p>
          <FlowDiagram />

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Status Flow Quotation:</h4>
          <StatusFlow statuses={["DRAFT", "REVIEW", "APPROVED", "SENT", "ACCEPTED"]} colors={["#6A6D70", "#0070F2", "#107E3E", "#6B2FA0", "#107E3E"]} />

          <h4 className="font-bold mt-4 mb-3" style={{ color: "#003B62" }}>Status Flow Job Order:</h4>
          <StatusFlow statuses={["DRAFT", "CONFIRMED", "IN PROGRESS", "COMPLETED", "INVOICED", "CLOSED"]} colors={["#6A6D70", "#0070F2", "#E9730C", "#107E3E", "#6B2FA0", "#32363A"]} />
        </Section>

        {/* Section 3 - Dashboard */}
        <Section id="dashboard" title="3. Dashboard & Widget" color="#6B2FA0" pageBreak>
          <InfoBox color="#6B2FA0" title="Dashboard Personal">
            Setiap user memiliki dashboard sendiri yang bisa dikustomisasi. Tambahkan widget sesuai kebutuhan kerja Anda.
          </InfoBox>

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Cara Kustomisasi Dashboard:</h4>
          <StepList steps={[
            "Buka menu Dashboard (halaman utama setelah login)",
            "Klik tombol \"+ Tambah Widget\" di pojok kanan atas",
            "Panel widget akan muncul — pilih widget yang ingin ditampilkan",
            "Widget yang aktif ditandai ✓ biru — klik lagi untuk menonaktifkan",
            "Untuk menghapus widget: hover di widget → klik icon X di sudut kanan atas",
            "Klik \"Reset Default\" untuk mengembalikan ke layout default sesuai role Anda",
            "Preferensi widget tersimpan otomatis per user",
          ]} />

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Widget yang Tersedia:</h4>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 rounded-lg" style={{ background: "#F5F8FF" }}>
              <p className="text-xs font-bold" style={{ color: "#0070F2" }}>📊 KPI Cards</p>
              <p className="text-[11px] mt-1" style={{ color: "#6A6D70" }}>JO Aktif, Revenue, Profit Margin, Pending Approval, Total Customer, Outstanding AR</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#F0FDF4" }}>
              <p className="text-xs font-bold" style={{ color: "#107E3E" }}>📈 Grafik & Chart</p>
              <p className="text-[11px] mt-1" style={{ color: "#6A6D70" }}>Revenue Bulanan, Trend Profit, Distribusi Layanan, Perbandingan Cabang, Top Customer, Status JO</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#FFF8F0" }}>
              <p className="text-xs font-bold" style={{ color: "#E9730C" }}>📋 List Data</p>
              <p className="text-[11px] mt-1" style={{ color: "#6A6D70" }}>JO Terbaru, ETA Mendatang, Ringkasan Cabang</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#FEF2F2" }}>
              <p className="text-xs font-bold" style={{ color: "#BB0000" }}>⚠️ Alert</p>
              <p className="text-[11px] mt-1" style={{ color: "#6A6D70" }}>Perhatian Diperlukan, Invoice Overdue</p>
            </div>
          </div>

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Default Widget per Role:</h4>
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead><tr style={{ background: "#003B62" }}><th className="px-3 py-2 text-left text-white text-xs">Role</th><th className="px-3 py-2 text-left text-white text-xs">Default Widgets</th></tr></thead>
            <tbody>
              <tr className="border-t"><td className="px-3 py-2 font-medium text-xs">Owner</td><td className="px-3 py-2 text-xs">Semua KPI + 4 Charts + JO List + Alerts + Branch Summary</td></tr>
              <tr className="border-t" style={{ background: "#F5F6F7" }}><td className="px-3 py-2 font-medium text-xs">Branch Manager</td><td className="px-3 py-2 text-xs">4 KPI + Revenue Chart + Service Chart + JO + Alerts</td></tr>
              <tr className="border-t"><td className="px-3 py-2 font-medium text-xs">Finance</td><td className="px-3 py-2 text-xs">Revenue, Profit, Outstanding AR + Profit Trend + Overdue Invoice</td></tr>
              <tr className="border-t" style={{ background: "#F5F6F7" }}><td className="px-3 py-2 font-medium text-xs">Sales/CSO</td><td className="px-3 py-2 text-xs">JO Aktif, Customer + Top Customer Chart + JO List</td></tr>
            </tbody>
          </table>
        </Section>

        {/* Section 4 - Quotation */}
        <Section id="quotation" title="4. Sales Quotation" color="#0070F2" pageBreak>
          <InfoBox color="#0070F2" title="Tujuan">
            Membuat penawaran harga resmi kepada pelanggan untuk jasa forwarding.
          </InfoBox>

          <h4 className="font-bold mt-4 mb-3" style={{ color: "#003B62" }}>Prosedur:</h4>
          <StepList steps={[
            "Buka menu Operasional → Quotation → klik \"Buat Quotation\"",
            "Pilih Pelanggan dari dropdown (data dari Accurate Online)",
            "Isi Service Type: Sea Freight / Air Freight / Domestic",
            "Isi Origin dan Destination",
            "Isi Rate Details — tabel harga per item (Freight, THC, Handling, dll)",
            "Isi Terms & Conditions (payment terms, exclusions)",
            "Klik \"Save Draft\" untuk menyimpan",
            "Klik \"Kirim ke Review\" → status berubah ke REVIEW",
            "Manager akan menerima notifikasi di 🔔 untuk approve",
            "Setelah APPROVED → kirim ke customer",
            "Jika customer setuju → klik \"Konversi ke Job Order\"",
          ]} />

          <RoleBox roles={[
            { role: "Sales", action: "Membuat & mengirim quotation" },
            { role: "Manager", action: "Review & approve quotation" },
          ]} />
        </Section>

        {/* Section 5 - Sales Order */}
        <Section id="sales-order" title="5. Sales Order" color="#0070F2" pageBreak>
          <InfoBox color="#0070F2" title="Tujuan">
            Mengkonfirmasi order dari pelanggan berdasarkan quotation yang disetujui.
          </InfoBox>
          <StepList steps={[
            "Dari Quotation APPROVED → klik \"Konversi ke Job Order\"",
            "Atau buka menu Sales Order → \"Buat Sales Order\"",
            "Data otomatis ter-import dari Quotation",
            "Lengkapi Payment Terms dan PO Number customer",
            "Assign Traffic Officer dan Vendor",
            "Submit for Approval → Manager approve",
          ]} />
        </Section>

        {/* Section 6 - Job Order */}
        <Section id="job-order" title="6. Job Order" color="#0070F2" pageBreak>
          <InfoBox color="#E9730C" title="Penting">
            Job Order adalah dokumen eksekusi operasional — digunakan oleh tim traffic/operations untuk menjalankan pengiriman.
          </InfoBox>

          <h4 className="font-bold mt-4 mb-3" style={{ color: "#003B62" }}>Milestone JO:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {["JO Created", "Booking", "Cargo Ready", "Customs", "Departed", "Arrived", "Delivered", "Closed"].map((m, i) => (
              <div key={m} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: i < 3 ? "#E6F4EA" : "#F5F6F7" }}>
                <span className="text-xs">{i < 3 ? "✅" : "⏳"}</span>
                <span className="text-xs font-medium">{m}</span>
              </div>
            ))}
          </div>

          <h4 className="font-bold mt-4 mb-3" style={{ color: "#003B62" }}>Cara Update Status:</h4>
          <StepList steps={[
            "Buka detail Job Order",
            "Klik tombol \"Update Status\"",
            "Pilih status baru dari dropdown",
            "Tambahkan catatan (opsional)",
            "Klik \"Update\" — milestone otomatis ter-update",
          ]} />
        </Section>

        {/* Section 7 - Customs */}
        <Section id="customs" title="7. Custom Clearance" color="#E9730C" pageBreak>
          <h4 className="font-bold mb-3" style={{ color: "#003B62" }}>Import (PIB):</h4>
          <StepList steps={[
            "Buka JO → section Customs",
            "Isi data importir, NPWP, API Number",
            "Hitung PDRI (Bea Masuk + PPN + PPh22 + PNBP)",
            "Bayar PDRI via billing code",
            "Daftarkan PIB ke KPPBC",
            "Tunggu jalur pabean: 🟢 Hijau / 🟡 Kuning / 🔴 Merah",
            "Jika Hijau → SPPB terbit otomatis",
            "Jika Merah → jadwalkan pemeriksaan fisik",
            "Update status clearance di sistem",
          ]} />

          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { jalur: "🟢 Hijau", desc: "Langsung release", color: "#E6F4EA" },
              { jalur: "🟡 Kuning", desc: "Cek dokumen", color: "#FFF3E0" },
              { jalur: "🔴 Merah", desc: "Pemeriksaan fisik", color: "#FFF5F5" },
              { jalur: "🔵 MITA", desc: "Prioritas", color: "#E8F0FE" },
            ].map((j) => (
              <div key={j.jalur} className="p-3 rounded-lg text-center" style={{ background: j.color }}>
                <p className="text-sm font-bold">{j.jalur}</p>
                <p className="text-[10px] mt-1" style={{ color: "#6A6D70" }}>{j.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 8 - Trucking */}
        <Section id="trucking" title="8. Trucking" color="#E9730C" pageBreak>
          <StepList steps={[
            "Buka JO → tab Trucking",
            "Klik \"Tambah Kendaraan\"",
            "Isi: Vendor, Driver, Plat Nomor, Rute, Jadwal",
            "Driver berangkat → update status DEPARTED",
            "Barang sampai → update status DELIVERED",
            "Upload foto POD (Proof of Delivery)",
            "Status → POD RECEIVED",
          ]} />
        </Section>

        {/* Section 9 - Invoice AR */}
        <Section id="invoice-ar" title="9. Invoice ke Customer (AR)" color="#107E3E" pageBreak>
          <InfoBox color="#107E3E" title="Multi-Party Billing">
            Satu JO bisa menghasilkan beberapa invoice ke pihak berbeda (Consignee, Overseas Agent, Trading House).
          </InfoBox>
          <StepList steps={[
            "Buka menu Keuangan → AR Invoicing",
            "Pilih JO yang akan diinvoice",
            "Pilih Billing Party (bisa multi-party)",
            "Import line items dari JO",
            "Set Payment Terms dan Due Date",
            "Generate Faktur Pajak (jika PKP)",
            "Klik \"Send to Customer\"",
            "Catat pembayaran → \"Record Payment\"",
          ]} />
        </Section>

        {/* Section 10 - Invoice AP */}
        <Section id="invoice-ap" title="10. Vendor Invoice (AP)" color="#BB0000" pageBreak>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg border-l-4" style={{ background: "#F5F8FF", borderColor: "#0070F2" }}>
              <p className="text-sm font-bold" style={{ color: "#0070F2" }}>🏢 Vendor Eksternal</p>
              <p className="text-xs mt-1" style={{ color: "#6A6D70" }}>Shipping Line, EMKL, Trucking Vendor → menciptakan AP/Hutang</p>
            </div>
            <div className="p-4 rounded-lg border-l-4" style={{ background: "#FFF8F0", borderColor: "#E9730C" }}>
              <p className="text-sm font-bold" style={{ color: "#E9730C" }}>🚛 Armada Internal</p>
              <p className="text-xs mt-1" style={{ color: "#6A6D70" }}>BBM, Tol, Uang Jalan → biaya internal, tidak ada AP</p>
            </div>
          </div>
          <StepList steps={[
            "Buka Keuangan → AP Invoice",
            "Pilih tipe: Vendor Eksternal atau Armada Internal",
            "Pilih JO terkait",
            "Input data vendor dan line items",
            "Upload scan invoice + Faktur Pajak",
            "Submit for Approval",
            "Setelah approved → schedule payment",
          ]} />
        </Section>

        {/* Section 11 - Approval */}
        <Section id="approval" title="11. Approval" color="#107E3E" pageBreak>
          <h4 className="font-bold mb-3" style={{ color: "#003B62" }}>Matrix Approval:</h4>
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead><tr style={{ background: "#003B62" }}><th className="px-4 py-2 text-left text-white">Nilai</th><th className="px-4 py-2 text-left text-white">Approver</th></tr></thead>
            <tbody>
              <tr className="border-t"><td className="px-4 py-2">&lt; Rp 5 juta</td><td className="px-4 py-2">Traffic Officer</td></tr>
              <tr className="border-t" style={{ background: "#F5F6F7" }}><td className="px-4 py-2">Rp 5 – 25 juta</td><td className="px-4 py-2">Supervisor</td></tr>
              <tr className="border-t"><td className="px-4 py-2">Rp 25 – 100 juta</td><td className="px-4 py-2">Manager</td></tr>
              <tr className="border-t" style={{ background: "#F5F6F7" }}><td className="px-4 py-2">&gt; Rp 100 juta</td><td className="px-4 py-2">Direktur / Owner</td></tr>
            </tbody>
          </table>

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Cara Approve:</h4>
          <StepList steps={[
            "Klik 🔔 di header → lihat notifikasi pending",
            "Atau buka menu Keuangan > Approval",
            "Klik \"Review & Proses\"",
            "Lihat ringkasan dokumen lengkap",
            "Klik \"Setujui\" atau \"Tolak\"",
          ]} />
        </Section>

        {/* Section 12 - Chat */}
        <Section id="chat" title="12. Chat & Komunikasi" color="#0070F2" pageBreak>
          <InfoBox color="#0070F2" title="Kolaborasi Terintegrasi">
            Chat KayOcean terhubung langsung dengan data operasional. Percakapan di JO Thread otomatis tersimpan sebagai Activity Log pada Job Order terkait.
          </InfoBox>

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Jenis Percakapan:</h4>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg text-center" style={{ background: "#E8F0FE" }}>
              <p className="text-lg mb-1">👥</p>
              <p className="text-xs font-bold" style={{ color: "#0070F2" }}>Channel</p>
              <p className="text-[10px]" style={{ color: "#6A6D70" }}>Grup per divisi/topik. Contoh: # operasional, # keuangan</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: "#E6F4EA" }}>
              <p className="text-lg mb-1">💬</p>
              <p className="text-xs font-bold" style={{ color: "#107E3E" }}>Direct Message</p>
              <p className="text-[10px]" style={{ color: "#6A6D70" }}>Pesan pribadi antar user. Real-time, terenkripsi</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: "#FFF3E0" }}>
              <p className="text-lg mb-1">⚙️</p>
              <p className="text-xs font-bold" style={{ color: "#E9730C" }}>JO Thread</p>
              <p className="text-[10px]" style={{ color: "#6A6D70" }}>Linked ke Job Order. Pesan jadi audit trail</p>
            </div>
          </div>

          <h4 className="font-bold mt-4 mb-3" style={{ color: "#003B62" }}>Cara Menggunakan Chat:</h4>
          <StepList steps={[
            "Klik menu \"Chat\" di sidebar atau icon 💬 di header",
            "Di sidebar kiri: pilih channel, DM, atau JO Thread yang ingin dibuka",
            "Ketik pesan di kotak input bawah → tekan Enter untuk kirim",
            "Shift + Enter untuk baris baru (multi-line)",
            "Klik icon 👥 di header chat untuk melihat anggota room",
            "Klik \"+\" di sidebar untuk membuat channel baru",
          ]} />

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Notifikasi Chat:</h4>
          <StepList steps={[
            "Badge merah di icon 💬 header menunjukkan jumlah room dengan pesan baru",
            "Badge otomatis hilang setelah Anda membuka room tersebut",
            "Notifikasi di-refresh otomatis setiap 10 detik",
          ]} />

          <RoleBox roles={[
            { role: "Semua User", action: "Dapat mengirim & menerima pesan di channel yang diikuti" },
            { role: "Owner/Manager", action: "Membuat channel baru, menambah anggota" },
          ]} />
        </Section>

        {/* Section 13 - Reports */}
        <Section id="laporan" title="13. Laporan & Grafik" color="#6B2FA0" pageBreak>
          <InfoBox color="#6B2FA0" title="Analytics Terintegrasi">
            Seluruh data operasional otomatis dihitung menjadi laporan real-time. Owner mendapat akses penuh ke semua grafik analytics.
          </InfoBox>

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Fitur Laporan:</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg border" style={{ borderColor: "#E5E7EB" }}>
              <p className="text-xs font-bold" style={{ color: "#0070F2" }}>📊 Revenue & Cost Bulanan</p>
              <p className="text-[10px] mt-1" style={{ color: "#6A6D70" }}>Bar chart perbandingan pendapatan vs biaya per bulan</p>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: "#E5E7EB" }}>
              <p className="text-xs font-bold" style={{ color: "#107E3E" }}>📈 Trend Profit Margin</p>
              <p className="text-[10px] mt-1" style={{ color: "#6A6D70" }}>Area chart pergerakan margin profit 6 bulan terakhir</p>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: "#E5E7EB" }}>
              <p className="text-xs font-bold" style={{ color: "#E9730C" }}>🥧 Distribusi Layanan</p>
              <p className="text-[10px] mt-1" style={{ color: "#6A6D70" }}>Pie chart proporsi Sea Import, Export, Air, Domestic</p>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: "#E5E7EB" }}>
              <p className="text-xs font-bold" style={{ color: "#6B2FA0" }}>🏢 Perbandingan Cabang</p>
              <p className="text-[10px] mt-1" style={{ color: "#6A6D70" }}>Horizontal bar chart revenue per cabang</p>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: "#E5E7EB" }}>
              <p className="text-xs font-bold" style={{ color: "#BB0000" }}>👥 Top 5 Customer</p>
              <p className="text-[10px] mt-1" style={{ color: "#6A6D70" }}>Progress bar customer dengan kontribusi revenue tertinggi</p>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: "#E5E7EB" }}>
              <p className="text-xs font-bold" style={{ color: "#32363A" }}>🍩 Status Job Order</p>
              <p className="text-[10px] mt-1" style={{ color: "#6A6D70" }}>Donut chart distribusi status (Completed, In Progress, dll)</p>
            </div>
          </div>

          <h4 className="font-bold mt-4 mb-3" style={{ color: "#003B62" }}>Menu Laporan Profitabilitas:</h4>
          <StepList steps={[
            "Buka menu Keuangan → Laporan",
            "Filter berdasarkan: Periode, Cabang, Jenis Layanan, Customer",
            "Lihat ringkasan: Total Revenue, Cost, Profit, Margin rata-rata",
            "Tabel detail per Job Order",
            "Klik \"Export CSV\" untuk download data ke Excel",
          ]} />

          <h4 className="font-bold mt-6 mb-3" style={{ color: "#003B62" }}>Papan Control (Control Center):</h4>
          <StepList steps={[
            "Buka menu Papan Control dari sidebar",
            "Pilih view: Kanban / Timeline / Table",
            "Filter berdasarkan status, officer, customer, direction",
            "Klik JO card untuk melihat detail di side panel",
            "KPI strip di bagian atas menunjukkan ringkasan real-time",
          ]} />
        </Section>

        {/* Section 14 - Roles */}
        <Section id="peran" title="14. Peran & Hak Akses" color="#003B62" pageBreak>
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead><tr style={{ background: "#003B62" }}><th className="px-4 py-2 text-left text-white">Role</th><th className="px-4 py-2 text-left text-white">Akses</th></tr></thead>
            <tbody>
              {[
                ["Owner", "Semua modul, semua cabang, approval tertinggi"],
                ["Branch Manager", "Semua modul cabang sendiri, approval level 2"],
                ["Sales", "Quotation, SO, Customer, JO (buat)"],
                ["CSO", "JO (monitor), Dokumen, Trucking"],
                ["Traffic/Ops", "JO (eksekusi), Booking, Trucking"],
                ["Finance", "Invoice AR/AP, Pembayaran, Laporan"],
                ["Admin", "Master data, User, Cabang, Settings"],
              ].map(([role, akses], i) => (
                <tr key={role} className="border-t" style={{ background: i % 2 ? "#F5F6F7" : "#fff" }}>
                  <td className="px-4 py-2 font-bold" style={{ color: "#0070F2" }}>{role}</td>
                  <td className="px-4 py-2">{akses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Footer */}
        <div className="text-center py-8 print:py-4">
          <div className="h-px w-full mb-6" style={{ background: "#D1D2D4" }} />
          <p className="text-xs" style={{ color: "#6A6D70" }}>© 2026 Wasilah Digital Sistem — Dokumen ini bersifat rahasia</p>
          <p className="text-xs mt-1" style={{ color: "#6A6D70" }}>PT Key Ocean Forwarding</p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:break-after-page { break-after: page; }
          .print\\:rounded-none { border-radius: 0; }
          .print\\:shadow-none { box-shadow: none; }
          .print\\:px-0 { padding-left: 0; padding-right: 0; }
          .print\\:py-0 { padding-top: 0; padding-bottom: 0; }
          .print\\:max-w-none { max-width: none; }
          .print\\:mb-0 { margin-bottom: 0; }
        }
      `}</style>
    </div>
  );
}

// Components
function Section({ title, color, children, pageBreak, id }: { title: string; color: string; children: React.ReactNode; pageBreak?: boolean; id?: string }) {
  return (
    <div id={id} className={`bg-white rounded-xl shadow-sm mb-6 overflow-hidden print:rounded-none print:shadow-none ${pageBreak ? "print:break-before-page" : ""} scroll-mt-20`}>
      <div className="px-6 py-4 border-l-4" style={{ borderColor: color, background: "#FAFBFC" }}>
        <h3 className="text-lg font-bold" style={{ color }}>{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function InfoBox({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 rounded-lg border-l-4" style={{ borderColor: color, background: color === "#E9730C" ? "#FFF8F0" : "#F5F8FF" }}>
      <p className="text-sm font-bold" style={{ color }}>{title}</p>
      <p className="text-sm mt-1" style={{ color: "#32363A" }}>{children}</p>
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "#0070F2" }}>{i + 1}</span>
          <p className="text-sm pt-0.5" style={{ color: "#32363A" }}>{step}</p>
        </div>
      ))}
    </div>
  );
}

function RoleBox({ roles }: { roles: { role: string; action: string }[] }) {
  return (
    <div className="mt-4 p-4 rounded-lg" style={{ background: "#F5F6F7" }}>
      <p className="text-xs font-bold uppercase mb-2" style={{ color: "#6A6D70" }}>Penanggung Jawab:</p>
      {roles.map((r) => (
        <div key={r.role} className="flex items-center gap-2 text-sm">
          <span className="font-bold" style={{ color: "#0070F2" }}>{r.role}:</span>
          <span>{r.action}</span>
        </div>
      ))}
    </div>
  );
}

function StatusFlow({ statuses, colors }: { statuses: string[]; colors: string[] }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {statuses.map((s, i) => (
        <div key={s} className="flex items-center">
          <span className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap" style={{ background: colors[i] }}>{s}</span>
          {i < statuses.length - 1 && <span className="mx-1 text-gray-300">→</span>}
        </div>
      ))}
    </div>
  );
}

function FlowDiagram() {
  const steps = [
    { icon: "📄", label: "Quotation", color: "#0070F2" },
    { icon: "📋", label: "Sales Order", color: "#0070F2" },
    { icon: "⚙️", label: "Job Order", color: "#E9730C" },
    { icon: "🛃", label: "Customs", color: "#E9730C" },
    { icon: "🚛", label: "Trucking", color: "#E9730C" },
    { icon: "🧾", label: "Invoice", color: "#107E3E" },
    { icon: "💳", label: "Payment", color: "#107E3E" },
    { icon: "✅", label: "Closed", color: "#32363A" },
  ];
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center">
          <div className="flex flex-col items-center min-w-[70px]">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center text-lg" style={{ background: s.color + "15" }}>{s.icon}</div>
            <span className="text-[9px] font-medium mt-1 text-center" style={{ color: s.color }}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className="w-4 h-0.5 rounded" style={{ background: "#D1D2D4" }} />}
        </div>
      ))}
    </div>
  );
}
