"use client";
import { Plus } from "lucide-react";

const items = [
  { desc: "Jasa Pengurusan PIB — Custom Clearance", cat: "Customs", uom: "Per Shipment", qty: 1, price: 3500000, ppn: true, gl: "51004" },
  { desc: "PNBP (Penerimaan Negara Bukan Pajak)", cat: "Customs", uom: "Per Shipment", qty: 1, price: 500000, ppn: false, gl: "51004" },
  { desc: "Biaya Handling & Koordinasi", cat: "Handling", uom: "Per Shipment", qty: 1, price: 500000, ppn: true, gl: "51006" },
];

function fmt(n: number) { return new Intl.NumberFormat("id-ID").format(n); }

export function APLineItems() {
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const ppnItems = items.filter((i) => i.ppn);
  const ppnAmt = ppnItems.reduce((s, i) => s + i.qty * i.price * 0.12, 0);
  const pph23 = subtotal * 0.02;
  const total = subtotal + ppnAmt;
  const netPayable = total - pph23;

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #BB0000" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>💸 Invoice Line Items — Rincian Tagihan Vendor</h3></div>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-sm">
          <thead><tr style={{ background: "#F5F6F7" }}>
            <th className="px-3 py-2 text-left text-xs w-8" style={{ color: "#6A6D70" }}>#</th>
            <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Description</th>
            <th className="px-3 py-2 text-left text-xs w-20" style={{ color: "#6A6D70" }}>Category</th>
            <th className="px-3 py-2 text-center text-xs w-10" style={{ color: "#6A6D70" }}>Qty</th>
            <th className="px-3 py-2 text-right text-xs w-28" style={{ color: "#6A6D70" }}>Unit Price</th>
            <th className="px-3 py-2 text-right text-xs w-28" style={{ color: "#6A6D70" }}>Amount</th>
            <th className="px-3 py-2 text-center text-xs w-12" style={{ color: "#6A6D70" }}>PPN?</th>
            <th className="px-3 py-2 text-left text-xs w-16" style={{ color: "#6A6D70" }}>GL</th>
          </tr></thead>
          <tbody>{items.map((item, i) => (
            <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
              <td className="px-3 py-2.5 text-center" style={{ color: "#6A6D70" }}>{i + 1}</td>
              <td className="px-3 py-2.5 font-medium" style={{ color: "#32363A" }}>{item.desc}</td>
              <td className="px-3 py-2.5"><span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100">{item.cat}</span></td>
              <td className="px-3 py-2.5 text-center">{item.qty}</td>
              <td className="px-3 py-2.5 text-right font-mono">{fmt(item.price)}</td>
              <td className="px-3 py-2.5 text-right font-mono font-medium">{fmt(item.qty * item.price)}</td>
              <td className="px-3 py-2.5 text-center">{item.ppn ? "✅" : "—"}</td>
              <td className="px-3 py-2.5 font-mono text-[10px]" style={{ color: "#6A6D70" }}>{item.gl}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t" style={{ borderColor: "#D1D2D4" }}>
        <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded border border-dashed" style={{ borderColor: "#BB0000", color: "#BB0000" }}><Plus className="h-3 w-3" />Add Line Item</button>
      </div>
      <div className="border-t p-5" style={{ borderColor: "#D1D2D4" }}>
        <div className="flex justify-end"><div className="w-80 space-y-1.5 text-sm">
          <div className="flex justify-between"><span style={{ color: "#6A6D70" }}>Subtotal</span><span className="font-mono">{fmt(subtotal)}</span></div>
          <div className="flex justify-between"><span style={{ color: "#6A6D70" }}>PPN Masukan 12%</span><span className="font-mono">{fmt(Math.round(ppnAmt))}</span></div>
          <div className="flex justify-between"><span style={{ color: "#6A6D70" }}>PPh 23 Dipotong (2%)</span><span className="font-mono">({fmt(Math.round(pph23))})</span></div>
          <div className="flex justify-between items-center pt-3 mt-2 rounded-lg px-4 py-3" style={{ background: "#BB0000" }}>
            <span className="text-white font-bold">TOTAL INVOICE</span><span className="text-white text-lg font-bold font-mono">Rp {fmt(Math.round(total))}</span>
          </div>
          <div className="flex justify-between pt-1"><span className="font-bold" style={{ color: "#003B62" }}>NET PAYABLE</span><span className="font-bold font-mono" style={{ color: "#BB0000" }}>Rp {fmt(Math.round(netPayable))}</span></div>
        </div></div>
      </div>
    </div>
  );
}
