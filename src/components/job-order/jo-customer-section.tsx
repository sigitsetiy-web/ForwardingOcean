"use client";
import { Info } from "lucide-react";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function JOCustomerSection({ formData, updateField }: Props) {
  return (
    <Panel title="👤 Principal / Customer Information" subtitle="Auto-filled from Sales Order — verify before execution">
      <div className="mx-5 mt-4 px-4 py-2 rounded-md flex items-center gap-2 text-xs" style={{ background: "#E8F4FD", color: "#0070F2" }}>
        <Info className="h-4 w-4 shrink-0" />Data di-import dari {formData.refSO as string}. Edit jika ada revisi instruksi customer.
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <F label="Customer / Principal Name" value={formData.customerName as string} required locked />
          <F label="Customer Code" value={formData.customerCode as string} locked />
          <F label="Contact Person (Ops)" value={formData.contactPerson as string} required onChange={(v) => updateField("contactPerson", v)} />
          <F label="Phone / WhatsApp" value={formData.phone as string} required onChange={(v) => updateField("phone", v)} />
          <F label="Email (for operational updates)" value={formData.email as string} onChange={(v) => updateField("email", v)} />
          <F label="Notify Party" value={formData.notifyParty as string} onChange={(v) => updateField("notifyParty", v)} placeholder="If different from consignee" />
        </div>
        <div className="space-y-3">
          <F label="Shipper Name" value={formData.shipperName as string} required locked />
          <Tx label="Shipper Address" value={formData.shipperAddress as string} locked />
          <F label="Consignee Name" value={formData.consigneeName as string} required locked />
          <Tx label="Consignee Address" value={formData.consigneeAddress as string} locked />
          <F label="Consignee NPWP" value={formData.consigneeNpwp as string} locked />
          <F label="End Buyer (if different)" value={formData.endBuyer as string} onChange={(v) => updateField("endBuyer", v)} />
        </div>
      </div>
    </Panel>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #0070F2" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>{title}</h3>
        <p className="text-xs mt-0.5" style={{ color: "#6A6D70" }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function F({ label, value, required, locked, onChange, placeholder }: { label: string; value: string; required?: boolean; locked?: boolean; onChange?: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label} {required && <span className="text-red-500">*</span>} {locked && !onChange && <span>🔒</span>}</label>
      <input value={value} readOnly={locked && !onChange} onChange={onChange ? (e) => onChange(e.target.value) : undefined} placeholder={placeholder}
        className={`w-full px-3 py-2 rounded border text-sm outline-none ${locked && !onChange ? "bg-gray-50" : "focus:ring-2 focus:ring-[#0070F2]"}`} style={{ borderColor: "#D1D2D4" }} />
    </div>
  );
}

function Tx({ label, value, locked }: { label: string; value: string; locked?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label} {locked && <span>🔒</span>}</label>
      <textarea rows={2} value={value} readOnly={locked} className="w-full px-3 py-2 rounded border text-sm bg-gray-50 resize-none" style={{ borderColor: "#D1D2D4" }} />
    </div>
  );
}
