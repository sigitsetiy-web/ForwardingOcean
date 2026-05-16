"use client";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function InvPaymentTerms({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #107E3E" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🏦 Payment Terms & Instructions</h3>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Payment Terms <span className="text-red-500">*</span></label>
            <select value={formData.paymentTerms as string} onChange={(e) => updateField("paymentTerms", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }}>
              <option value="CBS">Cash Before Shipment</option><option value="NET14">NET 14</option><option value="NET30">NET 30</option><option value="NET45">NET 45</option>
            </select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Due Date</label>
            <div className="px-3 py-2 rounded border text-sm bg-gray-50 font-medium" style={{ borderColor: "#D1D2D4", color: "#32363A" }}>{formData.dueDate as string} <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ background: "#E6F4EA", color: "#107E3E" }}>30 days</span></div></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Payment Method</label>
            <div className="flex flex-wrap gap-2">{["TT (Telegraphic Transfer)", "Transfer Bank", "L/C"].map((m) => (
              <label key={m} className="flex items-center gap-1.5 text-xs"><input type="checkbox" defaultChecked={m.includes("TT")} className="accent-[#0070F2] rounded" />{m}</label>
            ))}</div></div>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-lg" style={{ background: "#F5F6F7" }}>
            <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "#6A6D70" }}>Beneficiary Bank Details</p>
            <div className="space-y-1 text-xs" style={{ color: "#32363A" }}>
              <p><span style={{ color: "#6A6D70" }}>Bank:</span> {formData.bankName as string}</p>
              <p><span style={{ color: "#6A6D70" }}>Account:</span> {formData.accountName as string}</p>
              <p><span style={{ color: "#6A6D70" }}>No:</span> <span className="font-mono">{formData.accountNumber as string}</span></p>
              <p><span style={{ color: "#6A6D70" }}>SWIFT:</span> <span className="font-mono">{formData.swiftCode as string}</span></p>
            </div>
          </div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Remittance Instruction</label>
            <textarea rows={2} value={formData.remittanceInstruction as string} readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50 resize-none" style={{ borderColor: "#D1D2D4" }} /></div>
        </div>
      </div>
    </div>
  );
}
