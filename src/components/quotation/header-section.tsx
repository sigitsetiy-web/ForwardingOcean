"use client";

import { FileText } from "lucide-react";

interface Props {
  formData: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
}

export function QuotationHeader({ formData, updateField }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6" style={{ borderColor: "#D1D2D4" }}>
      <div className="flex items-start justify-between">
        {/* Left: Company */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-lg flex items-center justify-center" style={{ background: "#0070F2" }}>
            <FileText className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#003B62" }}>PT. Key Ocean Forwarding</h2>
            <p className="text-sm" style={{ color: "#6A6D70" }}>Jasa Freight Forwarding & Custom Clearance</p>
          </div>
        </div>

        {/* Right: Document Info */}
        <div className="text-right space-y-3">
          <h1 className="text-2xl font-bold" style={{ color: "#0070F2" }}>SALES QUOTATION</h1>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <span style={{ color: "#6A6D70" }}>Quotation No:</span>
            <input
              readOnly
              value="QT-2025-XXXX"
              className="text-right font-mono font-medium px-2 py-1 rounded border bg-gray-50"
              style={{ borderColor: "#D1D2D4", color: "#32363A" }}
            />
            <span style={{ color: "#6A6D70" }}>Date:</span>
            <input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              className="text-right px-2 py-1 rounded border"
              style={{ borderColor: "#D1D2D4" }}
              readOnly
            />
            <span style={{ color: "#6A6D70" }}>Valid Until: <span className="text-red-500">*</span></span>
            <input
              type="date"
              value={formData.validUntil as string}
              onChange={(e) => updateField("validUntil", e.target.value)}
              className="text-right px-2 py-1 rounded border focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
            <span style={{ color: "#6A6D70" }}>Status:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100" style={{ color: "#6A6D70" }}>
              Draft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
