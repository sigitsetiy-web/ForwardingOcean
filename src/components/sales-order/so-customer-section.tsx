"use client";
import { Info } from "lucide-react";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function SOCustomerSection({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>👤 Customer Information</h3>
        <p className="text-xs mt-0.5" style={{ color: "#6A6D70" }}>Auto-filled from Quotation — verify before confirming</p>
      </div>
      {/* Info strip */}
      <div className="mx-5 mt-4 px-4 py-2.5 rounded-md flex items-center gap-2 text-xs" style={{ background: "#E8F4FD", color: "#0070F2" }}>
        <Info className="h-4 w-4 shrink-0" />
        Data berikut di-import dari Quotation {formData.refQuotation as string}. Klik field untuk edit jika ada perubahan.
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Field label="Customer Name" required value={formData.customerName as string} locked />
          <Field label="Customer Code" value={formData.customerCode as string} locked readOnly />
          <Field label="Contact Person" required value={formData.contactPerson as string} onChange={(v) => updateField("contactPerson", v)} />
          <Field label="Phone / WhatsApp" required value={formData.phone as string} onChange={(v) => updateField("phone", v)} />
          <Field label="Email" required value={formData.email as string} onChange={(v) => updateField("email", v)} />
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Billing Address <span className="text-red-500">*</span></label>
            <textarea rows={3} value={formData.billingAddress as string} onChange={(e) => updateField("billingAddress", e.target.value)}
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none resize-none" style={{ borderColor: "#D1D2D4" }} />
          </div>
          <Field label="NPWP" value={formData.npwp as string} locked />
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Tax Type</label>
            <div className="flex gap-3">
              {["PKP", "Non-PKP"].map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="radio" name="taxType" checked={formData.taxType === t} onChange={() => updateField("taxType", t)} className="accent-[#0070F2]" />{t}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Currency <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              {["IDR", "USD"].map((c) => (
                <button key={c} onClick={() => updateField("currency", c)}
                  className={`px-4 py-2 rounded border text-sm font-medium ${formData.currency === c ? "text-white" : "hover:bg-gray-50"}`}
                  style={formData.currency === c ? { background: "#0070F2", borderColor: "#0070F2" } : { borderColor: "#D1D2D4", color: "#32363A" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, required, locked, readOnly, onChange }: { label: string; value: string; required?: boolean; locked?: boolean; readOnly?: boolean; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label} {required && <span className="text-red-500">*</span>} {locked && <span className="text-xs" title="Imported from Quotation">🔒</span>}</label>
      <input value={value} readOnly={readOnly || (locked && !onChange)} onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full px-3 py-2 rounded border text-sm outline-none ${readOnly || (locked && !onChange) ? "bg-gray-50" : "focus:ring-2 focus:ring-[#0070F2]"}`} style={{ borderColor: "#D1D2D4" }} />
    </div>
  );
}
