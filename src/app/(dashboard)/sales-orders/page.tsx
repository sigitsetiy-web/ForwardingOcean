"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Download } from "lucide-react";
import Link from "next/link";
import { DataTable, DataColumn } from "@/components/shared/data-table";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function SalesOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["sales-orders", { status: statusFilter, page }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/sales-orders?${params}`);
      return res.json();
    },
  });

  const columns: DataColumn[] = [
    {
      key: "number",
      label: "No. SO",
      sortable: true,
      width: "180px",
      render: (row) => (
        <Link href={`/sales-orders/new`} className="font-semibold text-[#0070F2] hover:underline">
          {row.number as string}
        </Link>
      ),
    },
    {
      key: "customer",
      label: "Pelanggan",
      sortable: true,
      render: (row) => (
        <span className="font-medium">{(row.customer as Record<string, string>)?.name || "-"}</span>
      ),
    },
    {
      key: "serviceType",
      label: "Jenis",
      width: "120px",
      render: (row) => (
        <Badge variant="outline" className="text-[11px] font-normal">
          {(row.serviceType as string)?.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "branch",
      label: "Cabang",
      width: "100px",
      render: (row) => <span className="text-[#6A6D70]">{(row.branch as Record<string, string>)?.code || "-"}</span>,
    },
    {
      key: "totalAmount",
      label: "Total",
      align: "right",
      width: "140px",
      sortable: true,
      render: (row) =>
        row.totalAmount ? (
          <span className="font-medium tabular-nums">
            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(row.totalAmount))}
          </span>
        ) : <span className="text-[#D1D2D4]">—</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      width: "120px",
      render: (row) => (
        <Badge className={`text-[11px] border font-medium ${statusColors[row.status as string] || ""}`} variant="secondary">
          {row.status as string}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#32363A" }}>Sales Orders</h1>
          <p className="text-[13px]" style={{ color: "#6A6D70" }}>Kelola sales order dari quotation yang disetujui</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[12px] h-8">
            <Download className="h-3.5 w-3.5 mr-1.5" />Export
          </Button>
          <Link href="/sales-orders/new">
            <Button size="sm" className="text-[12px] h-8" style={{ background: "#0070F2" }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />Buat Sales Order
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}>
        <Select value={statusFilter || "all"} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[150px] h-8 text-[12px] border-[#D1D2D4]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={page}
        pageSize={20}
        totalPages={data?.totalPages || 1}
        isLoading={isLoading}
        emptyMessage="Belum ada sales order"
        onPageChange={setPage}
        selectable
        compact
      />
    </div>
  );
}
