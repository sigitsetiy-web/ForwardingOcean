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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-green-100 text-green-800",
  INVOICED: "bg-purple-100 text-purple-800",
  CLOSED: "bg-slate-100 text-slate-800",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Orders</h1>
          <p className="text-muted-foreground">
            Kelola semua job order pengiriman
          </p>
        </div>
        <Link href="/job-orders/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Buat Job Order
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nomor JO, pelanggan..."
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
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="INVOICED">Invoiced</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceTypeFilter || "all"} onValueChange={(v) => setServiceTypeFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Jenis Layanan" />
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
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. JO</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Cabang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ETD</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead className="text-right">Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Belum ada job order
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((jo: Record<string, unknown>) => (
                  <TableRow key={jo.id as string}>
                    <TableCell>
                      <Link
                        href={`/job-orders/${jo.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {jo.number as string}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {(jo.customer as Record<string, string>)?.name}
                    </TableCell>
                    <TableCell>
                      {serviceTypeLabels[jo.serviceType as string] || String(jo.serviceType)}
                    </TableCell>
                    <TableCell>
                      {(jo.branch as Record<string, string>)?.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusColors[jo.status as string] || "bg-gray-100"
                        }
                        variant="secondary"
                      >
                        {(jo.status as string).replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {jo.etd
                        ? new Date(jo.etd as string).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {jo.eta
                        ? new Date(jo.eta as string).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(jo.grossProfit || 0) > 0 ? (
                        <span className="text-green-600 font-medium">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(Number(jo.grossProfit))}
                        </span>
                      ) : Number(jo.grossProfit || 0) < 0 ? (
                        <span className="text-red-600 font-medium">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(Number(jo.grossProfit))}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {(page - 1) * 20 + 1} - {Math.min(page * 20, data.total)} dari{" "}
            {data.total} data
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
            <Button
              variant="outline"
              size="sm"
              disabled={page === data.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
