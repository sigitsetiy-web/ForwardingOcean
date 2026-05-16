"use client";
import { Save, Send, CheckCircle, Truck, ArrowLeft } from "lucide-react";

const costItems = [
  { item: "BBM / Solar", amount: "850000", receipt: "✅", notes: "45 liter × Rp 18.900" },
  { item: "Tol / E-Toll", amount: "125000", receipt: "✅", notes: "Semarang - Sukoharjo PP" },
  { item: "Uang Jalan / Driver Allowance", amount: "200000", receipt: "—", notes: "Standard rate" },
  { item: "Parkir", amount: "25000", receipt: "✅", notes: "" },
  { item: "Retribusi", amount: "0", receipt: "—", notes: "" },
  { item: "Biaya Muatan / Porter", amount: "150000", receipt: "✅", notes: "4 orang × Rp 37.500" },
  { item: "Overtime Driver", amount: "0", receipt: "—", notes: "" },
  { item: "Lainnya", amount: "0", receipt: "—", notes: "" },
];

function fmt(n: number) { return new Intl.NumberFormat("id-ID").format(n); }

interface Props { user: { name?: string } | null; onBack: () => void; }

export function APInternalFleet({ user, onBack }: Props) {
  const totalCost = costItems.reduce((s, c) => s + Number(c.amount), 0);
  const kasbon = 1500000;
  const selisih = kasbon - totalCost;

  return (
    <div className="min-h-screen" style={{ background: "#F5F6F7" }}>
      <div className="px-6 py-3 flex items-center justify-between text-sm">
        <div style={{ color: "#6A6D70" }}>
          <span className="hover:text-[#0070F2] cursor-pointer">Home</span><span className="mx-2">›</span>
          <span className="hover:text-[#0070F2] cursor-pointer">Purchasing</span><span className="mx-2">›</span>
          <span style={{ color: "#32363A" }} className="font-medium">Internal Fleet Cost Entry</span>
        </div>
        <button onClick={onBack} className="text-xs px-2 py-1 rounded border" style={{ borderColor: "#D1D2D4", color: "#6A6D70" }}>← Change Type</button>
      </div>

      <div className="px-6 pb-24 max-w-[1440px] mx-auto space-y-5">
        {/* Header */}
        <div className="rounded-lg p-6 text-white" style={{ background: "#003B62", borderLeft: "4px solid #E9730C" }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">🚛 BIAYA ARMADA INTERNAL</h1>
              <p className="text-white/70 font-mono text-sm mt-0.5">ICE-2025-XXXX</p>
              <div className="flex items-center gap-3 mt-2">
                <div><label className="text-[10px] text-white/50">Entry Date</label><input type="date" defaultValue="2025-05-16" className="block mt-0.5 px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-white" /></div>
                <div><label className="text-[10px] text-white/50">Status</label><div className="mt-0.5 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#E9730C" }}>DRAFT</div></div>
              </div>
            </div>
            <div className="text-right text-xs text-white/60">
              <p>Ref. JO: <a href="#" className="text-white underline font-mono">JO-2025-0112</a></p>
              <div className="mt-2 px-3 py-1 rounded text-[10px] font-medium inline-block" style={{ background: "#E9730C", color: "#fff" }}>INTERNAL — NO AP</div>
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #E9730C" }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>🚛 Trucking Assignment</h3></div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Truck Plate <span className="text-red-500">*</span></label><input defaultValue="B 1234 XY" className="w-full px-3 py-2 rounded border text-sm font-mono" style={{ borderColor: "#D1D2D4" }} /></div>
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Driver <span className="text-red-500">*</span></label><input defaultValue="Ahmad Supriyadi" className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }} /></div>
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Trip Type</label><div className="flex gap-2">{["Post-clearance", "Pre-shipment", "Empty Return"].map((t, i) => (
              <span key={t} className={`px-2 py-1 rounded text-[10px] font-medium border ${i === 0 ? "text-white" : ""}`} style={i === 0 ? { background: "#E9730C", borderColor: "#E9730C" } : { borderColor: "#D1D2D4", color: "#32363A" }}>{t}</span>
            ))}</div></div>
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Route</label><input defaultValue="Tanjung Emas → Gudang Sritex Sukoharjo" className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }} /></div>
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Trip Date</label><input type="date" defaultValue="2025-05-16" className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: "#D1D2D4" }} /></div>
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Container</label><input defaultValue="EGHU1234567 (40'HC)" readOnly className="w-full px-3 py-2 rounded border text-sm bg-gray-50" style={{ borderColor: "#D1D2D4" }} /></div>
          </div>
        </div>

        {/* Cost Components */}
        <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #E9730C" }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>💰 Cost Components</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm"><thead><tr style={{ background: "#F5F6F7" }}>
              <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Cost Item</th>
              <th className="px-3 py-2 text-right text-xs w-32" style={{ color: "#6A6D70" }}>Amount (IDR)</th>
              <th className="px-3 py-2 text-center text-xs w-16" style={{ color: "#6A6D70" }}>Receipt</th>
              <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Notes</th>
            </tr></thead><tbody>
              {costItems.map((c, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
                  <td className="px-3 py-2.5 font-medium" style={{ color: "#32363A" }}>{c.item}</td>
                  <td className="px-3 py-2.5 text-right"><input defaultValue={c.amount} className="w-full px-2 py-1 rounded border text-sm text-right font-mono" style={{ borderColor: "#D1D2D4" }} /></td>
                  <td className="px-3 py-2.5 text-center">{c.receipt}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: "#6A6D70" }}>{c.notes}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
          <div className="border-t p-5" style={{ borderColor: "#D1D2D4" }}>
            <div className="flex justify-end"><div className="w-72 space-y-1.5">
              <div className="flex justify-between items-center rounded-lg px-4 py-3" style={{ background: "#E9730C" }}>
                <span className="text-white font-bold text-sm">Total Internal Cost</span><span className="text-white text-lg font-bold font-mono">Rp {fmt(totalCost)}</span>
              </div>
            </div></div>
          </div>
        </div>

        {/* Driver Expense Claim */}
        <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #E9730C" }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>💵 Driver Expense Claim (Kasbon)</h3></div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Cash Advance (Kasbon)</label><div className="px-3 py-2 rounded border text-sm font-mono" style={{ borderColor: "#D1D2D4" }}>Rp {fmt(kasbon)}</div></div>
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Total Actual</label><div className="px-3 py-2 rounded border text-sm font-mono" style={{ borderColor: "#D1D2D4" }}>Rp {fmt(totalCost)}</div></div>
            <div><label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>Selisih</label>
              <div className="px-3 py-2 rounded border text-sm font-mono font-bold" style={{ borderColor: "#D1D2D4", color: selisih > 0 ? "#107E3E" : "#BB0000" }}>
                {selisih > 0 ? `Sisa dikembalikan: Rp ${fmt(selisih)}` : `Kurang, reimburse: Rp ${fmt(Math.abs(selisih))}`}
              </div></div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50" style={{ borderColor: "#D1D2D4" }}>
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-end gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium" style={{ background: "transparent", color: "#32363A", border: "1px solid #D1D2D4" }}><Save className="h-4 w-4" />Save Draft</button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium" style={{ background: "transparent", color: "#0070F2", border: "1px solid #0070F2" }}><Send className="h-4 w-4" />Submit for Approval</button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white" style={{ background: "#E9730C" }}><Truck className="h-4 w-4" />Post to Fleet Module</button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white" style={{ background: "#107E3E" }}><CheckCircle className="h-4 w-4" />Settle Kasbon</button>
        </div>
      </div>
    </div>
  );
}
