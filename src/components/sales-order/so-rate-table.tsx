"use client";
import { AlertCircle } from "lucide-react";

interface RateItem { description: string; category: string; uom: string; qty: number; rate: number; ppn: boolean; notes: string; }
interface Props { items: RateItem[]; currency: string; }

function fmt(n: number): string { return new Intl.NumberFormat("id-ID").format(n); }
function terbilang(n: number): string {
  if (n === 0) return "Nol Rupiah";
  const units = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  const convert = (num: number): string => {
    if (num < 12) return units[num];
    if (num < 20) return convert(num - 10) + " Belas";
    if (num < 100) return convert(Math.floor(num / 10)) + " Puluh" + (num % 10 ? " " + convert(num % 10) : "");
    if (num < 200) return "Seratus" + (num - 100 ? " " + convert(num - 100) : "");
    if (num < 1000) return convert(Math.floor(num / 100)) + " Ratus" + (num % 100 ? " " + convert(num % 100) : "");
    if (num < 2000) return "Seribu" + (num - 1000 ? " " + convert(num - 1000) : "");
    if (num < 1000000) return convert(Math.floor(num / 1000)) + " Ribu" + (num % 1000 ? " " + convert(num % 1000) : "");
    if (num < 1000000000) return convert(Math.floor(num / 1000000)) + " Juta" + (num % 1000000 ? " " + convert(num % 1000000) : "");
    return convert(Math.floor(num / 1000000000)) + " Miliar" + (num % 1000000000 ? " " + convert(num % 1000000000) : "");
  };
  return convert(Math.round(n)) + " Rupiah";
}

export function SORateTable({ items, currency }: Props) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const ppnAmount = items.filter((i) => i.ppn).reduce((s, i) => s + i.qty * i.rate * 0.12, 0);
  const grandTotal = subtotal + ppnAmount;

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>💰 Confirmed Rate Details</h3>
        <p className="text-xs mt-0.5" style={{ color: "#6A6D70" }}>Harga final yang disetujui customer — linked dari Quotation</p>
      </div>
      {/* Success strip */}
      <div className="mx-5 mt-4 px-4 py-2.5 rounded-md flex items-center gap-2 text-xs" style={{ background: "#E6F4EA", color: "#107E3E" }}>
        <AlertCircle className="h-4 w-4 shrink-0" />
        Semua rate telah dikonfirmasi customer pada 10 Mei 2025
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F5F6F7" }}>
              <th className="px-3 py-2 text-left font-medium w-8" style={{ color: "#6A6D70" }}>#</th>
              <th className="px-3 py-2 text-left font-medium" style={{ color: "#6A6D70" }}>Description</th>
              <th className="px-3 py-2 text-left font-medium w-24" style={{ color: "#6A6D70" }}>Category</th>
              <th className="px-3 py-2 text-left font-medium w-28" style={{ color: "#6A6D70" }}>UoM</th>
              <th className="px-3 py-2 text-center font-medium w-12" style={{ color: "#6A6D70" }}>Qty</th>
              <th className="px-3 py-2 text-right font-medium w-32" style={{ color: "#6A6D70" }}>Rate</th>
              <th className="px-3 py-2 text-right font-medium w-32" style={{ color: "#6A6D70" }}>Amount</th>
              <th className="px-3 py-2 text-center font-medium w-12" style={{ color: "#6A6D70" }}>PPN</th>
              <th className="px-3 py-2 text-right font-medium w-36" style={{ color: "#6A6D70" }}>Total Incl.</th>
              <th className="px-3 py-2 text-left font-medium w-28" style={{ color: "#6A6D70" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const amount = item.qty * item.rate;
              const ppn = item.ppn ? amount * 0.12 : 0;
              return (
                <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
                  <td className="px-3 py-2.5 text-center" style={{ color: "#6A6D70" }}>{i + 1}</td>
                  <td className="px-3 py-2.5 font-medium" style={{ color: "#32363A" }}>{item.description}</td>
                  <td className="px-3 py-2.5"><span className="text-xs px-2 py-0.5 rounded bg-gray-100">{item.category}</span></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: "#6A6D70" }}>{item.uom}</td>
                  <td className="px-3 py-2.5 text-center">{item.qty}</td>
                  <td className="px-3 py-2.5 text-right font-mono">{fmt(item.rate)}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-medium">{fmt(amount)}</td>
                  <td className="px-3 py-2.5 text-center">{item.ppn ? "✅" : "—"}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-medium">{fmt(amount + ppn)}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: "#6A6D70" }}>{item.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Totals */}
      <div className="border-t p-5" style={{ borderColor: "#D1D2D4" }}>
        <div className="flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between text-sm"><span style={{ color: "#6A6D70" }}>Subtotal (excl. PPN)</span><span className="font-mono">{currency} {fmt(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: "#6A6D70" }}>PPN 12%</span><span className="font-mono">{currency} {fmt(Math.round(ppnAmount))}</span></div>
            <div className="flex justify-between items-center pt-3 mt-2 rounded-lg px-4 py-3" style={{ background: "#0070F2" }}>
              <span className="text-white font-bold">GRAND TOTAL</span>
              <span className="text-white text-xl font-bold font-mono">{currency} {fmt(Math.round(grandTotal))}</span>
            </div>
            <p className="text-xs italic pt-1" style={{ color: "#6A6D70" }}>Terbilang: {terbilang(grandTotal)}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-3 py-1.5 rounded border text-xs font-medium" style={{ borderColor: "#E9730C", color: "#E9730C" }}>Request Price Amendment</button>
        </div>
      </div>
    </div>
  );
}
