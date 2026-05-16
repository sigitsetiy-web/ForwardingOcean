"use client";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function JOShipmentSection({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #0070F2" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🗺️ Shipment Route & Details</h3>
      </div>
      <div className="p-5 space-y-5">
        {/* Route */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Carrier / Shipping Line 🔍 <span className="text-red-500">*</span></label><input value={formData.carrier as string} readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Vessel Name <span className="text-red-500">*</span></label><input value={formData.vesselName as string} onChange={(e) => updateField("vesselName", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Voyage No.</label><input value={formData.voyageNo as string} onChange={(e) => updateField("voyageNo", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>POL 🔒</label><input value={formData.pol as string} readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>POD 🔒</label><input value={formData.pod as string} readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Place of Delivery</label><input value={formData.placeOfDelivery as string} onChange={(e) => updateField("placeOfDelivery", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>ETD <span className="text-red-500">*</span></label><input type="datetime-local" value={formData.etd as string} onChange={(e) => updateField("etd", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>ETA <span className="text-red-500">*</span></label><input type="datetime-local" value={formData.eta as string} onChange={(e) => updateField("eta", e.target.value)} className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Transit Time</label><div className="px-3 py-2 rounded border text-sm bg-gray-50 font-medium" style={{ borderColor: "#D1D2D4" }}>± 14 days</div></div>
        </div>

        {/* Container Table */}
        <div>
          <h4 className="text-xs font-bold uppercase mb-2" style={{ color: "#003B62" }}>Container & Cargo Details</h4>
          <table className="w-full text-sm border rounded" style={{ borderColor: "#D1D2D4" }}>
            <thead><tr style={{ background: "#F5F6F7" }}>
              <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>#</th>
              <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Container No.</th>
              <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Seal No.</th>
              <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Size</th>
              <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Type</th>
              <th className="px-3 py-2 text-right text-xs font-medium" style={{ color: "#6A6D70" }}>Gross Wt (KG)</th>
              <th className="px-3 py-2 text-right text-xs font-medium" style={{ color: "#6A6D70" }}>CBM</th>
              <th className="px-3 py-2 text-center text-xs font-medium" style={{ color: "#6A6D70" }}>Status</th>
            </tr></thead>
            <tbody>
              <tr className="border-t" style={{ borderColor: "#D1D2D4" }}>
                <td className="px-3 py-2">1</td><td className="px-3 py-2 font-mono">EGHU1234567</td><td className="px-3 py-2 font-mono">SL001234</td>
                <td className="px-3 py-2">40'HC</td><td className="px-3 py-2">Dry</td><td className="px-3 py-2 text-right">6,250</td><td className="px-3 py-2 text-right">22.8</td>
                <td className="px-3 py-2 text-center"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#E8F4FD", color: "#0070F2" }}>Loaded</span></td>
              </tr>
              <tr className="border-t" style={{ borderColor: "#D1D2D4" }}>
                <td className="px-3 py-2">2</td><td className="px-3 py-2 font-mono">EGHU7654321</td><td className="px-3 py-2 font-mono">SL005678</td>
                <td className="px-3 py-2">40'HC</td><td className="px-3 py-2">Dry</td><td className="px-3 py-2 text-right">6,250</td><td className="px-3 py-2 text-right">22.7</td>
                <td className="px-3 py-2 text-center"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#E8F4FD", color: "#0070F2" }}>Loaded</span></td>
              </tr>
            </tbody>
          </table>
          <button className="mt-2 text-xs font-medium px-3 py-1.5 rounded border border-dashed" style={{ borderColor: "#0070F2", color: "#0070F2" }}>+ Add Container</button>
          <div className="mt-3 flex gap-4 text-xs" style={{ color: "#6A6D70" }}>
            <span>Total: <b>2 containers</b></span><span>Gross: <b>12,500 KG</b></span><span>Volume: <b>45.5 CBM</b></span><span>Packages: <b>120 Pallets</b></span>
          </div>
        </div>

        {/* Commodity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Commodity 🔒</label><textarea rows={2} value={formData.commodity as string} readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50 resize-none" style={{ borderColor: "#D1D2D4" }} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>HS Code 🔒</label><input value={formData.hsCode as string} readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }} /></div>
          <div className="md:col-span-3"><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Marks & Numbers</label><textarea rows={2} value={formData.marksNumbers as string} onChange={(e) => updateField("marksNumbers", e.target.value)} className="w-full px-3 py-2 rounded border text-sm font-mono resize-none focus:ring-2 focus:ring-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} /></div>
        </div>
      </div>
    </div>
  );
}
