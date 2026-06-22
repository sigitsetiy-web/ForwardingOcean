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
  REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  SENT: "bg-purple-50 text-purple-700 border-purple-200",
  ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  EXPIRED: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function QuotationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["quotations", { search, status: statusFilter, page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "20",
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/quotations?${params}`);
      return res.json();
    },
  });

  const columns: DataColumn[] = [
    {
      key: "number",
      label: "No. Quotation",
      sortable: true,
      width: "180px",
      render: (row) => (
        <Link
          href={`/quotations/${row.id}`}
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
          {(row.serviceType as string).replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "route",
      label: "Rute",
      render: (row) => (
        <span className="text-[12px]">
          {row.origin as string} → {row.destination as string}
        </span>
      ),
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
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: (row.currency as string) || "IDR",
              minimumFractionDigits: 0,
            }).format(Number(row.totalAmount))}
          </span>
        ) : (
          <span className="text-[#D1D2D4]">—</span>
        ),
    },
    {
      key: "validUntil",
      label: "Berlaku s/d",
      width: "110px",
      sortable: true,
      render: (row) => (
        <span className="text-[12px] tabular-nums">
          {new Date(row.validUntil as string).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      width: "110px",
      render: (row) => (
        <Badge
          className={`text-[11px] border font-medium ${statusColors[row.status as string] || ""}`}
          variant="secondary"
        >
          {row.status as string}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#32363A" }}>Quotation</h1>
          <p className="text-[13px]" style={{ color: "#6A6D70" }}>
            Kelola penawaran harga ke pelanggan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[12px] h-8">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Link href="/quotations/new">
            <Button size="sm" className="text-[12px] h-8" style={{ background: "#0070F2" }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Buat Quotation
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 rounded-lg border"
        style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6A6D70]" />
          <Input
            placeholder="Cari nomor quotation, pelanggan..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-8 text-[13px] border-[#D1D2D4]"
          />
        </div>
        <Select value={statusFilter || "all"} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[150px] h-8 text-[12px] border-[#D1D2D4]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="REVIEW">Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
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
        emptyMessage="Belum ada quotation"
        onPageChange={setPage}
        selectable
        compact
      />
    </div>
  );
}
