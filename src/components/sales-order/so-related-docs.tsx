"use client";
import { useState } from "react";
import { FileText, ClipboardList, Receipt, CreditCard, Plus } from "lucide-react";

interface Props { refQuotation: string; }

export function SORelatedDocs({ refQuotation }: Props) {
  const [open, setOpen] = useState(false);
  const docs = [
    { icon: <FileText className="h-5 w-5" />, code: refQuotation, label: "Source Quotation", color: "#0070F2" },
    { icon: <ClipboardList className="h-5 w-5" />, code: "JO-2025-0089", label: "Job Order (will be created)", color: "#E9730C" },
    { icon: <Receipt className="h-5 w-5" />, code: "INV-2025-0120", label: "Invoice (pending)", color: "#6A6D70" },
    { icon: <CreditCard className="h-5 w-5" />, code: "PO-V-2025-031", label: "Purchase Order to Vendor", color: "#6A6D70" },
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <button onClick={() => setOpen(!open)} className="w-full px-5 py-3 flex items-center justify-between text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
        <span>🔗 Related Documents</span>
        <span>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: "#D1D2D4" }}>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {docs.map((doc, i) => (
              <div key={i} className="min-w-[180px] p-3 rounded-lg border hover:shadow-md cursor-pointer transition-shadow" style={{ borderColor: "#D1D2D4" }}>
                <div className="flex items-center gap-2 mb-1" style={{ color: doc.color }}>{doc.icon}<span className="font-mono text-xs font-bold">{doc.code}</span></div>
                <p className="text-xs" style={{ color: "#6A6D70" }}>{doc.label}</p>
              </div>
            ))}
          </div>
          <button className="mt-3 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white" style={{ background: "#0070F2" }}>
            <Plus className="h-4 w-4" />Create Job Order
          </button>
        </div>
      )}
    </div>
  );
}
