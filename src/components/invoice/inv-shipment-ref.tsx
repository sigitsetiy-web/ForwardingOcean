"use client";

interface Props { formData: Record<string, unknown>; }

export function InvShipmentRef({ formData }: Props) {
  const fields = [
    ["Service Type", "Sea Freight | Custom Clearance | Trucking"], ["Direction", "Import"], ["POL", "Shanghai, China 🇨🇳"],
    ["POD", "Tanjung Emas, Semarang 🇮🇩"], ["Vessel / Voyage", "Ever Given / 0112W"], ["ETD", "01 May 2025"],
    ["ETA", "15 May 2025"], ["Container", "EGHU1234567, EGHU7654321 (2x40'HC)"], ["Commodity", "Grey Fabric / Kain Mentah"],
    ["HS Code", "5208.11.00"], ["Gross Weight", "12,500 KG"], ["B/L Number", "EVGL-SHG-001234"],
  ];
  return (
    <div className="rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #107E3E", background: "#FAFBFC" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🚢 Shipment Reference — from {formData.refJO as string}</h3>
        <p className="text-xs mt-0.5" style={{ color: "#6A6D70" }}>Detail pengiriman sebagai referensi invoice — tidak dapat diubah disini</p>
      </div>
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        {fields.map(([label, value]) => (
          <div key={label}><p className="text-[10px] font-medium" style={{ color: "#6A6D70" }}>{label} 🔒</p><p className="text-xs font-medium mt-0.5" style={{ color: "#32363A" }}>{value}</p></div>
        ))}
      </div>
    </div>
  );
}
