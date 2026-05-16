"use client";

export function APApproval() {
  const matrix = [["< Rp 5 juta", "Traffic Officer"], ["Rp 5–25 juta", "Supervisor"], ["Rp 25–100 juta", "Manager"], ["> Rp 100 juta", "Direktur"]];
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #BB0000" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>✅ Approval Workflow</h3></div>
      <div className="p-5 space-y-4">
        {/* Steps */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {["Entry — Sigit ✅", "Supervisor — Pending ⏳", "Manager — 🔒"].map((s, i) => (
            <div key={i} className="flex items-center">
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap ${i === 0 ? "text-white" : i === 1 ? "text-white" : ""}`}
                style={i === 0 ? { background: "#107E3E" } : i === 1 ? { background: "#E9730C" } : { background: "#F5F6F7", color: "#6A6D70" }}>{i + 1}. {s}</span>
              {i < 2 && <div className="w-6 h-px mx-1" style={{ background: "#D1D2D4" }} />}
            </div>
          ))}
        </div>
        {/* Matrix */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          {matrix.map(([amt, role]) => (
            <div key={amt} className="p-2 rounded text-center" style={{ background: "#F5F6F7" }}>
              <p className="font-medium" style={{ color: "#32363A" }}>{amt}</p><p style={{ color: "#6A6D70" }}>{role}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded text-sm font-medium text-white" style={{ background: "#107E3E" }}>✅ Approve</button>
          <button className="px-4 py-2 rounded text-sm font-medium text-white" style={{ background: "#BB0000" }}>❌ Reject</button>
          <button className="px-4 py-2 rounded border text-sm font-medium" style={{ borderColor: "#E9730C", color: "#E9730C" }}>🔄 Return for Revision</button>
        </div>
      </div>
    </div>
  );
}
