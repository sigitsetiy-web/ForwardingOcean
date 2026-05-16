"use client";

interface Props { formData: Record<string, unknown>; }

export function InvTaxSection({ formData }: Props) {
  const isOverseas = formData.taxStatus === "overseas";
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #107E3E" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🧾 Tax & Compliance</h3>
      </div>
      <div className="p-5">
        {isOverseas ? (
          <div className="px-4 py-3 rounded-lg" style={{ background: "#E8F4FD" }}>
            <p className="text-sm font-medium" style={{ color: "#0070F2" }}>Jasa kepada overseas party — PPN 0% (Ekspor Jasa)</p>
            <p className="text-xs mt-1" style={{ color: "#6A6D70" }}>Ref: PMK-32/PMK.010/2019 — Penyerahan Jasa Kena Pajak ke luar Daerah Pabean</p>
            <p className="text-xs mt-2" style={{ color: "#32363A" }}>Faktur Pajak: <b>Tidak diperlukan</b> untuk transaksi overseas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Faktur Pajak Number <span className="text-red-500">*</span></label>
                <div className="flex gap-2"><input placeholder="010.000-25.XXXXXXXX" className="flex-1 px-3 py-2 rounded border text-sm font-mono focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} />
                  <button className="px-3 py-2 rounded text-xs font-medium text-white" style={{ background: "#0070F2" }}>Generate</button></div></div>
              <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>PPN Rate</label><div className="px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }}>12% (Standard)</div></div>
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Buyer NPWP</label><div className="px-3 py-2 rounded border text-sm bg-gray-50 font-mono" style={{ borderColor: "#D1D2D4" }}>{formData.npwp as string || "N/A"}</div></div>
              <div className="flex gap-2"><button className="px-3 py-2 rounded text-xs font-medium text-white" style={{ background: "#0070F2" }}>Upload to Coretax</button>
                <button className="px-3 py-2 rounded border text-xs font-medium" style={{ borderColor: "#D1D2D4", color: "#32363A" }}>Download FP PDF</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
