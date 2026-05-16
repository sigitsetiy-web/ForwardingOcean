"use client";

interface Props { onSelectJO: (id: string) => void; }

const rows = [
  { id: "jo-0112", no: "JO-0112", customer: "PT Sritex", dir: "Import", carrier: "Evergreen", vessel: "Ever Given", etd: "01 May", eta: "15 May", status: "CUSTOMS", jalur: "🔴 Merah", officer: "Sigit", priority: "critical", revenue: 45400000, cost: 38000000, arStatus: "Partial", apStatus: "Pending", docPct: 67 },
  { id: "jo-0108", no: "JO-0108", customer: "PT XYZ", dir: "Import", carrier: "Maersk", vessel: "Maersk Seville", etd: "08 May", eta: "22 May", status: "CUSTOMS", jalur: "🟢 Hijau", officer: "Titi", priority: "urgent", revenue: 28000000, cost: 22000000, arStatus: "Draft", apStatus: "Draft", docPct: 50 },
  { id: "jo-0105", no: "JO-0105", customer: "CV Sentosa", dir: "Export", carrier: "NYK", vessel: "NYK Venus", etd: "10 May", eta: "20 May", status: "DEPARTED", jalur: "🟢 Hijau", officer: "Asna", priority: "normal", revenue: 52000000, cost: 40000000, arStatus: "Sent", apStatus: "Paid", docPct: 100 },
  { id: "jo-0101", no: "JO-0101", customer: "PT Garuda", dir: "Import", carrier: "Evergreen", vessel: "Ever Given", etd: "03 May", eta: "17 May", status: "CUSTOMS HOLD", jalur: "🔴 Merah", officer: "Ima", priority: "critical", revenue: 35000000, cost: 30000000, arStatus: "Draft", apStatus: "Pending", docPct: 33 },
  { id: "jo-0099", no: "JO-0099", customer: "PT Maju Jaya", dir: "Import", carrier: "Evergreen", vessel: "Ever Given", etd: "25 Apr", eta: "09 May", status: "DELIVERED", jalur: "🟢 Hijau", officer: "Sigit", priority: "normal", revenue: 38000000, cost: 30000000, arStatus: "Paid", apStatus: "Paid", docPct: 100 },
];

function fmt(n: number) { return `Rp ${(n / 1000000).toFixed(0)} Jt`; }
const statusColors: Record<string, string> = { "CUSTOMS": "#E9730C", "CUSTOMS HOLD": "#BB0000", "DEPARTED": "#0F828F", "DELIVERED": "#107E3E", "OPEN": "#6A6D70" };
const priorityDots: Record<string, string> = { critical: "#BB0000", urgent: "#E9730C", normal: "#107E3E" };

export function CCTableView({ onSelectJO }: Props) {
  const totalRev = rows.reduce((s, r) => s + r.revenue, 0);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const avgMargin = totalRev > 0 ? ((totalRev - totalCost) / totalRev * 100).toFixed(1) : "0";

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden" style={{ borderColor: "#D1D2D4" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr style={{ background: "#F5F6F7" }}>
            {["JO No.", "Customer", "Dir", "Carrier", "ETD", "ETA", "Status", "Jalur", "Officer", "Revenue", "Cost", "Margin", "AR", "AP", "Doc%"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold uppercase whitespace-nowrap" style={{ color: "#6A6D70" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map((r) => {
              const margin = r.revenue > 0 ? ((r.revenue - r.cost) / r.revenue * 100) : 0;
              return (
                <tr key={r.id} onClick={() => onSelectJO(r.id)} className="border-t cursor-pointer hover:bg-blue-50/50" style={{ borderColor: "#D1D2D4" }}>
                  <td className="px-3 py-2.5"><div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: priorityDots[r.priority] }} /><span className="font-mono font-bold text-xs" style={{ color: "#0070F2" }}>{r.no}</span></div></td>
                  <td className="px-3 py-2.5 text-xs font-medium">{r.customer}</td>
                  <td className="px-3 py-2.5 text-[10px]">{r.dir}</td>
                  <td className="px-3 py-2.5 text-[10px]">{r.carrier}</td>
                  <td className="px-3 py-2.5 text-[10px]">{r.etd}</td>
                  <td className="px-3 py-2.5 text-[10px]">{r.eta}</td>
                  <td className="px-3 py-2.5"><span className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white" style={{ background: statusColors[r.status] || "#6A6D70" }}>{r.status}</span></td>
                  <td className="px-3 py-2.5 text-[10px]">{r.jalur}</td>
                  <td className="px-3 py-2.5 text-[10px]">{r.officer}</td>
                  <td className="px-3 py-2.5 text-[10px] font-mono">{fmt(r.revenue)}</td>
                  <td className="px-3 py-2.5 text-[10px] font-mono">{fmt(r.cost)}</td>
                  <td className="px-3 py-2.5 text-[10px] font-bold" style={{ color: margin > 15 ? "#107E3E" : margin > 5 ? "#E9730C" : "#BB0000" }}>{margin.toFixed(1)}%</td>
                  <td className="px-3 py-2.5"><span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: r.arStatus === "Paid" ? "#E6F4EA" : "#FFF3E0", color: r.arStatus === "Paid" ? "#107E3E" : "#E9730C" }}>{r.arStatus}</span></td>
                  <td className="px-3 py-2.5"><span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: r.apStatus === "Paid" ? "#E6F4EA" : "#FFF3E0", color: r.apStatus === "Paid" ? "#107E3E" : "#E9730C" }}>{r.apStatus}</span></td>
                  <td className="px-3 py-2.5"><div className="w-12 h-1.5 rounded-full bg-gray-200"><div className="h-1.5 rounded-full" style={{ width: `${r.docPct}%`, background: r.docPct === 100 ? "#107E3E" : "#0070F2" }} /></div></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot><tr style={{ background: "#F5F6F7" }}>
            <td colSpan={9} className="px-3 py-2.5 text-xs font-bold" style={{ color: "#003B62" }}>{rows.length} Job Orders</td>
            <td className="px-3 py-2.5 text-[10px] font-mono font-bold">{fmt(totalRev)}</td>
            <td className="px-3 py-2.5 text-[10px] font-mono font-bold">{fmt(totalCost)}</td>
            <td className="px-3 py-2.5 text-[10px] font-bold" style={{ color: "#107E3E" }}>{avgMargin}%</td>
            <td colSpan={3}></td>
          </tr></tfoot>
        </table>
      </div>
    </div>
  );
}
