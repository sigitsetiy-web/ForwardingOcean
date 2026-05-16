"use client";
import { Plus } from "lucide-react";

interface Item { description: string; category: string; uom: string; qty: number; rate: number; ppn: boolean; notes: string; }
interface Props { items: Item[]; currency: string; }

function fmt(n: number, c: string) { return c === "IDR" ? new Intl.NumberFormat("id-ID").format(n) : n.toLocaleString("en-US", { minimumFractionDigits: 2 }); }

export function InvLineItems({ items, currency }: Props) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const ppnAmt = 0; // Overseas = 0% PPN
  const total = subtotal + ppnAmt;

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #107E3E" }}>
      <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "#D1D2D4" }}>
        <div><h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>💰 Invoice Line Items</h3>
          <p className="text-xs mt-0.5" style={{ color: "#6A6D70" }}>Rincian biaya yang ditagihkan kepada billing party ini</p></div>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded border text-xs font-medium" style={{ borderColor: "#0070F2", color: "#0070F2" }}>Import from JO</button>
      </div>
      <div className="mx-5 mt-4 px-4 py-2 rounded-md flex items-center gap-2 text-xs" style={{ background: "#E6F4EA", color: "#107E3E" }}>
        ✅ Items dapat dipilih dari daftar charges di JO, atau ditambahkan manual sesuai kesepakatan.
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-sm">
          <thead><tr style={{ background: "#F5F6F7" }}>
            <th className="px-3 py-2 text-left text-xs w-8" style={{ color: "#6A6D70" }}>#</th>
            <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Description</th>
            <th className="px-3 py-2 text-left text-xs w-28" style={{ color: "#6A6D70" }}>Category</th>
            <th className="px-3 py-2 text-left text-xs w-24" style={{ color: "#6A6D70" }}>UoM</th>
            <th className="px-3 py-2 text-center text-xs w-12" style={{ color: "#6A6D70" }}>Qty</th>
            <th className="px-3 py-2 text-right text-xs w-24" style={{ color: "#6A6D70" }}>Rate</th>
            <th className="px-3 py-2 text-right text-xs w-28" style={{ color: "#6A6D70" }}>Amount</th>
            <th className="px-3 py-2 text-center text-xs w-12" style={{ color: "#6A6D70" }}>PPN</th>
            <th className="px-3 py-2 text-left text-xs w-24" style={{ color: "#6A6D70" }}>Notes</th>
          </tr></thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
                <td className="px-3 py-2.5 text-center" style={{ color: "#6A6D70" }}>{i + 1}</td>
                <td className="px-3 py-2.5 font-medium" style={{ color: "#32363A" }}>{item.description}</td>
                <td className="px-3 py-2.5"><span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100">{item.category}</span></td>
                <td className="px-3 py-2.5 text-xs" style={{ color: "#6A6D70" }}>{item.uom}</td>
                <td className="px-3 py-2.5 text-center">{item.qty}</td>
                <td className="px-3 py-2.5 text-right font-mono">{fmt(item.rate, currency)}</td>
                <td className="px-3 py-2.5 text-right font-mono font-medium">{fmt(item.qty * item.rate, currency)}</td>
                <td className="px-3 py-2.5 text-center">{item.ppn ? "✅" : "—"}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: "#6A6D70" }}>{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t" style={{ borderColor: "#D1D2D4" }}>
        <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded border border-dashed" style={{ borderColor: "#0070F2", color: "#0070F2" }}><Plus className="h-3 w-3" />Add Line Item</button>
      </div>
      {/* Totals */}
      <div className="border-t p-5" style={{ borderColor: "#D1D2D4" }}>
        <div className="flex justify-end">
          <div className="w-80 space-y-1.5 text-sm">
            <div className="flex justify-between"><span style={{ color: "#6A6D70" }}>Subtotal</span><span className="font-mono">{currency} {fmt(subtotal, currency)}</span></div>
            <div className="flex justify-between"><span style={{ color: "#6A6D70" }}>PPN 0% (Ekspor Jasa)</span><span className="font-mono">{currency} 0</span></div>
            <div className="flex justify-between items-center pt-3 mt-2 rounded-lg px-4 py-3" style={{ background: "#107E3E" }}>
              <span className="text-white font-bold">GRAND TOTAL</span>
              <span className="text-white text-xl font-bold font-mono">{currency} {fmt(total, currency)}</span>
            </div>
            <p className="text-xs italic pt-1" style={{ color: "#6A6D70" }}>Say: US Dollars Four Hundred and Fifty Only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
