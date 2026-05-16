"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, RefreshCw, Globe } from "lucide-react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  // Fetch customers directly from Accurate Online
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["ao-customers", search, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "20",
      });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pelanggan</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            Data pelanggan dari Accurate Online
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama pelanggan..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Cari
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {isError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-800">
              {(error as Error).message}. Pastikan Accurate Online sudah dikonfigurasi di{" "}
              <a href="/settings/accurate-online" className="underline font-medium">
                Pengaturan
              </a>.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>NPWP</TableHead>
                <TableHead>Alamat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Mengambil data dari Accurate Online...</p>
                  </TableCell>
                </TableRow>
              ) : !data?.data || data.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {isError ? "Gagal mengambil data" : "Tidak ada data pelanggan"}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((customer: Record<string, unknown>) => (
                  <TableRow key={String(customer.id)}>
                    <TableCell className="font-mono text-sm">
                      <Badge variant="outline">{(customer.customerNo as string) || "-"}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {customer.name as string}
                    </TableCell>
                    <TableCell>{(customer.mobilePhone as string) || "-"}</TableCell>
                    <TableCell>{(customer.email as string) || "-"}</TableCell>
                    <TableCell className="text-xs">{(customer.npwpNo as string) || "-"}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {(customer.billStreet as string) || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.total ? `Total: ${data.total} pelanggan` : ""}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground flex items-center px-2">
            Hal. {page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!data?.data || data.data.length < 20}
            onClick={() => setPage(page + 1)}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
