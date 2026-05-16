"use client";

import { Plus, Trash2 } from "lucide-react";

interface RateItem {
  description: string;
  category: string;
  uom: string;
  qty: number;
  rate: number;
  ppn: boolean;
  notes: string;
}

interface Props {
  items: RateItem[];
  setItems: (items: RateItem[]) => void;
  currency: string;
  subtotal: number;
  ppnAmount: number;
  total: number;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

export function RateTable({ items, setItems, currency, subtotal, ppnAmount, total }: Props) {
  const addRow = () => {
    setItems([...items, { description: "", category: "Other", uom: "Per Shipment", qty: 1, rate: 0, ppn: false, notes: "" }]);
  };

  const removeRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof RateItem, value: unknown) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
          Rate Details
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F5F6F7" }}>
              <th className="px-3 py-2 text-left font-medium w-8" style={{ color: "#6A6D70" }}>#</th>
              <th className="px-3 py-2 text-left font-medium" style={{ color: "#6A6D70" }}>Description</th>
              <th className="px-3 py-2 text-left font-medium w-24" style={{ color: "#6A6D70" }}>Category</th>
              <th className="px-3 py-2 text-left font-medium w-28" style={{ color: "#6A6D70" }}>UoM</th>
              <th className="px-3 py-2 text-center font-medium w-16" style={{ color: "#6A6D70" }}>Qty</th>
              <th className="px-3 py-2 text-right font-medium w-36" style={{ color: "#6A6D70" }}>Rate ({currency})</th>
              <th className="px-3 py-2 text-right font-medium w-36" style={{ color: "#6A6D70" }}>Amount</th>
              <th className="px-3 py-2 text-center font-medium w-14" style={{ color: "#6A6D70" }}>PPN?</th>
              <th className="px-3 py-2 text-left font-medium w-32" style={{ color: "#6A6D70" }}>Notes</th>
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t hover:bg-blue-50/30" style={{ borderColor: "#D1D2D4" }}>
                <td className="px-3 py-2 text-center" style={{ color: "#6A6D70" }}>{index + 1}</td>
                <td className="px-3 py-1.5">
                  <input
                    value={item.description}
                    onChange={(e) => updateRow(index, "description", e.target.value)}
                    className="w-full px-2 py-1.5 rounded border text-sm focus:ring-1 focus:ring-[#0070F2] outline-none"
                    style={{ borderColor: "#D1D2D4" }}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={item.category}
                    onChange={(e) => updateRow(index, "category", e.target.value)}
                    className="w-full px-2 py-1.5 rounded border text-sm"
                    style={{ borderColor: "#D1D2D4" }}
                  >
                    {["Freight", "Origin", "Destination", "Customs", "Handling", "Trucking", "Insurance", "Surcharge", "Other"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={item.uom}
                    onChange={(e) => updateRow(index, "uom", e.target.value)}
                    className="w-full px-2 py-1.5 rounded border text-sm"
                    style={{ borderColor: "#D1D2D4" }}
                  >
                    {["Per Shipment", "Per Container", "Per CBM", "Per KG", "Per Trip", "Per Day", "Lumpsum"].map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateRow(index, "qty", parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1.5 rounded border text-sm text-center focus:ring-1 focus:ring-[#0070F2] outline-none"
                    style={{ borderColor: "#D1D2D4" }}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    min="0"
                    value={item.rate || ""}
                    onChange={(e) => updateRow(index, "rate", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-2 py-1.5 rounded border text-sm text-right focus:ring-1 focus:ring-[#0070F2] outline-none"
                    style={{ borderColor: "#D1D2D4" }}
                  />
                </td>
                <td className="px-3 py-2 text-right font-medium" style={{ color: "#32363A" }}>
                  {formatNumber(item.qty * item.rate)}
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.ppn}
                    onChange={(e) => updateRow(index, "ppn", e.target.checked)}
                    className="accent-[#0070F2] rounded"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    value={item.notes}
                    onChange={(e) => updateRow(index, "notes", e.target.value)}
                    placeholder="..."
                    className="w-full px-2 py-1.5 rounded border text-sm focus:ring-1 focus:ring-[#0070F2] outline-none"
                    style={{ borderColor: "#D1D2D4" }}
                  />
                </td>
                <td className="px-2 py-2">
                  <button onClick={() => removeRow(index)} className="p-1 rounded hover:bg-red-50 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <div className="px-5 py-3 border-t" style={{ borderColor: "#D1D2D4" }}>
        <button
          onClick={addRow}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-dashed text-sm font-medium hover:bg-blue-50 transition-colors"
          style={{ borderColor: "#0070F2", color: "#0070F2" }}
        >
          <Plus className="h-4 w-4" />
          Add Row
        </button>
      </div>

      {/* Totals */}
      <div className="border-t px-5 py-4" style={{ borderColor: "#D1D2D4" }}>
        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: "#6A6D70" }}>Subtotal</span>
              <span className="font-medium" style={{ color: "#32363A" }}>{currency} {formatNumber(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "#6A6D70" }}>PPN 12%</span>
              <span className="font-medium" style={{ color: "#32363A" }}>{currency} {formatNumber(Math.round(ppnAmount))}</span>
            </div>
            <div className="flex justify-between pt-2 border-t" style={{ borderColor: "#D1D2D4" }}>
              <span className="text-base font-bold" style={{ color: "#003B62" }}>TOTAL</span>
              <span className="text-lg font-bold" style={{ color: "#0070F2" }}>{currency} {formatNumber(Math.round(total))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
