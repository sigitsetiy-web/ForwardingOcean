"use client";

const legs = [
  { leg: "Empty Pickup (Depo → Stuffing)", vendor: "PT Jaya Trucking", driver: "Pak Slamet", truck: "B 1234 XYZ", from: "Depo Evergreen Marunda", to: "Gudang Sritex Sukoharjo", scheduled: "16 May 08:00", status: "Completed" },
  { leg: "Stuffing → CY Gate-In", vendor: "PT Jaya Trucking", driver: "Pak Slamet", truck: "B 1234 XYZ", from: "Gudang Sritex", to: "JICT Tanjung Priok", scheduled: "17 May 06:00", status: "Scheduled" },
  { leg: "Port → Consignee (Post-clearance)", vendor: "PT Trans Jaya", driver: "TBD", truck: "TBD", from: "Tanjung Emas Semarang", to: "Gudang Sritex Sukoharjo", scheduled: "TBD", status: "Pending" },
];

export function JOTruckingSection() {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #0070F2" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🚛 Trucking & Inland Transport</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr style={{ background: "#F5F6F7" }}>
            <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Trucking Leg</th>
            <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Vendor</th>
            <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Driver / Truck</th>
            <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Route</th>
            <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Schedule</th>
            <th className="px-3 py-2 text-center text-xs font-medium" style={{ color: "#6A6D70" }}>Status</th>
          </tr></thead>
          <tbody>
            {legs.map((l, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
                <td className="px-3 py-2.5 font-medium" style={{ color: "#32363A" }}>{l.leg}</td>
                <td className="px-3 py-2.5 text-xs">{l.vendor}</td>
                <td className="px-3 py-2.5 text-xs">{l.driver}<br/><span className="font-mono">{l.truck}</span></td>
                <td className="px-3 py-2.5 text-xs">{l.from} → {l.to}</td>
                <td className="px-3 py-2.5 text-xs">{l.scheduled}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: l.status === "Completed" ? "#E6F4EA" : l.status === "Scheduled" ? "#E8F4FD" : "#F5F6F7", color: l.status === "Completed" ? "#107E3E" : l.status === "Scheduled" ? "#0070F2" : "#6A6D70" }}>{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t" style={{ borderColor: "#D1D2D4" }}>
        <button className="text-xs font-medium px-3 py-1.5 rounded border border-dashed" style={{ borderColor: "#0070F2", color: "#0070F2" }}>+ Add Trucking Order</button>
      </div>
    </div>
  );
}
