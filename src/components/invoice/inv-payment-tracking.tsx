"use client";
import { Plus } from "lucide-react";

interface Props { formData: Record<string, unknown>; }

export function InvPaymentTracking({ formData }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #107E3E" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>💳 Payment Receipt & AR Tracking</h3>
      </div>
      <div className="p-5 space-y-4">
        {/* AR Status Flow */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {["Invoice Issued", "Sent to Customer", "Partial Payment", "Full Payment", "AR Closed"].map((step, i) => (
            <div key={step} className="flex items-center">
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap ${i === 0 ? "text-white" : ""}`}
                style={i === 0 ? { background: "#0070F2" } : { background: "#F5F6F7", color: "#6A6D70" }}>{step}</span>
              {i < 4 && <div className="w-6 h-px mx-1" style={{ background: "#D1D2D4" }} />}
            </div>
          ))}
        </div>
        {/* Outstanding */}
        <div className="p-4 rounded-lg" style={{ background: "#F5F6F7" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Invoice Amount</p><p className="text-sm font-bold font-mono" style={{ color: "#32363A" }}>USD 450.00</p></div>
            <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Total Paid</p><p className="text-sm font-bold font-mono" style={{ color: "#107E3E" }}>USD 0.00</p></div>
            <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Outstanding</p><p className="text-sm font-bold font-mono" style={{ color: "#BB0000" }}>USD 450.00</p></div>
            <div><p className="text-[10px] uppercase" style={{ color: "#6A6D70" }}>Due Date</p><p className="text-sm font-bold" style={{ color: "#32363A" }}>11 Jun 2025</p></div>
          </div>
        </div>
        {/* Payment table */}
        <div>
          <table className="w-full text-sm"><thead><tr style={{ background: "#F5F6F7" }}>
            <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Receipt No.</th>
            <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Date</th>
            <th className="px-3 py-2 text-right text-xs" style={{ color: "#6A6D70" }}>Amount</th>
            <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Method</th>
            <th className="px-3 py-2 text-left text-xs" style={{ color: "#6A6D70" }}>Bank Ref</th>
          </tr></thead><tbody>
            <tr><td colSpan={5} className="px-3 py-6 text-center text-xs" style={{ color: "#6A6D70" }}>Belum ada pembayaran diterima</td></tr>
          </tbody></table>
          <button className="mt-2 flex items-center gap-1 px-4 py-2 rounded text-sm font-medium text-white" style={{ background: "#107E3E" }}>
            <Plus className="h-4 w-4" />Record Payment
          </button>
        </div>
        {/* Aging */}
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "#6A6D70" }}>Aging:</span>
          <div className="flex gap-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white" style={{ background: "#107E3E" }}>Current (0-30d)</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: "#F5F6F7", color: "#6A6D70" }}>31-60d</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: "#F5F6F7", color: "#6A6D70" }}>61-90d</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: "#F5F6F7", color: "#6A6D70" }}>&gt;90d</span>
          </div>
        </div>
      </div>
    </div>
  );
}
