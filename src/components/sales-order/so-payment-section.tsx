"use client";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function SOPaymentSection({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🧾 Payment Terms & Billing</h3>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Fld label="Payment Terms" required>
            <select value={formData.paymentTerms as string} onChange={(e) => updateField("paymentTerms", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }}>
              <option value="CBS">Cash Before Shipment</option>
              <option value="NET14">NET 14 Days</option>
              <option value="NET30">NET 30 Days</option>
              <option value="NET45">NET 45 Days</option>
              <option value="PARTIAL">Partial (DP + Pelunasan)</option>
            </select>
          </Fld>
          {formData.paymentTerms === "PARTIAL" && (
            <Fld label="DP Percentage">
              <input type="number" value={formData.dpPercentage as string} onChange={(e) => updateField("dpPercentage", e.target.value)} placeholder="30" className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }} />
            </Fld>
          )}
          <Fld label="Payment Method">
            <div className="flex flex-wrap gap-2">
              {["Transfer Bank", "Giro", "Virtual Account", "Cek"].map((m) => (
                <label key={m} className="flex items-center gap-1.5 text-sm"><input type="checkbox" className="accent-[#0070F2] rounded" />{m}</label>
              ))}
            </div>
          </Fld>
          <Fld label="Bank Account Destination">
            <select className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }}>
              <option>BCA - 123-456-7890 (PT Key Ocean)</option>
              <option>Mandiri - 098-765-4321 (PT Key Ocean)</option>
            </select>
          </Fld>
        </div>
        <div className="space-y-3">
          <Fld label="Billing Trigger">
            <select value={formData.billingTrigger as string} onChange={(e) => updateField("billingTrigger", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }}>
              <option>After Booking</option>
              <option>After ETD</option>
              <option>After ETA</option>
              <option>After DO Released</option>
              <option>Custom Date</option>
            </select>
          </Fld>
          <Fld label="PO Number from Customer" required>
            <input value={formData.poNumber as string} onChange={(e) => updateField("poNumber", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} />
          </Fld>
          <Fld label="PO Date from Customer">
            <input type="date" value={formData.poDate as string} onChange={(e) => updateField("poDate", e.target.value)} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }} />
          </Fld>
          <Fld label="Billing Attention To">
            <input value={formData.billingAttention as string} onChange={(e) => updateField("billingAttention", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} />
          </Fld>
        </div>
      </div>
    </div>
  );
}

function Fld({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (<div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label} {required && <span className="text-red-500">*</span>}</label>{children}</div>);
}
