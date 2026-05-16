"use client";

interface Props {
  formData: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
}

export function TermsSection({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
          Terms & Conditions
        </h3>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left */}
        <div className="space-y-3">
          <FieldGroup label="Payment Terms">
            <select
              value={formData.paymentTerms as string}
              onChange={(e) => updateField("paymentTerms", e.target.value)}
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            >
              <option value="">-- Select --</option>
              <option value="CBS">Cash Before Shipment</option>
              <option value="NET14">NET 14 Days</option>
              <option value="NET30">NET 30 Days</option>
              <option value="NET45">NET 45 Days</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Payment Method">
            <select
              value={formData.paymentMethod as string}
              onChange={(e) => updateField("paymentMethod", e.target.value)}
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            >
              <option value="">-- Select --</option>
              <option value="transfer">Bank Transfer</option>
              <option value="giro">Giro</option>
              <option value="va">Virtual Account</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Kurs Reference">
            <div className="flex gap-2">
              <select
                value={formData.kursReference as string}
                onChange={(e) => updateField("kursReference", e.target.value)}
                className="flex-1 px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
                style={{ borderColor: "#D1D2D4" }}
              >
                <option value="">-- Select --</option>
                <option value="bi_tengah">BI Tengah</option>
                <option value="bumn">BUMN</option>
                <option value="custom">Custom</option>
              </select>
              {formData.kursReference === "custom" && (
                <input
                  type="number"
                  value={formData.kursCustom as string}
                  onChange={(e) => updateField("kursCustom", e.target.value)}
                  placeholder="Rp"
                  className="w-32 px-3 py-2 rounded border text-sm"
                  style={{ borderColor: "#D1D2D4" }}
                />
              )}
            </div>
          </FieldGroup>

          <FieldGroup label="Rate Validity (days)">
            <input
              type="number"
              value={formData.rateValidity as string}
              onChange={(e) => updateField("rateValidity", e.target.value)}
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>
        </div>

        {/* Right */}
        <div className="space-y-3">
          <FieldGroup label="Exclusions">
            <textarea
              rows={4}
              value={formData.exclusions as string}
              onChange={(e) => updateField("exclusions", e.target.value)}
              placeholder="Bea Masuk, PDRI, PNBP, Detention/Demurrage, dll"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none resize-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>

          <FieldGroup label="Special Notes / Remarks">
            <textarea
              rows={4}
              value={formData.remarks as string}
              onChange={(e) => updateField("remarks", e.target.value)}
              placeholder="Catatan khusus untuk pelanggan"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none resize-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label}</label>
      {children}
    </div>
  );
}
