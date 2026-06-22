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
import { Plus, Search, Download, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DataTable, DataColumn } from "@/components/shared/data-table";
import { StatusPipeline, JOB_ORDER_PIPELINE } from "@/components/shared/status-pipeline";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  INVOICED: "bg-purple-50 text-purple-700 border-purple-200",
  CLOSED: "bg-slate-50 text-slate-700 border-slate-200",
};

const serviceTypeLabels: Record<string, string> = {
  SEA_IMPORT: "Sea Import",
  SEA_EXPORT: "Sea Export",
  AIR_IMPORT: "Air Import",
  AIR_EXPORT: "Air Export",
  DOMESTIC: "Domestik",
};

export default function JobOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["job-orders", { search, status: statusFilter, serviceType: serviceTypeFilter, page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "20",
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (serviceTypeFilter) params.set("serviceType", serviceTypeFilter);

      const res = await fetch(`/api/job-orders?${params}`);
      return res.json();
    },
  });

  const columns: DataColumn[] = [
    {
      key: "number",
      label: "No. JO",
      sortable: true,
      width: "180px",
      render: (row) => (
        <Link
          href={`/job-orders/${row.id}`}
          className="font-semibold text-[#0070F2] hover:underline"
        >
          {row.number as string}
        </Link>
      ),
    },
    {
      key: "customer",
      label: "Pelanggan",
      sortable: true,
      render: (row) => (
        <span className="font-medium">
          {(row.customer as Record<string, string>)?.name || "-"}
        </span>
      ),
    },
    {
      key: "serviceType",
      label: "Jenis",
      width: "120px",
      render: (row) => (
        <Badge variant="outline" className="text-[11px] font-normal">
          {serviceTypeLabels[row.serviceType as string] || String(row.serviceType)}
        </Badge>
      ),
    },
    {
      key: "branch",
      label: "Cabang",
      width: "100px",
      render: (row) => (
        <span className="text-[#6A6D70]">
          {(row.branch as Record<string, string>)?.code || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      width: "130px",
      render: (row) => (
        <Badge
          className={cn(
            "text-[11px] border font-medium",
            statusColors[row.status as string] || "bg-gray-100"
          )}
          variant="secondary"
        >
          {(row.status as string).replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "etd",
      label: "ETD",
      width: "100px",
      sortable: true,
      render: (row) =>
        row.etd ? (
          <span className="text-[12px] tabular-nums">
            {new Date(row.etd as string).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
          </span>
        ) : (
          <span className="text-[#D1D2D4]">—</span>
        ),
    },
    {
      key: "eta",
      label: "ETA",
      width: "100px",
      sortable: true,
      render: (row) =>
        row.eta ? (
          <span className="text-[12px] tabular-nums">
            {new Date(row.eta as string).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
          </span>
        ) : (
          <span className="text-[#D1D2D4]">—</span>
        ),
    },
    {
      key: "grossProfit",
      label: "Profit",
      align: "right",
      width: "130px",
      sortable: true,
      render: (row) => {
        const profit = Number(row.grossProfit || 0);
        if (profit === 0) return <span className="text-[#D1D2D4]">—</span>;
        return (
          <span className={profit > 0 ? "text-green-700 font-medium" : "text-red-600 font-medium"}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              notation: "compact",
            }).format(profit)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#32363A" }}>Job Orders</h1>
          <p className="text-[13px]" style={{ color: "#6A6D70" }}>
            Kelola semua job order pengiriman
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[12px] h-8">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Link href="/job-orders/new">
            <Button size="sm" className="text-[12px] h-8" style={{ background: "#0070F2" }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Buat Job Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Bar (SAP-style) */}
      <div
        className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 rounded-lg border"
        style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6A6D70]" />
          <Input
            placeholder="Cari nomor JO, pelanggan..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-8 text-[13px] border-[#D1D2D4]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter || "all"} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-[140px] h-8 text-[12px] border-[#D1D2D4]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="INVOICED">Invoiced</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={serviceTypeFilter || "all"} onValueChange={(v) => { setServiceTypeFilter(v === "all" ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-[140px] h-8 text-[12px] border-[#D1D2D4]">
              <SelectValue placeholder="Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="SEA_IMPORT">Sea Import</SelectItem>
              <SelectItem value="SEA_EXPORT">Sea Export</SelectItem>
              <SelectItem value="AIR_IMPORT">Air Import</SelectItem>
              <SelectItem value="AIR_EXPORT">Air Export</SelectItem>
              <SelectItem value="DOMESTIC">Domestik</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={page}
        pageSize={20}
        totalPages={data?.totalPages || 1}
        isLoading={isLoading}
        emptyMessage="Belum ada job order"
        onPageChange={setPage}
        selectable
        compact
      />
    </div>
  );
}
