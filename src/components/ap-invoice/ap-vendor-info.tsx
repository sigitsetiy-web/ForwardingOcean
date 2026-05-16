"use client";
import { AlertTriangle } from "lucide-react";

const vendorTypes = ["🚢 Shipping Line", "✈️ Airline", "🛃 EMKL/PPJK", "🚛 Trucking", "📦 Depo/CY", "🏭 Warehouse", "🔍 Surveyor", "💉 Fumigasi", "🏦 Bank", "📋 Other"];

export function APVendorInfo() {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #BB0000" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🏢 Vendor / Supplier Information</h3></div>
      <div className="mx-5 mt-4 px-4 py-2 rounded-md flex items-center gap-2 text-xs" style={{ background: "#FFF5F5", color: "#BB0000" }}>
        <AlertTriangle className="h-4 w-4 shrink-0" />Pastikan data vendor sesuai dengan NPWP & Faktur Pajak yang diterima.
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium mb-2" style={{ color: "#32363A" }}>Vendor Type <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-1.5">{vendorTypes.map((t) => (
              <span key={t} className={`px-2 py-1 rounded text-[10px] font-medium border cursor-pointer ${t.includes("EMKL") ? "text-white" : ""}`}
                style={t.includes("EMKL") ? { background: "#0070F2", borderColor: "#0070F2" } : { borderColor: "#D1D2D4", color: "#32363A" }}>{t}</span>
            ))}</div></div>
          <F label="Vendor Name" value="PT EMKL Maju Jaya" required />
          <F label="Vendor Code" value="V.00022" locked />
          <F label="Contact Person" value="Pak Hadi" />
          <F label="Phone / Email" value="081234567890 / hadi@emklmaju.co.id" />
        </div>
        <div className="space-y-3">
          <F label="NPWP Vendor" value="02.345.678.9-012.000" locked />
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>PKP Status</label><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#E6F4EA", color: "#107E3E" }}>✅ PKP</span></div>
          <F label="Vendor Address" value="Jl. Pelabuhan No. 45, Semarang" locked />
          <F label="Payment Terms" value="NET 14 Days" />
          <div className="p-3 rounded-lg" style={{ background: "#F5F6F7" }}>
            <p className="text-[10px] font-bold uppercase mb-1" style={{ color: "#6A6D70" }}>Bank Vendor</p>
            <p className="text-xs">BCA · PT EMKL Maju Jaya · 123-456-7890</p>
          </div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>PPh 23 Applicable?</label>
            <div className="flex items-center gap-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#E8F4FD", color: "#0070F2" }}>Yes — 2%</span><span className="text-xs" style={{ color: "#6A6D70" }}>Amount: Rp 90.000</span></div></div>
        </div>
      </div>
    </div>
  );
}

function F({ label, value, required, locked }: { label: string; value: string; required?: boolean; locked?: boolean }) {
  return (<div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label} {required && <span className="text-red-500">*</span>} {locked && <span>🔒</span>}</label>
    <input value={value} readOnly={locked} className={`w-full px-3 py-2 rounded border text-sm outline-none ${locked ? "bg-gray-50" : "focus:ring-2 focus:ring-[#0070F2]"}`} style={{ borderColor: "#D1D2D4" }} /></div>);
}
