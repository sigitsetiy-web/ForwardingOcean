"use client";

export function APPaymentSchedule() {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #BB0000" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>📅 Payment Scheduling & Cash Flow</h3></div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Payment Terms</label><div className="px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }}>NET 14 Days</div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Due Date</label><div className="px-3 py-2 rounded border text-sm bg-gray-50 font-medium" style={{ borderColor: "#D1D2D4" }}>24 May 2025 <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ background: "#E6F4EA", color: "#107E3E" }}>8 hari lagi</span></div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Payment Priority</label>
            <div className="flex gap-2">{[["🔴 Critical", "#BB0000"], ["🟡 Normal", "#E9730C"], ["🟢 Flexible", "#107E3E"]].map(([l, c]) => (
              <span key={l} className={`px-3 py-1 rounded text-xs font-medium border cursor-pointer ${l.includes("Normal") ? "text-white" : ""}`}
                style={l.includes("Normal") ? { background: c, borderColor: c } : { borderColor: "#D1D2D4", color: "#32363A" }}>{l}</span>
            ))}</div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Scheduled Payment Date</label>
            <input type="date" defaultValue="2025-05-22" className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Payment Run Batch</label>
            <div className="px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }}>PR-2025-05-W3 (Week 3 May)</div></div>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-lg" style={{ background: "#F5F6F7" }}>
            <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "#6A6D70" }}>Beneficiary Bank</p>
            <div className="text-xs space-y-0.5" style={{ color: "#32363A" }}>
              <p>Bank: BCA</p><p>Account: PT EMKL Maju Jaya</p><p className="font-mono">No: 123-456-7890</p><p>Branch: Semarang</p>
            </div>
          </div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Payment Method</label>
            <div className="flex gap-2">{["Transfer Bank", "Giro", "TT"].map((m) => (
              <label key={m} className="flex items-center gap-1.5 text-xs"><input type="checkbox" defaultChecked={m === "Transfer Bank"} className="accent-[#0070F2] rounded" />{m}</label>
            ))}</div></div>
          <div className="p-3 rounded-lg text-xs" style={{ background: "#E6F4EA", color: "#107E3E" }}>
            ✅ Jika dibayar pada 22 May 2025: Aging Current (0 hari terlambat)
          </div>
        </div>
      </div>
    </div>
  );
}
