"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  ArrowLeft,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface AOCustomer {
  id: number;
  customerNo: string;
  name: string;
  mobilePhone: string | null;
  email: string | null;
  billStreet: string | null;
  npwpNo: string | null;
}

export default function ImportCustomersPage() {
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState<AOCustomer[]>([]);
  const [page, setPage] = useState(1);

  // Fetch customers from Accurate Online
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["ao-customers", keyword, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "20",
      });
      if (keyword) params.set("keyword", keyword);
      const res = await fetch(`/api/accurate-online/customers?${params}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengambil data dari Accurate Online");
      }
      return res.json();
    },
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/accurate-online/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customers: selected }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Import gagal");
      }
      return res.json();
    },
    onSuccess: () => {
      setSelected([]);
    },
  });

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(1);
  };

  const toggleSelect = (customer: AOCustomer) => {
    setSelected((prev) => {
      const exists = prev.find((c) => c.id === customer.id);
      if (exists) return prev.filter((c) => c.id !== customer.id);
      return [...prev, customer];
    });
  };

  const selectAll = () => {
    if (!data?.data) return;
    const allOnPage = data.data as AOCustomer[];
    const allSelected = allOnPage.every((c) =>
      selected.find((s) => s.id === c.id)
    );
    if (allSelected) {
      setSelected((prev) =>
        prev.filter((s) => !allOnPage.find((c) => c.id === s.id))
      );
    } else {
      setSelected((prev) => {
        const newItems = allOnPage.filter(
          (c) => !prev.find((s) => s.id === c.id)
        );
        return [...prev, ...newItems];
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Import dari Accurate Online</h1>
            <p className="text-muted-foreground">
              Ambil data pelanggan dari Accurate Online ke FMS
            </p>
          </div>
        </div>
        <Button
          onClick={() => importMutation.mutate()}
          disabled={selected.length === 0 || importMutation.isPending}
        >
          <Download className="h-4 w-4 mr-2" />
          {importMutation.isPending
            ? "Mengimport..."
            : `Import ${selected.length} Pelanggan`}
        </Button>
      </div>

      {/* Import Result */}
      {importMutation.data && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-green-800">
                  {importMutation.data.message}
                </p>
                {importMutation.data.imported?.length > 0 && (
                  <p className="text-sm text-green-700">
                    Baru: {importMutation.data.imported.join(", ")}
                  </p>
                )}
                {importMutation.data.errors?.length > 0 && (
                  <p className="text-sm text-red-700">
                    Gagal: {importMutation.data.errors.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {importMutation.isError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">
                {importMutation.error.message}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama pelanggan di Accurate..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Cari
            </Button>
            <Button variant="ghost" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {isError && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">
                  Gagal terhubung ke Accurate Online
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {(error as Error).message}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Pastikan credentials sudah dikonfigurasi di{" "}
                  <Link
                    href="/settings/accurate-online"
                    className="underline font-medium"
                  >
                    Settings → Accurate Online
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Table from Accurate */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>
              Data Pelanggan Accurate Online
              {data?.total ? ` (${data.total} total)` : ""}
            </span>
            {selected.length > 0 && (
              <Badge variant="secondary">
                {selected.length} dipilih
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    className="rounded"
                    onChange={selectAll}
                    checked={
                      data?.data?.length > 0 &&
                      (data.data as AOCustomer[]).every((c) =>
                        selected.find((s) => s.id === c.id)
                      )
                    }
                  />
                </TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>NPWP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Mengambil data dari Accurate Online...
                  </TableCell>
                </TableRow>
              ) : !data?.data || data.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {isError
                      ? "Tidak dapat mengambil data"
                      : "Tidak ada data pelanggan"}
                  </TableCell>
                </TableRow>
              ) : (
                (data.data as AOCustomer[]).map((customer) => (
                  <TableRow
                    key={customer.id}
                    className={
                      selected.find((s) => s.id === customer.id)
                        ? "bg-primary/5"
                        : ""
                    }
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={!!selected.find((s) => s.id === customer.id)}
                        onChange={() => toggleSelect(customer)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {customer.customerNo || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.mobilePhone || "-"}</TableCell>
                    <TableCell>{customer.email || "-"}</TableCell>
                    <TableCell className="text-xs">
                      {customer.npwpNo || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data?.total > 20 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground flex items-center px-3">
            Halaman {page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  );
}
