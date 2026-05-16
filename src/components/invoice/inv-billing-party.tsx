"use client";
import { Info } from "lucide-react";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

const partyTypes = [
  { id: "consignee", icon: "🏢", label: "Consignee/Importir" },
  { id: "shipper", icon: "🚢", label: "Shipper/Eksportir" },
  { id: "overseas_agent", icon: "🌐", label: "Overseas Agent" },
  { id: "trading_house", icon: "🤝", label: "Trading House" },
  { id: "notify_party", icon: "🏦", label: "Notify Party" },
  { id: "other", icon: "📦", label: "Other" },
];

export function InvBillingParty({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #107E3E" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>👤 Bill To — Billing Party Information</h3>
        <p className="text-xs mt-0.5" style={{ color: "#6A6D70" }}>Pihak yang menerima dan bertanggung jawab atas pembayaran invoice ini</p>
      </div>
      <div className="mx-5 mt-4 px-4 py-2 rounded-md flex items-center gap-2 text-xs" style={{ background: "#E8F4FD", color: "#0070F2" }}>
        <Info className="h-4 w-4 shrink-0" />Invoice ini adalah [2 dari 3] invoice untuk {formData.refJO as string}. Billing party dapat berbeda dari Shipper/Consignee di JO.
      </div>
      <div className="p-5">
        {/* Party Type */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-2" style={{ color: "#32363A" }}>Billing Party Type <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-2">
            {partyTypes.map((pt) => (
              <button key={pt.id} onClick={() => updateField("partyType", pt.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${formData.partyType === pt.id ? "text-white shadow-sm" : "hover:bg-gray-50"}`}
                style={formData.partyType === pt.id ? { background: "#0070F2", borderColor: "#0070F2" } : { borderColor: "#D1D2D4", color: "#32363A" }}>
                {pt.icon} {pt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <F label="Company Name" value={formData.companyName as string} required onChange={(v) => updateField("companyName", v)} />
            <F label="Customer Code" value={formData.customerCode as string} locked />
            <F label="Contact Person / Attn." value={formData.contactPerson as string} required onChange={(v) => updateField("contactPerson", v)} />
            <F label="Phone / WhatsApp" value={formData.phone as string} required onChange={(v) => updateField("phone", v)} />
            <F label="Email" value={formData.email as string} required onChange={(v) => updateField("email", v)} />
            <F label="PIC Finance" value={formData.picFinance as string} onChange={(v) => updateField("picFinance", v)} />
            <F label="Finance Email" value={formData.financeEmail as string} onChange={(v) => updateField("financeEmail", v)} />
          </div>
          <div className="space-y-3">
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Billing Address <span className="text-red-500">*</span></label>
              <textarea rows={3} value={formData.billingAddress as string} onChange={(e) => updateField("billingAddress", e.target.value)} className="w-full px-3 py-2 rounded border text-sm resize-none focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
            <F label="Country" value={formData.country as string} required onChange={(v) => updateField("country", v)} />
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Tax Status</label>
              <div className="flex gap-3">{["PKP", "Non-PKP", "Overseas (N/A)"].map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" name="taxStatus" checked={formData.taxStatus === t.toLowerCase().split(" ")[0]} onChange={() => updateField("taxStatus", t.toLowerCase().split(" ")[0])} className="accent-[#0070F2]" />{t}</label>
              ))}</div></div>
            <F label="Customer PO Reference" value={formData.poReference as string} onChange={(v) => updateField("poReference", v)} />
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Special Billing Instructions</label>
              <textarea rows={2} value={formData.specialInstructions as string} onChange={(e) => updateField("specialInstructions", e.target.value)} className="w-full px-3 py-2 rounded border text-sm resize-none focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function F({ label, value, required, locked, onChange }: { label: string; value: string; required?: boolean; locked?: boolean; onChange?: (v: string) => void }) {
  return (<div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label} {required && <span className="text-red-500">*</span>} {locked && <span>🔒</span>}</label>
    <input value={value} readOnly={locked} onChange={onChange ? (e) => onChange(e.target.value) : undefined} className={`w-full px-3 py-2 rounded border text-sm outline-none ${locked ? "bg-gray-50" : "focus:ring-2 focus:ring-[#0070F2]"}`} style={{ borderColor: "#D1D2D4" }} /></div>);
}
