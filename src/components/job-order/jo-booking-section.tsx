"use client";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function JOBookingSection({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #0070F2" }}>
      <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "#D1D2D4" }}>
        <div><h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>📦 Booking & Space Confirmation</h3></div>
        <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "#E8F4FD", color: "#0070F2" }}>✅ Confirmed</span>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <I label="Booking Reference No." value={formData.bookingRef as string} required onChange={(v) => updateField("bookingRef", v)} />
          <I label="Booking Date" value={formData.bookingDate as string} type="date" />
          <I label="Booking Confirmation Date" value={formData.bookingConfirmDate as string} type="date" />
          <I label="Cut-off SI" value={formData.cutoffSI as string} type="datetime-local" required onChange={(v) => updateField("cutoffSI", v)} />
          <I label="Cut-off VGM" value={formData.cutoffVGM as string} type="datetime-local" />
          <I label="Cut-off Gate-In / CY" value={formData.cutoffGateIn as string} type="datetime-local" required onChange={(v) => updateField("cutoffGateIn", v)} />
          <I label="Cut-off Customs (BC)" value={formData.cutoffCustoms as string} type="datetime-local" />
        </div>
        <div className="space-y-3">
          <I label="Booking Agent / EMKL" value={formData.bookingAgent as string} onChange={(v) => updateField("bookingAgent", v)} />
          <I label="EMKL Contact" value={formData.emklContact as string} onChange={(v) => updateField("emklContact", v)} />
          <I label="Depo / Empty Pickup" value={formData.depoLocation as string} onChange={(v) => updateField("depoLocation", v)} />
          <I label="Stuffing Location" value={formData.stuffingLocation as string} onChange={(v) => updateField("stuffingLocation", v)} />
          <I label="Stuffing Date & Time" value={formData.stuffingDate as string} type="datetime-local" onChange={(v) => updateField("stuffingDate", v)} />
          <I label="Cargo Ready Date" value={formData.cargoReadyDate as string} type="date" required onChange={(v) => updateField("cargoReadyDate", v)} />
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Booking Notes</label><textarea rows={2} value={formData.bookingNotes as string} onChange={(e) => updateField("bookingNotes", e.target.value)} className="w-full px-3 py-2 rounded border text-sm resize-none focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
        </div>
      </div>
    </div>
  );
}

function I({ label, value, type, required, onChange }: { label: string; value: string; type?: string; required?: boolean; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type || "text"} value={value} readOnly={!onChange} onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full px-3 py-2 rounded border text-sm outline-none ${!onChange ? "bg-gray-50" : "focus:ring-2 focus:ring-[#0070F2]"}`} style={{ borderColor: "#D1D2D4" }} />
    </div>
  );
}
