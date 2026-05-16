"use client";

interface Props { user: { name?: string } | null; }

export function SOSignatureSection({ user }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>✍️ Authorization</h3>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Col 1 - Sales */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase" style={{ color: "#6A6D70" }}>Dibuat Oleh (Sales)</p>
          <div><label className="block text-xs mb-1" style={{ color: "#32363A" }}>Name</label><input value={user?.name || "Sigit Setiyanto"} readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs mb-1" style={{ color: "#32363A" }}>Jabatan</label><input value="Sales Executive" readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs mb-1" style={{ color: "#32363A" }}>Tanggal</label><input type="date" value="2025-05-12" readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }} /></div>
          <div className="h-20 rounded border-2 border-dashed flex items-center justify-center" style={{ borderColor: "#D1D2D4" }}><span className="text-xs" style={{ color: "#6A6D70" }}>Signature</span></div>
        </div>
        {/* Col 2 - Manager */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase" style={{ color: "#6A6D70" }}>Disetujui Oleh (Manager)</p>
          <div><label className="block text-xs mb-1" style={{ color: "#32363A" }}>Name</label><select className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }}><option>-- Pilih Approver --</option><option>Budi Santoso - Branch Manager</option></select></div>
          <div><label className="block text-xs mb-1" style={{ color: "#32363A" }}>Jabatan</label><input placeholder="Auto-fill" className="w-full px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }} readOnly /></div>
          <div><label className="block text-xs mb-1" style={{ color: "#32363A" }}>Tanggal Approval</label><input type="date" className="w-full px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }} readOnly /></div>
          <div className="h-20 rounded border-2 border-dashed flex items-center justify-center" style={{ borderColor: "#D1D2D4" }}><span className="text-xs" style={{ color: "#6A6D70" }}>Signature</span></div>
          <button className="w-full px-3 py-2 rounded text-sm font-medium text-white" style={{ background: "#0070F2" }}>Request Approval</button>
        </div>
        {/* Col 3 - Customer */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase" style={{ color: "#6A6D70" }}>Konfirmasi Customer</p>
          <div><label className="block text-xs mb-1" style={{ color: "#32363A" }}>Customer Representative</label><input placeholder="Nama perwakilan" className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs mb-1" style={{ color: "#32363A" }}>Jabatan</label><input placeholder="Jabatan" className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs mb-1" style={{ color: "#32363A" }}>Tanggal Konfirmasi</label><input type="date" className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs mb-1" style={{ color: "#32363A" }}>PO / Acceptance Ref</label><input placeholder="PO-DP-2025-XXXX" className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div className="h-20 rounded border-2 border-dashed flex items-center justify-center" style={{ borderColor: "#D1D2D4" }}><span className="text-xs" style={{ color: "#6A6D70" }}>Signature & Stamp</span></div>
        </div>
      </div>
    </div>
  );
}
