"use client";
import { Upload, Eye } from "lucide-react";

const docsFrom = [
  { name: "Commercial Invoice", required: true, status: "received", date: "13 May 2025" },
  { name: "Packing List", required: true, status: "received", date: "13 May 2025" },
  { name: "Bill of Lading Draft", required: true, status: "pending" },
  { name: "Certificate of Origin (COO)", required: false, status: "none" },
  { name: "Surat Kuasa Kepabeanan", required: true, status: "received", date: "12 May 2025" },
  { name: "NIB / SIUP Customer", required: true, status: "received", date: "12 May 2025" },
];
const docsIssued = [
  { name: "House B/L (HBL)", status: "draft", number: "HBL-2025-0112" },
  { name: "Master B/L (MBL)", status: "pending", number: "" },
  { name: "PIB", status: "pending", number: "" },
  { name: "SPPB", status: "pending", number: "" },
  { name: "Delivery Order (D/O)", status: "pending", number: "" },
  { name: "Arrival Notice", status: "draft", number: "AN-2025-0112" },
];

export function JODocumentSection() {
  const received = docsFrom.filter((d) => d.status === "received").length;
  const total = docsFrom.filter((d) => d.required).length;
  const pct = Math.round((received / total) * 100);

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #0070F2" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>📋 Document Tracking</h3>
      </div>
      <div className="p-5 space-y-5">
        {/* From Customer */}
        <div>
          <h4 className="text-xs font-bold uppercase mb-2" style={{ color: "#003B62" }}>A. Documents FROM Customer / Shipper</h4>
          <table className="w-full text-sm"><thead><tr style={{ background: "#F5F6F7" }}>
            <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Document</th>
            <th className="px-3 py-2 text-center text-xs w-16" style={{ color: "#6A6D70" }}>Req?</th>
            <th className="px-3 py-2 text-center text-xs w-24" style={{ color: "#6A6D70" }}>Status</th>
            <th className="px-3 py-2 text-center text-xs w-24" style={{ color: "#6A6D70" }}>Date</th>
            <th className="px-3 py-2 text-center text-xs w-16" style={{ color: "#6A6D70" }}>Action</th>
          </tr></thead><tbody>
            {docsFrom.map((d, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
                <td className="px-3 py-2 font-medium" style={{ color: "#32363A" }}>{d.name}</td>
                <td className="px-3 py-2 text-center">{d.required ? "✅" : "⚪"}</td>
                <td className="px-3 py-2 text-center">
                  {d.status === "received" && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#E6F4EA", color: "#107E3E" }}>✅ Received</span>}
                  {d.status === "pending" && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#FFF3E0", color: "#E9730C" }}>⏳ Pending</span>}
                  {d.status === "none" && <span className="text-[10px]" style={{ color: "#6A6D70" }}>—</span>}
                </td>
                <td className="px-3 py-2 text-center text-xs" style={{ color: "#6A6D70" }}>{d.date || "—"}</td>
                <td className="px-3 py-2 text-center">{d.status === "received" ? <Eye className="h-4 w-4 mx-auto" style={{ color: "#0070F2" }} /> : <Upload className="h-4 w-4 mx-auto" style={{ color: "#0070F2" }} />}</td>
              </tr>
            ))}
          </tbody></table>
        </div>
        {/* Issued */}
        <div>
          <h4 className="text-xs font-bold uppercase mb-2" style={{ color: "#003B62" }}>B. Documents ISSUED / Produced</h4>
          <table className="w-full text-sm"><thead><tr style={{ background: "#F5F6F7" }}>
            <th className="px-3 py-2 text-left text-xs font-medium" style={{ color: "#6A6D70" }}>Document</th>
            <th className="px-3 py-2 text-left text-xs w-32" style={{ color: "#6A6D70" }}>Doc Number</th>
            <th className="px-3 py-2 text-center text-xs w-24" style={{ color: "#6A6D70" }}>Status</th>
            <th className="px-3 py-2 text-center text-xs w-16" style={{ color: "#6A6D70" }}>Action</th>
          </tr></thead><tbody>
            {docsIssued.map((d, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "#D1D2D4" }}>
                <td className="px-3 py-2 font-medium" style={{ color: "#32363A" }}>{d.name}</td>
                <td className="px-3 py-2 font-mono text-xs">{d.number || "—"}</td>
                <td className="px-3 py-2 text-center">
                  {d.status === "draft" && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#E8F4FD", color: "#0070F2" }}>Draft</span>}
                  {d.status === "pending" && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#F5F6F7", color: "#6A6D70" }}>Pending</span>}
                </td>
                <td className="px-3 py-2 text-center"><Eye className="h-4 w-4 mx-auto cursor-pointer" style={{ color: "#0070F2" }} /></td>
              </tr>
            ))}
          </tbody></table>
        </div>
        {/* Progress */}
        <div>
          <span className="text-xs font-medium" style={{ color: "#32363A" }}>Document Completeness: {received}/{total} ({pct}%)</span>
          <div className="w-full h-2 rounded-full bg-gray-200 mt-1"><div className="h-2 rounded-full" style={{ width: `${pct}%`, background: "#0070F2" }} /></div>
        </div>
      </div>
    </div>
  );
}
