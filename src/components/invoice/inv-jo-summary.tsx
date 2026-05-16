"use client";
import { useState } from "react";

const invoices = [
  { no: "INV-2025-0120", party: "PT Sritex", country: "🇮🇩 ID", currency: "IDR", amount: "35.000.000", equiv: "35.000.000", ppn: "3.850.000", status: "paid", statusColor: "#107E3E", due: "26 May", outstanding: "0" },
  { no: "INV-2025-0121", party: "Shanghai Cargo Agent", country: "🇨🇳 CN", currency: "USD", amount: "450", equiv: "7.200.000", ppn: "N/A (0%)", status: "draft", statusColor: "#6A6D70", due: "01 Jun", outstanding: "$450" },
  { no: "INV-2025-0122", party: "Trading House Pte Ltd", country: "🇸🇬 SG", currency: "USD", amount: "200", equiv: "3.200.000", ppn: "N/A (0%)", status: "overdue", statusColor: "#BB0000", due: "10 May", outstanding: "$200" },
];

export function InvJOSummary() {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #107E3E" }}>
      <button onClick={() => setOpen(!open)} className="w-full px-5 py-3 flex items-center justify-between text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
        <span>📊 Semua Invoice untuk JO-2025-0112</span><span>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: "#D1D2D4" }}>
          <p className="text-xs mt-3 mb-3" style={{ color: "#6A6D70" }}>Ringkasan seluruh tagihan yang timbul dari Job Order ini</p>
          <table className="w-full text-sm"><thead><tr style={{ background: "#F5F6F7" }}>
            <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Invoice</th>
            <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Billing Party</th>
            <th className="px-3 py-2 text-center text-xs" style={{ color: "#6A6D70" }}>Country</th>
            <th className="px-3 py-2 text-right text-xs" style={{ color: "#6A6D70" }}>Amount</th>
            <th className="px-3 py-2 text-right text-xs" style={{ color: "#6A6D70" }}>Equiv IDR</th>
            <th className="px-3 py-2 text-center text-xs" style={{ color: "#6A6D70" }}>Status</th>
            <th className="px-3 py-2 text-right text-xs" style={{ color: "#6A6D70" }}>Outstanding</th>
          </tr></thead><tbody>
            {invoices.map((inv, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
                <td className="px-3 py-2 font-mono text-xs font-medium" style={{ color: "#0070F2" }}>{inv.no}</td>
                <td className="px-3 py-2 text-xs">{inv.party}</td>
                <td className="px-3 py-2 text-center text-xs">{inv.country}</td>
                <td className="px-3 py-2 text-right font-mono text-xs">{inv.currency} {inv.amount}</td>
                <td className="px-3 py-2 text-right font-mono text-xs">Rp {inv.equiv}</td>
                <td className="px-3 py-2 text-center"><span className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white" style={{ background: inv.statusColor }}>{inv.status === "paid" ? "✅ Paid" : inv.status === "draft" ? "⏳ Draft" : "❌ Overdue"}</span></td>
                <td className="px-3 py-2 text-right font-mono text-xs font-medium" style={{ color: inv.outstanding === "0" ? "#107E3E" : "#BB0000" }}>{inv.outstanding === "0" ? "Rp 0" : inv.outstanding}</td>
              </tr>
            ))}
          </tbody></table>
          {/* Footer */}
          <div className="mt-4 p-4 rounded-lg" style={{ background: "#F5F6F7" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Total Revenue</p><p className="text-sm font-bold font-mono">Rp 45.400.000</p></div>
              <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Total Cost</p><p className="text-sm font-bold font-mono">Rp 38.000.000</p></div>
              <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Gross Profit</p><p className="text-sm font-bold font-mono" style={{ color: "#107E3E" }}>Rp 7.400.000</p></div>
              <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Margin</p><p className="text-sm font-bold" style={{ color: "#107E3E" }}>16.3%</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
