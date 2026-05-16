"use client";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function InvDelivery({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #107E3E" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>📤 Invoice Delivery</h3>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium mb-2" style={{ color: "#32363A" }}>Delivery Method</label>
            <div className="flex flex-wrap gap-2">{["📧 Email", "📱 WhatsApp", "📮 Hard Copy", "🖥️ Portal"].map((m) => (
              <label key={m} className="flex items-center gap-1.5 text-xs"><input type="checkbox" defaultChecked={m.includes("Email")} className="accent-[#0070F2] rounded" />{m}</label>
            ))}</div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Send To <span className="text-red-500">*</span></label>
            <input value={formData.sendToEmail as string} onChange={(e) => updateField("sendToEmail", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>CC</label>
            <input value={formData.ccEmail as string} onChange={(e) => updateField("ccEmail", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div className="flex gap-2"><button className="px-3 py-2 rounded border text-xs font-medium" style={{ borderColor: "#0070F2", color: "#0070F2" }}>Preview Email</button>
            <button className="px-3 py-2 rounded text-xs font-medium text-white" style={{ background: "#0070F2" }}>Send Now</button></div>
        </div>
        <div className="space-y-3">
          <div><label className="block text-xs font-medium mb-2" style={{ color: "#32363A" }}>Attachments to include</label>
            <div className="space-y-1.5">{["✅ Invoice PDF", "☐ B/L Copy", "☐ Packing List", "☐ Commercial Invoice", "☐ Other"].map((a) => (
              <label key={a} className="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" defaultChecked={a.startsWith("✅")} className="accent-[#0070F2] rounded" />{a.replace("✅ ", "").replace("☐ ", "")}</label>
            ))}</div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Delivery Status</label>
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "#F5F6F7", color: "#6A6D70" }}>⏳ Not Sent</span></div>
        </div>
      </div>
    </div>
  );
}
