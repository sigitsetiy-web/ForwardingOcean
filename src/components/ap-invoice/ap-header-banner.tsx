"use client";
import { Link2 } from "lucide-react";

export function APHeaderBanner() {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: "#003B62", borderLeft: "4px solid #BB0000" }}>
      <div className="p-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">📥 VENDOR INVOICE / AP</h1>
          <p className="text-white/70 font-mono text-sm mt-0.5">API-2025-0002</p>
          <div className="flex items-center gap-3 mt-3">
            <div><label className="text-[10px] text-white/50">Vendor Invoice No.</label><input defaultValue="INV/MJ/V/2025/0089" className="block mt-0.5 px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-white w-44" /></div>
            <div><label className="text-[10px] text-white/50">Invoice Date</label><input type="date" defaultValue="2025-05-10" className="block mt-0.5 px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-white" /></div>
            <div><label className="text-[10px] text-white/50">Due Date</label><input type="date" defaultValue="2025-05-24" className="block mt-0.5 px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-white" /></div>
            <div><label className="text-[10px] text-white/50">Status</label><div className="mt-0.5 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#E9730C" }}>PENDING APPROVAL</div></div>
          </div>
        </div>
        <div className="text-right space-y-1.5">
          <div className="flex items-center gap-2 justify-end text-xs text-white/60"><Link2 className="h-3 w-3" />JO: <a href="#" className="font-mono text-white underline">JO-2025-0112</a></div>
          <div className="flex items-center gap-2 justify-end text-xs text-white/60"><Link2 className="h-3 w-3" />PO: <a href="#" className="font-mono text-white underline">VP-2025-031</a></div>
          <div className="flex gap-2 justify-end mt-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white" style={{ background: "#BB0000" }}>CUSTOMS</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white">IDR</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white">PPN 12%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
