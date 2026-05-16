"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { ArrowLeft, ArrowDownLeft, Search } from "lucide-react";
import Link from "next/link";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ReceivablesPage() {
  const [search, setSearch] = useState("");

  // Fetch job orders that have been invoiced (receivables)
  const { data, isLoading } = useQuery({
    queryKey: ["receivables", search],
    queryFn: async () => {
      const params = new URLSearchParams({ status: "INVOICED", pageSize: "50" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/job-orders?${params}`);
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/finance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ArrowDownLeft className="h-6 w-6 text-green-600" />
            Penerimaan dari Pelanggan
          </h1>
          <p className="text-muted-foreground">
            Daftar invoice yang menunggu pembayaran dari pelanggan
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nomor JO atau pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Belum Dibayar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. JO</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Cabang</TableHead>
                <TableHead className="text-right">Total Invoice</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Memuat data...</TableCell>
                </TableRow>
              ) : !data?.data || data.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Tidak ada invoice yang menunggu pembayaran
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((jo: Record<string, unknown>) => (
                  <TableRow key={jo.id as string}>
                    <TableCell className="font-mono text-sm font-medium">
                      {jo.number as string}
                    </TableCell>
                    <TableCell>{(jo.customer as Record<string, string>)?.name}</TableCell>
                    <TableCell>{(jo.branch as Record<string, string>)?.name}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(Number(jo.totalRevenue || 0))}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-800">INVOICED</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
