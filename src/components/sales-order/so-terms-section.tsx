"use client";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function SOTermsSection({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>📜 Terms & Conditions — Confirmed</h3>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Rate Validity Note 🔒</label>
          <div className="px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4", color: "#6A6D70" }}>Rate berlaku selama 30 hari sejak tanggal QT</div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Exclusions 🔒</label>
          <textarea rows={3} value={formData.exclusions as string} readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50 resize-none" style={{ borderColor: "#D1D2D4", color: "#6A6D70" }} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Amendment Clause</label>
          <textarea rows={2} value={formData.amendmentClause as string} onChange={(e) => updateField("amendmentClause", e.target.value)} className="w-full px-3 py-2 rounded border text-sm resize-none focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Governing Law</label>
            <div className="px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }}>Hukum Republik Indonesia</div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Dispute Resolution</label>
            <select value={formData.disputeResolution as string} onChange={(e) => updateField("disputeResolution", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }}>
              <option value="musyawarah">Musyawarah Mufakat</option>
              <option value="bani">BANI Arbitrase</option>
              <option value="pengadilan">Pengadilan Negeri Setempat</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
