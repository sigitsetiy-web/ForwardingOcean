"use client";
import { Link2, FileText } from "lucide-react";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

const statusColors: Record<string, string> = { DRAFT: "#6A6D70", SENT: "#0070F2", "PARTIAL PAID": "#E9730C", PAID: "#107E3E", OVERDUE: "#BB0000", CANCELLED: "#32363A" };

export function InvHeaderBanner({ formData, updateField }: Props) {
  const status = formData.status as string;
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: "#003B62", borderLeft: "4px solid #107E3E" }}>
      <div className="p-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-white/10"><FileText className="h-6 w-6 text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold text-white">INVOICE / FAKTUR</h1>
            <p className="text-white/70 font-mono text-sm mt-0.5">{formData.invoiceNumber as string}</p>
            <div className="flex items-center gap-3 mt-2">
              <div><label className="text-[10px] text-white/50">Invoice Date</label><input type="date" value={formData.invoiceDate as string} onChange={(e) => updateField("invoiceDate", e.target.value)} className="block mt-0.5 px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-white" /></div>
              <div><label className="text-[10px] text-white/50">Due Date</label><input type="date" value={formData.dueDate as string} onChange={(e) => updateField("dueDate", e.target.value)} className="block mt-0.5 px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-white" /></div>
              <div><label className="text-[10px] text-white/50">Status</label><div className="mt-0.5 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: statusColors[status] || "#6A6D70" }}>{status}</div></div>
            </div>
          </div>
        </div>
        <div className="text-right space-y-1.5">
          <div className="flex items-center gap-2 justify-end text-xs text-white/60"><Link2 className="h-3 w-3" />JO: <a href="#" className="font-mono text-white underline">{formData.refJO as string}</a></div>
          <div className="flex items-center gap-2 justify-end text-xs text-white/60"><Link2 className="h-3 w-3" />SO: <a href="#" className="font-mono text-white underline">{formData.refSO as string}</a></div>
          <div className="flex gap-2 justify-end mt-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white">{formData.invoiceType as string}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white" style={{ background: formData.billingPartyType === "DOMESTIC" ? "#0070F2" : "#107E3E" }}>
              {formData.billingPartyType === "DOMESTIC" ? "🇮🇩 DOMESTIC" : "🌐 OVERSEAS"}
            </span>
          </div>
          <div className="mt-2">
            <label className="text-[10px] text-white/50">Currency</label>
            <div className="flex gap-1 mt-0.5 justify-end">
              {["IDR", "USD", "EUR", "SGD", "CNY"].map((c) => (
                <button key={c} onClick={() => updateField("currency", c)} className={`px-2 py-0.5 rounded text-[10px] font-medium ${formData.currency === c ? "bg-white text-[#003B62]" : "border border-white/30 text-white/60"}`}>{c}</button>
              ))}
            </div>
          </div>
          {formData.currency !== "IDR" && (
            <div className="text-[10px] text-white/60 mt-1">Rate: 1 {formData.currency as string} = IDR {new Intl.NumberFormat("id-ID").format(Number(formData.exchangeRate))}</div>
          )}
        </div>
      </div>
    </div>
  );
}
