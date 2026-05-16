"use client";

interface Props {
  formData: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
}

export function SignatureSection({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
          Signature & Approval
        </h3>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Prepared By */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase" style={{ color: "#6A6D70" }}>Prepared By</p>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Name</label>
            <input
              value={formData.preparedBy as string}
              onChange={(e) => updateField("preparedBy", e.target.value)}
              placeholder="Nama pembuat"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Position</label>
            <input
              value={formData.preparedPosition as string}
              onChange={(e) => updateField("preparedPosition", e.target.value)}
              placeholder="Jabatan"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Signature</label>
            <div
              className="h-24 rounded border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: "#D1D2D4" }}
            >
              <span className="text-xs" style={{ color: "#6A6D70" }}>Signature Area</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Date</label>
            <input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              readOnly
              className="w-full px-3 py-2 rounded border text-sm bg-gray-50"
              style={{ borderColor: "#D1D2D4" }}
            />
          </div>
        </div>

        {/* Approved By / Customer */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase" style={{ color: "#6A6D70" }}>Approved By / Customer Acceptance</p>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Name</label>
            <input
              placeholder="Nama penerima"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Position / Company</label>
            <input
              placeholder="Jabatan / Perusahaan"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Signature & Company Stamp</label>
            <div
              className="h-24 rounded border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: "#D1D2D4" }}
            >
              <span className="text-xs" style={{ color: "#6A6D70" }}>Signature & Stamp Area</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
