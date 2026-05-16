"use client";

const kpis = [
  { icon: "📦", label: "Total JO Aktif", value: "24", sub: "Bulan ini", trend: "▲ +3", trendColor: "#107E3E" },
  { icon: "✅", label: "On Track", value: "18", sub: "Sesuai jadwal", bar: 75, barColor: "#107E3E" },
  { icon: "⚠️", label: "Delayed / At Risk", value: "4", sub: "Perlu perhatian", trend: "", trendColor: "#E9730C" },
  { icon: "🛃", label: "Customs Hold", value: "2", sub: "Tertahan bea cukai", pulse: true },
  { icon: "🚢", label: "Departed", value: "8", sub: "ETA terdekat: 17 May", trend: "", trendColor: "#0F828F" },
  { icon: "💰", label: "Revenue (Month)", value: "Rp 485 Jt", sub: "vs target Rp 500 Jt", bar: 97, barColor: "#107E3E" },
  { icon: "📥", label: "Outstanding AR", value: "Rp 127 Jt", sub: "3 invoice overdue 🔴", trend: "", trendColor: "#E9730C" },
  { icon: "📤", label: "Outstanding AP", value: "Rp 89 Jt", sub: "2 AP due today ⚠️", trend: "", trendColor: "#BB0000" },
];

export function CCKpiStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="bg-white rounded-lg border p-3 hover:shadow-md hover:border-[#0070F2] transition-all cursor-pointer" style={{ borderColor: "#D1D2D4" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">{kpi.icon}</span>
            {kpi.pulse && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
          </div>
          <p className="text-xl font-bold" style={{ color: "#32363A" }}>{kpi.value}</p>
          <p className="text-[10px] font-medium" style={{ color: "#6A6D70" }}>{kpi.label}</p>
          <p className="text-[9px] mt-0.5" style={{ color: "#6A6D70" }}>{kpi.sub}</p>
          {kpi.trend && <p className="text-[10px] font-medium mt-1" style={{ color: kpi.trendColor }}>{kpi.trend}</p>}
          {kpi.bar && (
            <div className="mt-1.5 h-1 rounded-full bg-gray-200"><div className="h-1 rounded-full" style={{ width: `${kpi.bar}%`, background: kpi.barColor }} /></div>
          )}
        </div>
      ))}
    </div>
  );
}
