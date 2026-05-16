"use client";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function SOAssignmentSection({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>⚙️ Internal Assignment</h3>
        <p className="text-xs mt-0.5" style={{ color: "#6A6D70" }}>Penanggungjawab internal dan vendor yang akan digunakan</p>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Fld label="Sales Person" value={formData.salesPerson as string} readOnly />
          <Fld label="Account Manager"><input className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }} placeholder="Pilih account manager" /></Fld>
          <Fld label="Traffic / Operations Officer"><input className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }} placeholder="Pilih officer" /></Fld>
          <Fld label="Branch / Office" value={formData.branch as string} readOnly />
          <Fld label="Division" value={formData.division as string} readOnly />
          <Fld label="Cost Center"><input className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }} placeholder="Dept code" /></Fld>
          <Fld label="Project Code"><input className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }} placeholder="For multi-JO tracking" /></Fld>
        </div>
        <div className="space-y-3">
          <Fld label="Preferred Shipping Line / Airline" value={formData.shippingLine as string} onChange={(v) => updateField("shippingLine", v)} />
          <Fld label="Preferred EMKL Partner" value={formData.emklPartner as string} onChange={(v) => updateField("emklPartner", v)} />
          <Fld label="Preferred Trucking Vendor" value={formData.truckingVendor as string} onChange={(v) => updateField("truckingVendor", v)} />
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Internal Notes / Handling Instructions</label>
            <textarea rows={3} value={formData.internalNotes as string} onChange={(e) => updateField("internalNotes", e.target.value)} className="w-full px-3 py-2 rounded border text-sm resize-none focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Customer Special Requirements</label>
            <textarea rows={2} value={formData.customerRequirements as string} onChange={(e) => updateField("customerRequirements", e.target.value)} className="w-full px-3 py-2 rounded border text-sm resize-none focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Fld({ label, value, readOnly, children, onChange }: { label: string; value?: string; readOnly?: boolean; children?: React.ReactNode; onChange?: (v: string) => void }) {
  if (children) return <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label}</label>{children}</div>;
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label}</label>
      <input value={value || ""} readOnly={readOnly && !onChange} onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full px-3 py-2 rounded border text-sm outline-none ${readOnly && !onChange ? "bg-gray-50" : "focus:ring-2 focus:ring-[#0070F2]"}`} style={{ borderColor: "#D1D2D4" }} />
    </div>
  );
}
