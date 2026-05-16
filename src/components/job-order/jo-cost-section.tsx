"use client";

const costs = [
  { desc: "Ocean Freight — Evergreen", cat: "Freight", vendor: "Evergreen", budget: 50000000, actual: 50000000 },
  { desc: "THC Origin", cat: "Origin", vendor: "Evergreen", budget: 7000000, actual: 7000000 },
  { desc: "B/L Fee + Doc Fee", cat: "Origin", vendor: "Evergreen", budget: 1500000, actual: 1500000 },
  { desc: "THC Destination", cat: "Destination", vendor: "Pelindo", budget: 8400000, actual: 0 },
  { desc: "D/O Fee", cat: "Destination", vendor: "Evergreen", budget: 750000, actual: 0 },
  { desc: "Custom Clearance (PPJK)", cat: "Customs", vendor: "PT Samudera", budget: 5000000, actual: 5000000 },
  { desc: "PNBP", cat: "Customs", vendor: "Bea Cukai", budget: 500000, actual: 500000 },
  { desc: "Trucking Pre-shipment", cat: "Trucking", vendor: "PT Jaya Trucking", budget: 9000000, actual: 9000000 },
  { desc: "Trucking Post-clearance", cat: "Trucking", vendor: "PT Trans Jaya", budget: 4500000, actual: 0 },
  { desc: "Insurance", cat: "Other", vendor: "Asuransi Jasindo", budget: 2500000, actual: 2500000 },
];

function fmt(n: number) { return new Intl.NumberFormat("id-ID").format(n); }

export function JOCostSection() {
  const totalBudget = costs.reduce((s, c) => s + c.budget, 0);
  const totalActual = costs.reduce((s, c) => s + c.actual, 0);
  const revenue = 95850000;
  const profit = revenue - totalActual;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #0070F2" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>💹 Cost Monitoring — Actual vs Budget</h3>
        <p className="text-xs mt-0.5" style={{ color: "#6A6D70" }}>Pantau realisasi biaya vs penawaran untuk hitung profitabilitas JO</p>
      </div>
      <div className="mx-5 mt-4 px-4 py-2 rounded-md flex items-center gap-2 text-xs" style={{ background: "#FFF3E0", color: "#E9730C" }}>
        ⚠ Kolom Budget diambil dari SO. Input Actual setelah biaya terkonfirmasi dari vendor.
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-sm">
          <thead><tr style={{ background: "#F5F6F7" }}>
            <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Description</th>
            <th className="px-3 py-2 text-left text-xs w-20" style={{ color: "#6A6D70" }}>Category</th>
            <th className="px-3 py-2 text-left text-xs w-28" style={{ color: "#6A6D70" }}>Vendor</th>
            <th className="px-3 py-2 text-right text-xs w-28" style={{ color: "#6A6D70" }}>Budget</th>
            <th className="px-3 py-2 text-right text-xs w-28" style={{ color: "#6A6D70" }}>Actual</th>
            <th className="px-3 py-2 text-right text-xs w-24" style={{ color: "#6A6D70" }}>Variance</th>
          </tr></thead>
          <tbody>
            {costs.map((c, i) => {
              const variance = c.budget - c.actual;
              return (
                <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
                  <td className="px-3 py-2 font-medium" style={{ color: "#32363A" }}>{c.desc}</td>
                  <td className="px-3 py-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100">{c.cat}</span></td>
                  <td className="px-3 py-2 text-xs" style={{ color: "#6A6D70" }}>{c.vendor}</td>
                  <td className="px-3 py-2 text-right font-mono text-xs">{fmt(c.budget)}</td>
                  <td className="px-3 py-2 text-right font-mono text-xs font-medium">{c.actual > 0 ? fmt(c.actual) : "—"}</td>
                  <td className="px-3 py-2 text-right font-mono text-xs" style={{ color: variance === 0 ? "#6A6D70" : variance > 0 ? "#107E3E" : "#BB0000" }}>{variance !== 0 ? fmt(variance) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Summary */}
      <div className="border-t p-5" style={{ borderColor: "#D1D2D4" }}>
        <div className="flex justify-end">
          <div className="w-80 space-y-1.5 text-sm">
            <div className="flex justify-between"><span style={{ color: "#6A6D70" }}>Total Budget</span><span className="font-mono">{fmt(totalBudget)}</span></div>
            <div className="flex justify-between"><span style={{ color: "#6A6D70" }}>Total Actual</span><span className="font-mono font-medium">{fmt(totalActual)}</span></div>
            <div className="flex justify-between border-t pt-1.5" style={{ borderColor: "#D1D2D4" }}><span style={{ color: "#6A6D70" }}>Revenue (from SO)</span><span className="font-mono">{fmt(revenue)}</span></div>
            <div className="flex justify-between"><span className="font-bold" style={{ color: "#003B62" }}>Gross Profit</span><span className="font-mono font-bold" style={{ color: profit > 0 ? "#107E3E" : "#BB0000" }}>{fmt(profit)}</span></div>
            <div className="flex justify-between"><span style={{ color: "#6A6D70" }}>Margin</span><span className="font-bold" style={{ color: margin > 15 ? "#107E3E" : margin > 5 ? "#E9730C" : "#BB0000" }}>{margin.toFixed(1)}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
