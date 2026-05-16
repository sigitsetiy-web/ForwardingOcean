"use client";

export function JOBillingSection() {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #0070F2" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🧾 Customer Billing — AR Tracking</h3>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Invoice Trigger</label><div className="px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }}>After DO Released</div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Invoice Number</label><input value="INV-2025-XXXX" readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50 font-mono" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Invoice Amount</label><div className="px-3 py-2 rounded border text-sm font-mono font-bold" style={{ borderColor: "#D1D2D4", color: "#0070F2" }}>IDR 95.850.000</div></div>
        </div>
        <div className="space-y-3">
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Billing Contact</label><div className="px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }}>Finance Dept - Ibu Sari</div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Faktur Pajak</label><input placeholder="Nomor Faktur Pajak" className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>AR Status</label>
            <div className="flex gap-1">
              {["Draft", "Sent", "Partial", "Paid", "Closed"].map((s, i) => (
                <span key={s} className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${i === 0 ? "text-white" : ""}`} style={i === 0 ? { background: "#0070F2" } : { background: "#F5F6F7", color: "#6A6D70" }}>{s}</span>
              ))}
            </div>
          </div>
          <div className="pt-2"><span className="text-xs" style={{ color: "#6A6D70" }}>Outstanding AR: </span><span className="text-sm font-bold" style={{ color: "#BB0000" }}>IDR 95.850.000</span></div>
        </div>
      </div>
    </div>
  );
}
