"use client";

export function APTaxSection() {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #BB0000" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🧾 PPN Masukan & Pajak</h3></div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Nomor Faktur Pajak Vendor <span className="text-red-500">*</span></label>
            <input defaultValue="010.000-25.00000045" className="w-full px-3 py-2 rounded border text-sm font-mono focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Tanggal Faktur Pajak</label>
            <input type="date" defaultValue="2025-05-10" className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Masa Pajak</label>
            <div className="px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }}>05/2025</div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Upload Faktur Pajak</label>
            <div className="h-16 rounded border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-blue-50" style={{ borderColor: "#D1D2D4" }}>
              <span className="text-xs" style={{ color: "#6A6D70" }}>📎 Drop file or click to upload</span></div></div>
        </div>
        <div className="space-y-3">
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>DPP Amount</label>
            <div className="px-3 py-2 rounded border text-sm bg-gray-50 font-mono" style={{ borderColor: "#D1D2D4" }}>Rp 4.500.000</div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>PPN Masukan</label>
            <div className="px-3 py-2 rounded border text-sm bg-gray-50 font-mono" style={{ borderColor: "#D1D2D4" }}>Rp 480.000</div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Status Faktur Pajak</label>
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "#E8F4FD", color: "#0070F2" }}>Diterima — Belum Upload ke Coretax</span></div>
          <div className="flex gap-2 pt-2">
            <button className="px-3 py-2 rounded text-xs font-medium text-white" style={{ background: "#0070F2" }}>Upload to Coretax</button>
            <button className="px-3 py-2 rounded border text-xs font-medium" style={{ borderColor: "#D1D2D4", color: "#32363A" }}>Validate FP</button>
          </div>
          <div className="p-3 rounded-lg text-xs" style={{ background: "#E6F4EA", color: "#107E3E" }}>
            ✅ PPN Masukan dapat dikreditkan pada masa pajak 05/2025 atau maks. 3 masa berikutnya
          </div>
        </div>
      </div>
    </div>
  );
}
