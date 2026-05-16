"use client";
import { Link2 } from "lucide-react";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

export function SOHeaderBanner({ formData, updateField }: Props) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    DRAFT: { bg: "#6A6D70", text: "#fff" },
    CONFIRMED: { bg: "#0070F2", text: "#fff" },
    "IN PROGRESS": { bg: "#E9730C", text: "#fff" },
    COMPLETED: { bg: "#107E3E", text: "#fff" },
    CANCELLED: { bg: "#BB0000", text: "#fff" },
  };
  const status = formData.status as string;
  const sc = statusColors[status] || statusColors.DRAFT;

  return (
    <div className="rounded-lg p-6 text-white" style={{ background: "linear-gradient(135deg, #003B62 0%, #0070F2 100%)" }}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">SALES ORDER</h1>
          <p className="text-white/80 font-mono mt-1">SO-2025-XXXX</p>
          <div className="flex items-center gap-3 mt-3">
            <div>
              <label className="text-xs text-white/60">SO Date</label>
              <input type="date" defaultValue="2025-05-12" className="block mt-0.5 px-2 py-1 rounded text-sm bg-white/10 border border-white/20 text-white" />
            </div>
            <div>
              <label className="text-xs text-white/60">Status</label>
              <div className="mt-0.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: sc.bg, color: sc.text }}>{status}</div>
            </div>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="flex items-center gap-2 justify-end">
            <Link2 className="h-4 w-4 text-white/60" />
            <span className="text-xs text-white/60">Reference Quotation:</span>
            <a href="#" className="text-sm font-mono font-medium underline text-white hover:text-blue-200">{formData.refQuotation as string}</a>
          </div>
          <p className="text-xs text-white/60">Quotation Date: {formData.refQuotationDate as string}</p>
          <button className="mt-2 px-3 py-1.5 rounded border border-white/40 text-xs font-medium hover:bg-white/10">Convert from Quotation</button>
          <div className="mt-3">
            <label className="text-xs text-white/60 block mb-1">Priority Level</label>
            <div className="flex gap-2">
              {["Normal", "Urgent", "Critical"].map((p) => (
                <button key={p} onClick={() => updateField("priority", p)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${formData.priority === p ? "bg-white text-[#003B62]" : "border-white/40 text-white hover:bg-white/10"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
