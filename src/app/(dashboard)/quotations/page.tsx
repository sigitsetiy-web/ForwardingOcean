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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  SENT: "bg-purple-100 text-purple-800",
  ACCEPTED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED: "bg-slate-100 text-slate-800",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quotation</h1>
          <p className="text-muted-foreground">
            Kelola penawaran harga ke pelanggan
          </p>
        </div>
        <Link href="/quotations/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Buat Quotation
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nomor quotation, pelanggan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[180px]">
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Quotation</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Jenis Layanan</TableHead>
                <TableHead>Rute</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Berlaku s/d</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Belum ada quotation
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((qt: Record<string, unknown>) => (
                  <TableRow key={qt.id as string}>
                    <TableCell>
                      <Link
                        href={`/quotations/${qt.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {qt.number as string}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {(qt.customer as Record<string, string>)?.name}
                    </TableCell>
                    <TableCell>{qt.serviceType as string}</TableCell>
                    <TableCell>
                      {qt.origin as string} → {qt.destination as string}
                    </TableCell>
                    <TableCell>
                      {qt.totalAmount
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: (qt.currency as string) || "IDR",
                            minimumFractionDigits: 0,
                          }).format(Number(qt.totalAmount))
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(qt.validUntil as string).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={statusColors[qt.status as string] || ""}
                        variant="secondary"
                      >
                        {qt.status as string}
                      </Badge>
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
