"use client";

import { cn } from "@/lib/utils";
import { useWorkspaceTabs } from "@/hooks/use-workspace-tabs";
import { List, Plus, X } from "lucide-react";

export function WorkspaceTabBar() {
  const {
    tabs,
    activeTabId,
    activeView,
    activeModule,
    closeTab,
    switchTab,
    switchView,
  } = useWorkspaceTabs();

  if (tabs.length === 0) return null;

  const showSubTabs = activeModule?.newHref;

  return (
    <div className="border-b bg-white" style={{ borderColor: "#D1D2D4" }}>
      {/* Module tabs */}
      <div className="flex items-center gap-0.5 overflow-x-auto px-2 pt-1.5 scrollbar-thin">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              className={cn(
                "group flex items-center gap-1 rounded-t-md border border-b-0 px-3 py-1.5 text-[12px] font-medium transition-colors flex-shrink-0 cursor-pointer",
                isActive
                  ? "bg-[#F5F6F7] border-[#D1D2D4] text-[#0070F2]"
                  : "bg-white border-transparent text-[#6A6D70] hover:bg-[#F5F6F7] hover:text-[#32363A]"
              )}
              onClick={() => switchTab(tab.id)}
            >
              <span className="max-w-[140px] truncate">{tab.label}</span>
              <button
                type="button"
                className={cn(
                  "ml-0.5 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100",
                  isActive && "opacity-70 hover:opacity-100"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                title="Tutup tab"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Sub-tabs: Daftar & Data Baru */}
      {showSubTabs && activeTabId && (
        <div
          className="flex items-center gap-1 px-4 py-2"
          style={{ background: "#F5F6F7", borderTop: "1px solid #D1D2D4" }}
        >
          <button
            type="button"
            onClick={() => switchView("list")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
              activeView === "list"
                ? "bg-white text-[#0070F2] shadow-sm"
                : "text-[#6A6D70] hover:text-[#32363A] hover:bg-white/60"
            )}
          >
            <List className="h-3.5 w-3.5" />
            Daftar
          </button>
          <button
            type="button"
            onClick={() => switchView("new")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
              activeView === "new"
                ? "bg-white text-[#0070F2] shadow-sm"
                : "text-[#6A6D70] hover:text-[#32363A] hover:bg-white/60"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            Data Baru
          </button>
        </div>
      )}
    </div>
  );
}
