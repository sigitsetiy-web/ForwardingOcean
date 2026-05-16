"use client";
import { Upload, Eye } from "lucide-react";

const docs = [
  { name: "Commercial Invoice", required: true, status: "pending" },
  { name: "Packing List", required: true, status: "received", date: "10 May 2025", by: "Admin" },
  { name: "Bill of Lading Draft", required: true, status: "pending" },
  { name: "Certificate of Origin", required: false, status: "none" },
  { name: "Pemberitahuan Impor Barang (PIB)", required: true, status: "pending" },
  { name: "Surat Kuasa Kepabeanan", required: true, status: "pending" },
  { name: "MSDS (if DG Cargo)", required: false, status: "none" },
  { name: "Insurance Policy", required: false, status: "none" },
];

export function SODocumentChecklist() {
  const received = docs.filter((d) => d.status === "received").length;
  const requiredTotal = docs.filter((d) => d.required).length;
  const pct = Math.round((received / requiredTotal) * 100);

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>📋 Required Document Checklist</h3>
        <p className="text-xs mt-0.5" style={{ color: "#6A6D70" }}>Dokumen yang harus diterima dari customer sebelum eksekusi</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F5F6F7" }}>
              <th className="px-4 py-2 text-left font-medium" style={{ color: "#6A6D70" }}>Document Name</th>
              <th className="px-4 py-2 text-center font-medium w-20" style={{ color: "#6A6D70" }}>Required?</th>
              <th className="px-4 py-2 text-center font-medium w-28" style={{ color: "#6A6D70" }}>Status</th>
              <th className="px-4 py-2 text-center font-medium w-28" style={{ color: "#6A6D70" }}>Received Date</th>
              <th className="px-4 py-2 text-center font-medium w-24" style={{ color: "#6A6D70" }}>Uploaded By</th>
              <th className="px-4 py-2 text-center font-medium w-20" style={{ color: "#6A6D70" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
                <td className="px-4 py-2.5 font-medium" style={{ color: "#32363A" }}>{doc.name}</td>
                <td className="px-4 py-2.5 text-center">{doc.required ? "✅" : "⚪ Optional"}</td>
                <td className="px-4 py-2.5 text-center">
                  {doc.status === "received" && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#E6F4EA", color: "#107E3E" }}>✅ Received</span>}
                  {doc.status === "pending" && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#FFF3E0", color: "#E9730C" }}>⏳ Pending</span>}
                  {doc.status === "none" && <span className="text-xs" style={{ color: "#6A6D70" }}>—</span>}
                </td>
                <td className="px-4 py-2.5 text-center text-xs" style={{ color: "#6A6D70" }}>{doc.date || "—"}</td>
                <td className="px-4 py-2.5 text-center text-xs" style={{ color: "#6A6D70" }}>{doc.by || "—"}</td>
                <td className="px-4 py-2.5 text-center">
                  {doc.status === "received" ? (
                    <button className="p-1 rounded hover:bg-blue-50"><Eye className="h-4 w-4" style={{ color: "#0070F2" }} /></button>
                  ) : (
                    <button className="p-1 rounded hover:bg-blue-50"><Upload className="h-4 w-4" style={{ color: "#0070F2" }} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-4 border-t" style={{ borderColor: "#D1D2D4" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: "#32363A" }}>Document Completeness: {received}/{requiredTotal} required documents received ({pct}%)</span>
          <button className="text-xs font-medium px-3 py-1 rounded border border-dashed" style={{ borderColor: "#0070F2", color: "#0070F2" }}>+ Add Custom Document</button>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-200">
          <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: "#0070F2" }} />
        </div>
      </div>
    </div>
  );
}
