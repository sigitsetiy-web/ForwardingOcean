"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ShieldCheck } from "lucide-react";

const jalurColors: Record<string, string> = {
  HIJAU: "bg-green-100 text-green-800",
  KUNING: "bg-yellow-100 text-yellow-800",
  MERAH: "bg-red-100 text-red-800",
  MITA: "bg-blue-100 text-blue-800",
};

export default function CustomsClearancePage() {
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("");
  const [jalurPabean, setJalurPabean] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["customs-clearance", { search, direction, jalurPabean, page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "20",
      });
      if (search) params.set("search", search);
      if (direction) params.set("direction", direction);
      if (jalurPabean) params.set("jalurPabean", jalurPabean);

      const res = await fetch(`/api/customs-clearance?${params}`);
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            Custom Clearance
          </h1>
          <p className="text-muted-foreground">
            Pantau data PIB, PEB, jalur pabean, dan status clearance per job order
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari JO, customer, PIB, PEB, atau SPPB..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={direction || "all"}
              onValueChange={(v) => {
                setDirection(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Direction</SelectItem>
                <SelectItem value="import">Import</SelectItem>
                <SelectItem value="export">Export</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={jalurPabean || "all"}
              onValueChange={(v) => {
                setJalurPabean(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Jalur Pabean" />
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Order</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>PIB / PEB</TableHead>
                <TableHead>SPPB / NPE</TableHead>
                <TableHead>Jalur</TableHead>
                <TableHead>Status Clearance</TableHead>
                <TableHead>Kantor Pabean</TableHead>
                <TableHead>Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Memuat data custom clearance...
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Belum ada data custom clearance
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((item: Record<string, unknown>) => {
                  const jobOrder = item.jobOrder as Record<string, unknown> | undefined;
                  const customer = jobOrder?.customer as Record<string, unknown> | undefined;
                  const docNumber =
                    (item.pibNumber as string) ||
                    (item.pebNumber as string) ||
                    "-";
                  const releaseNumber =
                    (item.sppbNumber as string) ||
                    (item.npeNumber as string) ||
                    "-";
                  const updatedAt = item.updatedAt as string | undefined;

                  return (
                    <TableRow key={String(item.id)}>
                      <TableCell>
                        {jobOrder?.id ? (
                          <Link
                            href={`/job-orders/${jobOrder.id as string}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {String(jobOrder.number || "-")}
                          </Link>
                        ) : (
                          <span className="font-medium">-</span>
                        )}
                      </TableCell>
                      <TableCell>{String(customer?.name || "-")}</TableCell>
                      <TableCell className="capitalize">
                        {String(item.direction || "-")}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{docNumber}</TableCell>
                      <TableCell className="font-mono text-xs">{releaseNumber}</TableCell>
                      <TableCell>
                        {item.jalurPabean ? (
                          <Badge
                            variant="secondary"
                            className={jalurColors[String(item.jalurPabean)] || ""}
                          >
                            {String(item.jalurPabean)}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{String(item.statusClearance || "-")}</TableCell>
                      <TableCell>{String(item.kantorPabean || "-")}</TableCell>
                      <TableCell>
                        {updatedAt
                          ? new Date(updatedAt).toLocaleDateString("id-ID")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
