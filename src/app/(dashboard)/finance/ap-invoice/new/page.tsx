"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Save, Send, CheckCircle, X, Printer, Mail, Paperclip, Calendar, AlertTriangle, Truck, Building2 } from "lucide-react";
import { APVendorSelector } from "@/components/ap-invoice/ap-vendor-selector";
import { APHeaderBanner } from "@/components/ap-invoice/ap-header-banner";
import { APVendorInfo } from "@/components/ap-invoice/ap-vendor-info";
import { APLineItems } from "@/components/ap-invoice/ap-line-items";
import { APTaxSection } from "@/components/ap-invoice/ap-tax-section";
import { APApproval } from "@/components/ap-invoice/ap-approval";
import { APPaymentSchedule } from "@/components/ap-invoice/ap-payment-schedule";
import { APJOSummary } from "@/components/ap-invoice/ap-jo-summary";
import { APInternalFleet } from "@/components/ap-invoice/ap-internal-fleet";

export default function NewAPInvoicePage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [vendorType, setVendorType] = useState<"external" | "internal" | null>(null);

  const handleSaveAP = async () => {
    try {
      const joRes = await fetch("/api/job-orders?pageSize=1");
      const joData = await joRes.json();
      const jobOrderId = joData.data?.[0]?.id;

      if (!jobOrderId) { alert("Belum ada Job Order. Buat JO terlebih dahulu."); return; }

      const res = await fetch("/api/vendor-invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobOrderId,
          vendorType: "EMKL",
          vendorName: "PT EMKL Maju Jaya",
          vendorCode: "V.00022",
          vendorNpwp: "02.345.678.9-012.000",
          vendorPkpStatus: "PKP",
          vendorInvoiceNo: "INV/MJ/2026/001",
          apType: "CUSTOMS",
          currency: "IDR",
          paymentTerms: "NET14",
          createdById: user?.id,
          lineItems: [
            { description: "Jasa Pengurusan PIB", category: "Customs", uom: "Per Shipment", quantity: 1, unitPrice: 3500000, amount: 3500000, ppnMasukan: true },
            { description: "PNBP", category: "Customs", uom: "Per Shipment", quantity: 1, unitPrice: 500000, amount: 500000, ppnMasukan: false },
            { description: "Handling Fee", category: "Handling", uom: "Per Shipment", quantity: 1, unitPrice: 500000, amount: 500000, ppnMasukan: true },
          ],
        }),
      });

      if (res.ok) {
        alert("Vendor Invoice (AP) berhasil disimpan!");
        router.push("/finance");
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menyimpan AP");
      }
    } catch (e) {
      alert("Error: " + (e instanceof Error ? e.message : "Unknown"));
    }
  };

  // If not selected yet, show selector
  if (!vendorType) {
    return <APVendorSelector onSelect={setVendorType} />;
  }

  if (vendorType === "internal") {
    return <APInternalFleet user={user} onBack={() => setVendorType(null)} />;
  }

  // External Vendor Flow
  return (
    <div className="min-h-screen" style={{ background: "#F5F6F7" }}>
      {/* Breadcrumb */}
      <div className="px-6 py-3 flex items-center justify-between text-sm">
        <div style={{ color: "#6A6D70" }}>
          <span className="hover:text-[#0070F2] cursor-pointer">Home</span><span className="mx-2">›</span>
          <span className="hover:text-[#0070F2] cursor-pointer">Purchasing</span><span className="mx-2">›</span>
          <span className="hover:text-[#0070F2] cursor-pointer">Vendor Invoice</span><span className="mx-2">›</span>
          <span style={{ color: "#32363A" }} className="font-medium">New (External)</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setVendorType(null)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: "#D1D2D4", color: "#6A6D70" }}>← Change Type</button>
          <span className="text-xs" style={{ color: "#6A6D70" }}>Entered by: {user?.name || "Sigit"}</span>
        </div>
      </div>

      <div className="px-6 pb-24 max-w-[1440px] mx-auto space-y-5">
        {/* Multi-vendor tabs */}
        <APMultiVendorTabs />
        <APHeaderBanner />
        <APVendorInfo />
        {/* JO Reference */}
        <JORefPanel />
        <APLineItems />
        <APTaxSection />
        <APApproval />
        <APPaymentSchedule />
        <APJOSummary />
        {/* Activity Log */}
        <CollapsiblePanel title="🕐 Activity Log" items={[
          "12 May 2025 08:00 — AP Entry created by Sigit (from JO)",
          "12 May 2025 08:05 — Matched to Vendor PO: VP-2025-031",
          "12 May 2025 09:00 — Submitted for approval to Supervisor",
        ]} accentColor="#BB0000" />
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50" style={{ borderColor: "#D1D2D4" }}>
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <Btn icon={<Printer className="h-4 w-4" />} label="Print AP Voucher" v="ghost" />
            <Btn icon={<Mail className="h-4 w-4" />} label="Send Payment Advice" v="ghost" />
            <Btn icon={<Paperclip className="h-4 w-4" />} label="Attach Invoice" v="ghost" />
          </div>
          <div className="flex gap-2">
            <Btn icon={<Save className="h-4 w-4" />} label="Save Draft" v="ghost" onClick={handleSaveAP} />
            <Btn icon={<Send className="h-4 w-4" />} label="Submit for Approval" v="outline" onClick={handleSaveAP} />
            <Btn icon={<Calendar className="h-4 w-4" />} label="Schedule Payment" v="primary" />
            <Btn icon={<CheckCircle className="h-4 w-4" />} label="Mark as Paid" v="success" />
            <Btn icon={<AlertTriangle className="h-4 w-4" />} label="Dispute" v="warning" />
            <Btn icon={<X className="h-4 w-4" />} label="Cancel" v="danger" onClick={() => router.push("/finance")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function APMultiVendorTabs() {
  const tabs = [
    { id: 0, no: "AP-001", vendor: "Evergreen Shipping", currency: "USD", status: "approved", color: "#0070F2" },
    { id: 1, no: "AP-002", vendor: "EMKL Maju Jaya", currency: "IDR", status: "pending", color: "#E9730C" },
    { id: 2, no: "AP-003", vendor: "CV Cepat Trucking", currency: "IDR", status: "draft", color: "#6A6D70" },
  ];
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4" style={{ borderColor: "#D1D2D4" }}>
      <div className="flex items-center justify-between mb-3">
        <div><h3 className="text-sm font-bold" style={{ color: "#003B62" }}>📋 AP Session — JO-2025-0112</h3>
          <p className="text-xs" style={{ color: "#6A6D70" }}>Satu Job Order dapat memiliki beberapa AP dari vendor yang berbeda</p></div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t, i) => (
          <button key={t.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-left min-w-[200px] ${i === 1 ? "shadow-md" : ""}`}
            style={{ borderColor: i === 1 ? "#BB0000" : "#D1D2D4", background: i === 1 ? "#FFF5F5" : "#fff" }}>
            <div className="flex-1"><p className="text-xs font-mono font-bold" style={{ color: "#32363A" }}>{t.no}</p><p className="text-[10px]" style={{ color: "#6A6D70" }}>{t.vendor} · {t.currency}</p></div>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white" style={{ background: t.color }}>{t.status === "approved" ? "✅" : t.status === "pending" ? "⏳" : "📝"} {t.status}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-6 text-xs px-2 py-2 rounded" style={{ background: "#F5F6F7", color: "#6A6D70" }}>
        <span>Total AP IDR: <b style={{ color: "#32363A" }}>Rp 7.300.000</b></span>
        <span>Total AP USD: <b style={{ color: "#32363A" }}>$850</b></span>
        <span>Total (equiv): <b style={{ color: "#32363A" }}>Rp 20.900.000</b></span>
        <span>Belum Dibayar: <b style={{ color: "#BB0000" }}>Rp 7.300.000</b></span>
      </div>
    </div>
  );
}

function JORefPanel() {
  const fields = [
    ["Customer", "PT Sritex (SRIL)"], ["Service", "Sea Freight + Customs + Trucking"], ["POL", "Shanghai 🇨🇳"], ["POD", "Tanjung Emas 🇮🇩"],
    ["Vessel", "Ever Given / 0112W"], ["Container", "EGHU1234567 (40'HC)"], ["ETD", "01 May 2025"], ["ETA", "15 May 2025"],
    ["B/L", "EVGL-SHG-001234"], ["Commodity", "Grey Fabric"], ["HS Code", "5208.11.00"], ["Incoterms", "CIF"],
  ];
  return (
    <div className="rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #BB0000", background: "#FAFBFC" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🚢 Job Order Reference — JO-2025-0112</h3></div>
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        {fields.map(([l, v]) => (<div key={l}><p className="text-[10px] font-medium" style={{ color: "#6A6D70" }}>{l} 🔒</p><p className="text-xs font-medium mt-0.5" style={{ color: "#32363A" }}>{v}</p></div>))}
      </div>
    </div>
  );
}

function CollapsiblePanel({ title, items, accentColor }: { title: string; items: string[]; accentColor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: `4px solid ${accentColor}` }}>
      <button onClick={() => setOpen(!open)} className="w-full px-5 py-3 flex items-center justify-between text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
        <span>{title}</span><span>{open ? "▴" : "▾"}</span>
      </button>
      {open && (<div className="px-5 pb-5 border-t" style={{ borderColor: "#D1D2D4" }}><div className="mt-4 space-y-3">
        {items.map((l, i) => (<div key={i} className="flex items-start gap-3"><div className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0" style={{ background: accentColor }} /><p className="text-sm" style={{ color: "#32363A" }}>{l}</p></div>))}
      </div></div>)}
    </div>
  );
}

function Btn({ icon, label, v, onClick }: { icon: React.ReactNode; label: string; v: "primary"|"outline"|"ghost"|"danger"|"success"|"warning"; onClick?: () => void }) {
  const s: Record<string, React.CSSProperties> = {
    primary: { background: "#BB0000", color: "#fff", border: "1px solid #BB0000" },
    success: { background: "#107E3E", color: "#fff", border: "1px solid #107E3E" },
    warning: { background: "#E9730C", color: "#fff", border: "1px solid #E9730C" },
    outline: { background: "transparent", color: "#0070F2", border: "1px solid #0070F2" },
    ghost: { background: "transparent", color: "#32363A", border: "1px solid #D1D2D4" },
    danger: { background: "transparent", color: "#BB0000", border: "1px solid #BB0000" },
  };
  return <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90" style={s[v]}>{icon}{label}</button>;
}
