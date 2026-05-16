"use client";
import { Plus } from "lucide-react";

interface Props { activeTab: number; setActiveTab: (t: number) => void; refJO: string; }

const tabs = [
  { id: 0, number: "INV-001", party: "PT Sritex", currency: "IDR", status: "sent", statusColor: "#0070F2" },
  { id: 1, number: "INV-002", party: "Shanghai Agent", currency: "USD", status: "draft", statusColor: "#6A6D70" },
  { id: 2, number: "INV-003", party: "Trading House", currency: "USD", status: "overdue", statusColor: "#BB0000" },
];

export function InvMultiPartyTabs({ activeTab, setActiveTab, refJO }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4" style={{ borderColor: "#D1D2D4" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold" style={{ color: "#003B62" }}>📋 Invoice Session — {refJO}</h3>
          <p className="text-xs" style={{ color: "#6A6D70" }}>Satu Job Order dapat menghasilkan beberapa invoice ke pihak yang berbeda</p>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded border border-dashed text-xs font-medium" style={{ borderColor: "#0070F2", color: "#0070F2" }}>
          <Plus className="h-3 w-3" />Add Billing Party
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-left min-w-[200px] transition-all ${activeTab === tab.id ? "shadow-md" : "hover:bg-gray-50"}`}
            style={{ borderColor: activeTab === tab.id ? "#0070F2" : "#D1D2D4", background: activeTab === tab.id ? "#E8F4FD" : "#fff" }}>
            <div className="flex-1">
              <p className="text-xs font-mono font-bold" style={{ color: "#32363A" }}>{tab.number}</p>
              <p className="text-[10px]" style={{ color: "#6A6D70" }}>{tab.party} · {tab.currency}</p>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white" style={{ background: tab.statusColor }}>
              {tab.status === "sent" ? "✅ Sent" : tab.status === "draft" ? "⏳ Draft" : "❌ Overdue"}
            </span>
          </button>
        ))}
        <button className="flex items-center justify-center px-4 py-2.5 rounded-lg border border-dashed min-w-[60px]" style={{ borderColor: "#D1D2D4" }}>
          <Plus className="h-5 w-5" style={{ color: "#6A6D70" }} />
        </button>
      </div>
      {/* Summary strip */}
      <div className="mt-3 flex gap-6 text-xs px-2 py-2 rounded" style={{ background: "#F5F6F7", color: "#6A6D70" }}>
        <span>Total IDR: <b style={{ color: "#32363A" }}>Rp 38.850.000</b></span>
        <span>Total USD: <b style={{ color: "#32363A" }}>$450</b></span>
        <span>Total Invoiced (equiv): <b style={{ color: "#32363A" }}>Rp 46.050.000</b></span>
        <span>Outstanding: <b style={{ color: "#BB0000" }}>Rp 28.200.000</b></span>
      </div>
    </div>
  );
}
