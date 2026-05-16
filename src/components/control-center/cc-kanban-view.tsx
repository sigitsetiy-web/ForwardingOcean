"use client";

interface Props { onSelectJO: (id: string) => void; }

const columns = [
  { status: "OPEN", icon: "📋", color: "#6A6D70", count: 3 },
  { status: "BOOKING", icon: "📦", color: "#0070F2", count: 4 },
  { status: "CARGO READY", icon: "🏭", color: "#6B2FA0", count: 3 },
  { status: "CUSTOMS", icon: "🛃", color: "#E9730C", count: 5 },
  { status: "CLEARED", icon: "✅", color: "#0F828F", count: 2 },
  { status: "DEPARTED", icon: "🚢", color: "#0B6370", count: 4 },
  { status: "ARRIVED", icon: "🛬", color: "#1A9E5E", count: 2 },
  { status: "DELIVERED", icon: "✅", color: "#107E3E", count: 1 },
];

const joCards: Record<string, Array<{ id: string; number: string; customer: string; route: string; carrier: string; container: string; etd: string; eta: string; officer: string; priority: "critical" | "urgent" | "normal"; alerts: string[]; revenue: string; cost: string; margin: string }>> = {
  "OPEN": [
    { id: "jo-new1", number: "JO-2025-0115", customer: "PT Indo Cargo", route: "🇨🇳 Ningbo → 🇮🇩 Jakarta", carrier: "COSCO", container: "CSLU9876543", etd: "25 May", eta: "08 Jun", officer: "Zahid", priority: "normal", alerts: [], revenue: "Rp 32 Jt", cost: "Rp 25 Jt", margin: "21.9%" },
  ],
  "CUSTOMS": [
    { id: "jo-0112", number: "JO-2025-0112", customer: "PT Sritex (SRIL)", route: "🇨🇳 Shanghai → 🇮🇩 Tanjung Emas", carrier: "Evergreen", container: "EGHU1234567", etd: "01 May", eta: "15 May", officer: "Sigit", priority: "critical", alerts: ["🛃 Jalur Merah — Day 4", "⏰ Detention: 0 days left 🚨", "📋 2 doc pending"], revenue: "Rp 45.4 Jt", cost: "Rp 38 Jt", margin: "16.3%" },
    { id: "jo-0108", number: "JO-2025-0108", customer: "PT XYZ Textile", route: "🇨🇳 Qingdao → 🇮🇩 Semarang", carrier: "Maersk", container: "MSKU4567890", etd: "08 May", eta: "22 May", officer: "Titi", priority: "urgent", alerts: ["⏰ Cut-off SI: Besok"], revenue: "Rp 28 Jt", cost: "Rp 22 Jt", margin: "21.4%" },
  ],
  "DEPARTED": [
    { id: "jo-0105", number: "JO-2025-0105", customer: "CV Sentosa", route: "🇮🇩 Jakarta → 🇯🇵 Tokyo", carrier: "NYK", container: "NYKU1122334", etd: "10 May", eta: "20 May", officer: "Asna", priority: "normal", alerts: [], revenue: "Rp 52 Jt", cost: "Rp 40 Jt", margin: "23.1%" },
  ],
  "DELIVERED": [
    { id: "jo-0099", number: "JO-2025-0099", customer: "PT Maju Jaya", route: "🇨🇳 Shanghai → 🇮🇩 Semarang", carrier: "Evergreen", container: "EGHU9988776", etd: "25 Apr", eta: "09 May", officer: "Sigit", priority: "normal", alerts: [], revenue: "Rp 38 Jt", cost: "Rp 30 Jt", margin: "21.1%" },
  ],
};

const priorityColors = { critical: "#BB0000", urgent: "#E9730C", normal: "#107E3E" };

export function CCKanbanView({ onSelectJO }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {columns.map((col) => (
        <div key={col.status} className="min-w-[280px] max-w-[280px] flex-shrink-0">
          {/* Column Header */}
          <div className="rounded-t-lg px-3 py-2 flex items-center justify-between" style={{ borderTop: `3px solid ${col.color}`, background: "#fff" }}>
            <div className="flex items-center gap-2">
              <span>{col.icon}</span>
              <span className="text-xs font-bold" style={{ color: "#32363A" }}>{col.status}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ background: col.color }}>{col.count}</span>
          </div>
          {/* Cards */}
          <div className="space-y-2 mt-1">
            {(joCards[col.status] || []).map((jo) => (
              <div key={jo.id} onClick={() => onSelectJO(jo.id)}
                className="bg-white rounded-lg border p-3 cursor-pointer hover:shadow-lg hover:border-[#0070F2] transition-all"
                style={{ borderColor: "#D1D2D4", borderLeft: `4px solid ${priorityColors[jo.priority]}` }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-mono" style={{ color: "#32363A" }}>{jo.number}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: priorityColors[jo.priority] }} />
                </div>
                <p className="text-xs font-medium" style={{ color: "#32363A" }}>{jo.customer}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#6A6D70" }}>{jo.route}</p>
                {/* Details */}
                <div className="mt-2 space-y-0.5 text-[10px]" style={{ color: "#6A6D70" }}>
                  <p>🚢 {jo.carrier} · {jo.container.slice(0, 11)}</p>
                  <p>📅 ETD {jo.etd} · ETA {jo.eta}</p>
                  <p>👤 {jo.officer}</p>
                </div>
                {/* Alerts */}
                {jo.alerts.length > 0 && (
                  <div className="mt-2 space-y-0.5">
                    {jo.alerts.map((a, i) => (
                      <p key={i} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "#FFF3E0", color: "#E9730C" }}>{a}</p>
                    ))}
                  </div>
                )}
                {/* Financial */}
                <div className="mt-2 pt-2 border-t grid grid-cols-3 gap-1 text-[9px]" style={{ borderColor: "#D1D2D4" }}>
                  <div><p style={{ color: "#6A6D70" }}>Revenue</p><p className="font-bold" style={{ color: "#32363A" }}>{jo.revenue}</p></div>
                  <div><p style={{ color: "#6A6D70" }}>Cost</p><p className="font-bold" style={{ color: "#32363A" }}>{jo.cost}</p></div>
                  <div><p style={{ color: "#6A6D70" }}>Margin</p><p className="font-bold" style={{ color: "#107E3E" }}>{jo.margin}</p></div>
                </div>
                {/* Doc links */}
                <div className="mt-2 flex gap-1">
                  {["QT", "SO", "JO", "INV", "AP"].map((d) => (
                    <span key={d} className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ background: "#E8F4FD", color: "#0070F2" }}>{d}</span>
                  ))}
                </div>
              </div>
            ))}
            {/* Empty state for columns without cards shown */}
            {!joCards[col.status] && (
              <div className="bg-white/50 rounded-lg border border-dashed p-4 text-center" style={{ borderColor: "#D1D2D4" }}>
                <p className="text-[10px]" style={{ color: "#6A6D70" }}>{col.count} JO</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
