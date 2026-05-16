"use client";

import { useState } from "react";
import { Search, Bell, RefreshCw, Plus, Download, LayoutGrid, Calendar, List } from "lucide-react";
import { CCKpiStrip } from "@/components/control-center/cc-kpi-strip";
import { CCKanbanView } from "@/components/control-center/cc-kanban-view";
import { CCTimelineView } from "@/components/control-center/cc-timeline-view";
import { CCTableView } from "@/components/control-center/cc-table-view";
import { CCSidePanel } from "@/components/control-center/cc-side-panel";

type ViewMode = "kanban" | "timeline" | "table";

export default function ControlCenterPage() {
  const [view, setView] = useState<ViewMode>("kanban");
  const [selectedJO, setSelectedJO] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen -m-6" style={{ background: "#F0F2F5" }}>
      {/* Global Header */}
      <div className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between" style={{ background: "#003B62" }}>
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white">⚙️ JO CONTROL CENTER</h1>
          <span className="text-xs text-white/50">Home › Operations › Control Center</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari JO, Customer, Vessel, B/L..."
              className="pl-9 pr-4 py-1.5 rounded-md text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 w-72 focus:outline-none focus:ring-1 focus:ring-white/40" />
          </div>
          <span className="text-[10px] text-white/50">Last: 16 May 09:45</span>
          <button className="p-1.5 rounded hover:bg-white/10"><RefreshCw className="h-4 w-4 text-white/60" /></button>
          <button className="p-1.5 rounded hover:bg-white/10 relative"><Bell className="h-4 w-4 text-white/60" /><span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center">3</span></button>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="sticky top-[52px] z-30 bg-white border-b shadow-sm px-6 py-2.5 flex items-center justify-between" style={{ borderColor: "#D1D2D4" }}>
        <div className="flex items-center gap-2">
          {["All Status", "All Officer", "All Customer"].map((f) => (
            <select key={f} className="px-2 py-1.5 rounded border text-xs" style={{ borderColor: "#D1D2D4", color: "#32363A" }}>
              <option>{f}</option>
            </select>
          ))}
          <div className="flex gap-0.5 ml-2">
            {["Import", "Export", "Local"].map((d) => (
              <button key={d} className="px-2.5 py-1 rounded text-[10px] font-medium border" style={{ borderColor: "#D1D2D4", color: "#6A6D70" }}>{d}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex rounded-md border overflow-hidden" style={{ borderColor: "#D1D2D4" }}>
            {([["kanban", LayoutGrid], ["timeline", Calendar], ["table", List]] as [ViewMode, typeof LayoutGrid][]).map(([v, Icon]) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium ${view === v ? "text-white" : ""}`}
                style={view === v ? { background: "#0070F2" } : { color: "#6A6D70" }}>
                <Icon className="h-3.5 w-3.5" />{v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white" style={{ background: "#0070F2" }}>
            <Plus className="h-3.5 w-3.5" />New JO
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium" style={{ borderColor: "#D1D2D4", color: "#6A6D70" }}>
            <Download className="h-3.5 w-3.5" />Export
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="px-6 pt-4">
        <CCKpiStrip />
      </div>

      {/* Main Content */}
      <div className="px-6 pt-4 pb-6">
        {view === "kanban" && <CCKanbanView onSelectJO={setSelectedJO} />}
        {view === "timeline" && <CCTimelineView onSelectJO={setSelectedJO} />}
        {view === "table" && <CCTableView onSelectJO={setSelectedJO} />}
      </div>

      {/* Side Panel */}
      {selectedJO && <CCSidePanel joId={selectedJO} onClose={() => setSelectedJO(null)} />}
    </div>
  );
}
