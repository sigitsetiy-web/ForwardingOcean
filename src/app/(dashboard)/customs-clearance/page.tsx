"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { DataTable, DataColumn } from "@/components/shared/data-table";

const jalurColors: Record<string, string> = {
  HIJAU: "bg-green-50 text-green-700 border-green-200",
  KUNING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  MERAH: "bg-red-50 text-red-700 border-red-200",
  MITA: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function CustomsClearancePage() {
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("");
  const [jalurPabean, setJalurPabean] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["customs-clearance", { search, direction, jalurPabean, page }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (search) params.set("search", search);
      if (direction) params.set("direction", direction);
      if (jalurPabean) params.set("jalurPabean", jalurPabean);
      const res = await fetch(`/api/customs-clearance?${params}`);
      return res.json();
    },
  });

  const columns: DataColumn[] = [
    {
      key: "jobOrder",
      label: "Job Order",
      sortable: true,
      width: "170px",
      render: (row) => {
        const jo = row.jobOrder as Record<string, unknown> | undefined;
        return jo?.id ? (
          <Link href={`/job-orders/${jo.id}`} className="font-semibold text-[#0070F2] hover:underline">
            {String(jo.number || "-")}
          </Link>
        ) : <span>-</span>;
      },
    },
    {
      key: "customer",
      label: "Pelanggan",
      render: (row) => {
        const jo = row.jobOrder as Record<string, unknown> | undefined;
        const cust = jo?.customer as Record<string, string> | undefined;
        return <span className="font-medium">{cust?.name || "-"}</span>;
      },
    },
    {
      key: "direction",
      label: "Direction",
      width: "90px",
      render: (row) => <span className="capitalize text-[12px]">{String(row.direction || "-")}</span>,
    },
    {
      key: "pibNumber",
      label: "PIB / PEB",
      width: "140px",
      render: (row) => (
        <span className="font-mono text-[11px]">
          {(row.pibNumber as string) || (row.pebNumber as string) || "-"}
        </span>
      ),
    },
    {
      key: "sppbNumber",
      label: "SPPB / NPE",
      width: "140px",
      render: (row) => (
        <span className="font-mono text-[11px]">
          {(row.sppbNumber as string) || (row.npeNumber as string) || "-"}
        </span>
      ),
    },
    {
      key: "jalurPabean",
      label: "Jalur",
      width: "90px",
      render: (row) =>
        row.jalurPabean ? (
          <Badge className={`text-[10px] border font-medium ${jalurColors[String(row.jalurPabean)] || ""}`} variant="secondary">
            {String(row.jalurPabean)}
          </Badge>
        ) : <span className="text-[#D1D2D4]">—</span>,
    },
    {
      key: "statusClearance",
      label: "Status",
      width: "130px",
      render: (row) => <span className="text-[12px]">{String(row.statusClearance || "-")}</span>,
    },
    {
      key: "kantorPabean",
      label: "Kantor Pabean",
      render: (row) => <span className="text-[12px]">{String(row.kantorPabean || "-")}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#32363A" }}>Custom Clearance</h1>
        <p className="text-[13px]" style={{ color: "#6A6D70" }}>
          Pantau data PIB, PEB, jalur pabean, dan status clearance per job order
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 rounded-lg border" style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6A6D70]" />
          <Input
            placeholder="Cari JO, customer, PIB, PEB..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-8 text-[13px] border-[#D1D2D4]"
          />
        </div>
        <Select value={direction || "all"} onValueChange={(v) => { setDirection(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[130px] h-8 text-[12px] border-[#D1D2D4]">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="import">Import</SelectItem>
            <SelectItem value="export">Export</SelectItem>
            <SelectItem value="local">Local</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jalurPabean || "all"} onValueChange={(v) => { setJalurPabean(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[130px] h-8 text-[12px] border-[#D1D2D4]">
            <SelectValue placeholder="Jalur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jalur</SelectItem>
            <SelectItem value="HIJAU">Hijau</SelectItem>
            <SelectItem value="KUNING">Kuning</SelectItem>
            <SelectItem value="MERAH">Merah</SelectItem>
            <SelectItem value="MITA">MITA</SelectItem>
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
        emptyMessage="Belum ada data custom clearance"
        onPageChange={setPage}
        compact
      />
    </div>
  );
}
