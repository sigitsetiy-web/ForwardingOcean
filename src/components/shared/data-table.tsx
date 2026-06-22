"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  Download,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface DataColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: DataColumn<T>[];
  data: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  idKey?: string;
  showRecordCount?: boolean;
  compact?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  total = 0,
  page = 1,
  pageSize = 20,
  totalPages = 1,
  isLoading = false,
  emptyMessage = "Tidak ada data",
  onPageChange,
  onSort,
  onRowClick,
  selectable = false,
  onSelectionChange,
  idKey = "id",
  showRecordCount = true,
  compact = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSort = (key: string) => {
    const newDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDir(newDir);
    onSort?.(key, newDir);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    } else {
      const allIds = new Set(data.map((row) => String(row[idKey])));
      setSelectedIds(allIds);
      onSelectionChange?.(Array.from(allIds));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
    onSelectionChange?.(Array.from(newSet));
  };

  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, total);

  return (
    <div className="rounded-lg border bg-white overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b" style={{ background: "#F8F9FA", borderColor: "#E5E7EB" }}>
              {selectable && (
                <th className="w-10 px-3 py-3">
                  <button
                    onClick={handleSelectAll}
                    className={cn(
                      "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                      selectedIds.size === data.length && data.length > 0
                        ? "bg-[#0070F2] border-[#0070F2]"
                        : "border-[#D1D2D4] hover:border-[#0070F2]"
                    )}
                  >
                    {selectedIds.size === data.length && data.length > 0 && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </button>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 text-left font-semibold text-[11px] uppercase tracking-wider select-none",
                    compact ? "py-2.5" : "py-3",
                    col.sortable && "cursor-pointer hover:bg-[#EEF0F2]",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                  style={{ color: "#6A6D70", width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        {sortKey === col.key ? (
                          sortDir === "asc" ? (
                            <ArrowUp className="h-3 w-3 text-[#0070F2]" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-[#0070F2]" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-[#D1D2D4]" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 rounded-full border-2 border-[#0070F2] border-t-transparent animate-spin" />
                    <span className="text-[13px] text-[#6A6D70]">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-1">
                    <LayoutGrid className="h-8 w-8 text-[#D1D2D4]" />
                    <span className="text-[13px] text-[#6A6D70]">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const rowId = String(row[idKey]);
                const isSelected = selectedIds.has(rowId);

                return (
                  <tr
                    key={rowId || rowIndex}
                    className={cn(
                      "border-b last:border-0 transition-colors",
                      isSelected ? "bg-[#E8F4FD]" : "hover:bg-[#F8F9FA]",
                      onRowClick && "cursor-pointer"
                    )}
                    style={{ borderColor: "#F0F0F0" }}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="w-10 px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectRow(rowId)}
                          className={cn(
                            "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-[#0070F2] border-[#0070F2]"
                              : "border-[#D1D2D4] hover:border-[#0070F2]"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </button>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 text-[13px]",
                          compact ? "py-2.5" : "py-3",
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center"
                        )}
                        style={{ color: "#32363A" }}
                      >
                        {col.render
                          ? col.render(row, rowIndex)
                          : (row[col.key] as React.ReactNode) ?? "-"}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer - Pagination & Record Count */}
      {(showRecordCount || totalPages > 1) && (
        <div
          className="flex items-center justify-between px-4 py-2.5 border-t"
          style={{ background: "#F8F9FA", borderColor: "#E5E7EB" }}
        >
          <div className="flex items-center gap-3">
            {showRecordCount && (
              <span className="text-[12px]" style={{ color: "#6A6D70" }}>
                {total > 0
                  ? `${startRecord}–${endRecord} dari ${total} data`
                  : "0 data"}
              </span>
            )}
            {selectedIds.size > 0 && (
              <Badge variant="secondary" className="text-[11px] h-5">
                {selectedIds.size} dipilih
              </Badge>
            )}
          </div>

          {totalPages > 1 && onPageChange && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={page === 1}
                onClick={() => onPageChange(1)}
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[12px] px-2" style={{ color: "#32363A" }}>
                {page} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={page === totalPages}
                onClick={() => onPageChange(totalPages)}
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
