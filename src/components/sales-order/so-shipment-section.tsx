"use client";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function SOShipmentSection({ formData, updateField }: Props) {
  const serviceTypes = formData.serviceTypes as string[];
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🚢 Shipment & Service Scope</h3>
        <p className="text-xs mt-0.5" style={{ color: "#6A6D70" }}>Confirmed scope of work berdasarkan quotation yang disetujui</p>
      </div>
      <div className="p-5 space-y-4">
        {/* Service chips */}
        <div className="flex flex-wrap gap-2">
          {serviceTypes.map((s) => (
            <span key={s} className="px-3 py-1.5 rounded-full text-xs font-medium text-white" style={{ background: "#107E3E" }}>✅ {s}</span>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Fld label="Incoterms" value={formData.incoterms as string} locked />
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Shipment Direction</label>
            <div className="flex gap-3">
              {["Import", "Export", "Local"].map((d) => (
                <label key={d} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="radio" name="direction" checked={formData.direction === d} onChange={() => updateField("direction", d)} className="accent-[#0070F2]" />{d}
                </label>
              ))}
            </div>
          </div>
          <div></div>
          <Fld label="Port of Loading" required value={formData.pol as string} icon="🚢" locked />
          <Fld label="Port of Discharge" required value={formData.pod as string} icon="🚢" locked />
          <Fld label="Transit Port" value={formData.transitPort as string} onChange={(v) => updateField("transitPort", v)} />
          <Fld label="ETD" value={formData.etd as string} type="date" onChange={(v) => updateField("etd", v)} />
          <Fld label="ETA" value={formData.eta as string} type="date" onChange={(v) => updateField("eta", v)} />
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Transit Time</label>
            <div className="px-3 py-2 rounded border text-sm bg-gray-50 font-medium" style={{ borderColor: "#D1D2D4" }}>± 14 days</div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Commodity <span className="text-red-500">*</span> 🔒</label>
            <textarea rows={2} value={formData.commodity as string} readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50 resize-none" style={{ borderColor: "#D1D2D4" }} />
          </div>
          <Fld label="HS Code 🔍" value={formData.hsCode as string} locked />
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Cargo Type</label>
            <div className="flex gap-3">
              {["FCL", "LCL", "Bulk", "Break Bulk"].map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-sm"><input type="radio" name="cargo" checked={formData.cargoType === t} readOnly className="accent-[#0070F2]" />{t}</label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Container: {(formData.containerSizes as string[]).join(", ")}</label>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium">{formData.numUnits as string} units</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50" style={{ color: "#0070F2" }}>{formData.estWeight as string} {formData.weightUnit as string}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50" style={{ color: "#0070F2" }}>{formData.estVolume as string} {formData.volumeUnit as string}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>DG / Insurance</label>
            <div className="flex gap-4 text-sm">
              <span>DG: {formData.dangerousGoods ? "⚠️ Yes" : "No"}</span>
              <span>Insurance: {formData.insuranceRequired ? "✅ Yes (All Risk)" : "No"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fld({ label, value, required, locked, icon, type, onChange }: { label: string; value: string; required?: boolean; locked?: boolean; icon?: string; type?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{icon} {label} {required && <span className="text-red-500">*</span>} {locked && <span>🔒</span>}</label>
      <input type={type || "text"} value={value} readOnly={locked && !onChange} onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full px-3 py-2 rounded border text-sm outline-none ${locked && !onChange ? "bg-gray-50" : "focus:ring-2 focus:ring-[#0070F2]"}`} style={{ borderColor: "#D1D2D4" }} />
    </div>
  );
}
