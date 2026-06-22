"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Globe } from "lucide-react";
import { DataTable, DataColumn } from "@/components/shared/data-table";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["ao-customers", search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (search) params.set("keyword", search);
      const res = await fetch(`/api/accurate-online/customers?${params}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengambil data pelanggan");
      }
      return res.json();
    },
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const columns: DataColumn[] = [
    {
      key: "customerNo",
      label: "Kode",
      width: "100px",
      render: (row) => (
        <Badge variant="outline" className="font-mono text-[10px]">
          {(row.customerNo as string) || "-"}
        </Badge>
      ),
    },
    {
      key: "name",
      label: "Nama",
      sortable: true,
      render: (row) => <span className="font-medium">{row.name as string}</span>,
    },
    {
      key: "mobilePhone",
      label: "Telepon",
      width: "130px",
      render: (row) => <span className="text-[12px]">{(row.mobilePhone as string) || "-"}</span>,
    },
    {
      key: "email",
      label: "Email",
      width: "180px",
      render: (row) => <span className="text-[12px]">{(row.email as string) || "-"}</span>,
    },
    {
      key: "npwpNo",
      label: "NPWP",
      width: "150px",
      render: (row) => <span className="font-mono text-[11px]">{(row.npwpNo as string) || "-"}</span>,
    },
    {
      key: "billStreet",
      label: "Alamat",
      render: (row) => (
        <span className="text-[12px] line-clamp-1">{(row.billStreet as string) || "-"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#32363A" }}>Pelanggan</h1>
          <p className="text-[13px] flex items-center gap-1" style={{ color: "#6A6D70" }}>
            <Globe className="h-3.5 w-3.5" />
            Data pelanggan dari Accurate Online
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-[12px] h-8"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6A6D70]" />
          <Input
            placeholder="Cari nama pelanggan..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 h-8 text-[13px] border-[#D1D2D4]"
          />
        </div>
        <Button onClick={handleSearch} size="sm" className="h-8 text-[12px]" style={{ background: "#0070F2" }}>
          <Search className="h-3.5 w-3.5 mr-1.5" />
          Cari
        </Button>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-[13px] text-red-800">
            {(error as Error).message}. Pastikan Accurate Online sudah dikonfigurasi di{" "}
            <a href="/settings/accurate-online" className="underline font-medium">Pengaturan</a>.
          </p>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={page}
        pageSize={20}
        totalPages={Math.ceil((data?.total || 0) / 20) || 1}
        isLoading={isLoading}
        emptyMessage={isError ? "Gagal mengambil data" : "Tidak ada data pelanggan"}
        onPageChange={setPage}
        compact
      />
    </div>
  );
}
