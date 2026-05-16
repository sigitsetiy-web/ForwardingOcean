"use client";
import { useState } from "react";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function JOCustomsSection({ formData, updateField }: Props) {
  const [tab, setTab] = useState("import");
  const jalur = formData.jalurPabean as string;

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #0070F2" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🛃 Customs Clearance — Kepabeanan</h3>
      </div>
      {/* Tabs */}
      <div className="px-5 pt-3 flex gap-1">
        {[{ id: "import", label: "Import (PIB)" }, { id: "export", label: "Export (PEB)" }, { id: "local", label: "Local (SPPB)" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-t text-xs font-medium border border-b-0 ${tab === t.id ? "bg-white" : "bg-gray-100"}`} style={{ borderColor: "#D1D2D4", color: tab === t.id ? "#0070F2" : "#6A6D70" }}>{t.label}</button>
        ))}
      </div>
      {/* Import Tab */}
      {tab === "import" && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t" style={{ borderColor: "#D1D2D4" }}>
          <div className="space-y-3">
            <I label="Importir Name" value={formData.importirName as string} locked />
            <I label="NPWP Importir" value={formData.importirNpwp as string} locked />
            <I label="API Number" value={formData.apiNumber as string} locked />
            <I label="PIB Number" value={formData.pibNumber as string} onChange={(v) => updateField("pibNumber", v)} placeholder="Akan diisi setelah submit" />
            <I label="PIB Date" value={formData.pibDate as string} type="date" onChange={(v) => updateField("pibDate", v)} />
            <I label="SPPB Number" value={formData.sppbNumber as string} onChange={(v) => updateField("sppbNumber", v)} placeholder="Akan terbit setelah clearance" />
            <I label="SPPB Date" value={formData.sppbDate as string} type="date" onChange={(v) => updateField("sppbDate", v)} />
          </div>
          <div className="space-y-3">
            <I label="Kantor Pabean" value={formData.kantorPabean as string} locked />
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Jalur Pabean</label>
              <div className="flex gap-2">
                {[{ id: "hijau", label: "🟢 Hijau", c: "#107E3E" }, { id: "kuning", label: "🟡 Kuning", c: "#E9730C" }, { id: "merah", label: "🔴 Merah", c: "#BB0000" }, { id: "mita", label: "🔵 MITA", c: "#0070F2" }].map((j) => (
                  <button key={j.id} onClick={() => updateField("jalurPabean", j.id)} className={`px-3 py-1.5 rounded text-xs font-medium border ${jalur === j.id ? "text-white" : ""}`}
                    style={jalur === j.id ? { background: j.c, borderColor: j.c } : { borderColor: "#D1D2D4", color: "#32363A" }}>{j.label}</button>
                ))}
              </div>
            </div>
            <I label="Nilai CIF (USD)" value={formData.nilaiCIF as string} onChange={(v) => updateField("nilaiCIF", v)} />
            <I label="Bea Masuk (IDR)" value={formData.beaMasuk as string} onChange={(v) => updateField("beaMasuk", v)} />
            <I label="PPN Impor (IDR)" value={formData.ppnImpor as string} onChange={(v) => updateField("ppnImpor", v)} />
            <I label="PPh Pasal 22 (IDR)" value={formData.pphImpor as string} onChange={(v) => updateField("pphImpor", v)} />
            <I label="PNBP (IDR)" value={formData.pnbp as string} onChange={(v) => updateField("pnbp", v)} />
            <div className="pt-2 px-3 py-2 rounded" style={{ background: "#F5F6F7" }}>
              <span className="text-xs font-medium" style={{ color: "#003B62" }}>Total PDRI: </span>
              <span className="text-sm font-bold" style={{ color: "#0070F2" }}>IDR {new Intl.NumberFormat("id-ID").format(Number(formData.beaMasuk || 0) + Number(formData.ppnImpor || 0) + Number(formData.pphImpor || 0) + Number(formData.pnbp || 0))}</span>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Status Clearance</label>
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "#E8F4FD", color: "#0070F2" }}>{formData.statusClearance as string}</span>
            </div>
          </div>
        </div>
      )}
      {tab === "export" && <div className="p-5 text-sm text-center py-8" style={{ color: "#6A6D70" }}>Export (PEB) section — akan aktif untuk shipment export</div>}
      {tab === "local" && <div className="p-5 text-sm text-center py-8" style={{ color: "#6A6D70" }}>Local (SPPB) section — akan aktif untuk shipment domestik</div>}
    </div>
  );
}

function I({ label, value, type, locked, onChange, placeholder }: { label: string; value: string; type?: string; locked?: boolean; onChange?: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label} {locked && <span>🔒</span>}</label>
      <input type={type || "text"} value={value} readOnly={locked && !onChange} onChange={onChange ? (e) => onChange(e.target.value) : undefined} placeholder={placeholder}
        className={`w-full px-3 py-2 rounded border text-sm outline-none ${locked && !onChange ? "bg-gray-50" : "focus:ring-2 focus:ring-[#0070F2]"}`} style={{ borderColor: "#D1D2D4" }} />
    </div>
  );
}
