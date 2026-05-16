"use client";

const aps = [
  { no: "API-001", vendor: "Evergreen Shipping", type: "Freight", currency: "USD", amount: "$850", equiv: "13.600.000", ppn: "N/A", status: "paid", color: "#107E3E", outstanding: "0" },
  { no: "API-002", vendor: "EMKL Maju Jaya", type: "Customs", currency: "IDR", amount: "4.500.000", equiv: "4.500.000", ppn: "495.000", status: "pending", color: "#E9730C", outstanding: "4.500.000" },
  { no: "API-003", vendor: "CV Cepat Trucking", type: "Trucking", currency: "IDR", amount: "2.800.000", equiv: "2.800.000", ppn: "308.000", status: "draft", color: "#6A6D70", outstanding: "2.800.000" },
];

export function APJOSummary() {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #BB0000" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>📊 Semua AP untuk JO-2025-0112</h3></div>
      <div className="overflow-x-auto p-5">
        <table className="w-full text-sm"><thead><tr style={{ background: "#F5F6F7" }}>
          <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>AP No.</th>
          <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Vendor</th>
          <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Type</th>
          <th className="px-3 py-2 text-right text-xs" style={{ color: "#6A6D70" }}>Amount</th>
          <th className="px-3 py-2 text-right text-xs" style={{ color: "#6A6D70" }}>PPN Masukan</th>
          <th className="px-3 py-2 text-center text-xs" style={{ color: "#6A6D70" }}>Status</th>
          <th className="px-3 py-2 text-right text-xs" style={{ color: "#6A6D70" }}>Outstanding</th>
        </tr></thead><tbody>
          {aps.map((ap, i) => (
            <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
              <td className="px-3 py-2 font-mono text-xs font-medium" style={{ color: "#BB0000" }}>{ap.no}</td>
              <td className="px-3 py-2 text-xs">{ap.vendor}</td>
              <td className="px-3 py-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100">{ap.type}</span></td>
              <td className="px-3 py-2 text-right font-mono text-xs">{ap.currency === "USD" ? ap.amount : `Rp ${ap.amount}`}</td>
              <td className="px-3 py-2 text-right font-mono text-xs">{ap.ppn === "N/A" ? "N/A" : `Rp ${ap.ppn}`}</td>
              <td className="px-3 py-2 text-center"><span className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white" style={{ background: ap.color }}>{ap.status === "paid" ? "✅ Paid" : ap.status === "pending" ? "⏳ Pending" : "📝 Draft"}</span></td>
              <td className="px-3 py-2 text-right font-mono text-xs font-medium" style={{ color: ap.outstanding === "0" ? "#107E3E" : "#BB0000" }}>{ap.outstanding === "0" ? "Rp 0" : `Rp ${ap.outstanding}`}</td>
            </tr>
          ))}
        </tbody></table>
        <div className="mt-4 p-4 rounded-lg" style={{ background: "#F5F6F7" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Total AP</p><p className="text-sm font-bold font-mono">Rp 20.900.000</p></div>
            <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Paid</p><p className="text-sm font-bold font-mono" style={{ color: "#107E3E" }}>Rp 13.600.000</p></div>
            <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Outstanding</p><p className="text-sm font-bold font-mono" style={{ color: "#BB0000" }}>Rp 7.300.000</p></div>
            <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>JO Margin</p><p className="text-sm font-bold" style={{ color: "#107E3E" }}>16.3%</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
