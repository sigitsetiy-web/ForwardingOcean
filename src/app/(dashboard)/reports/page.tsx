"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { BarChart3, TrendingUp, TrendingDown, Download } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ReportsPage() {
  const { user } = useCurrentUser();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("job_order");
  const [serviceType, setServiceType] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["profitability-report", { startDate, endDate, groupBy, serviceType }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      if (groupBy) params.set("groupBy", groupBy);
      if (serviceType) params.set("serviceType", serviceType);
      if (user?.branchId && user?.role !== "OWNER" && user?.role !== "ADMIN") {
        params.set("branchId", user.branchId);
      }
      const res = await fetch(`/api/reports/profitability?${params}`);
      return res.json();
    },
    enabled: !!user,
  });

  const report = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#32363A" }}>Laporan Profitabilitas</h1>
          <p className="text-[13px]" style={{ color: "#6A6D70" }}>
            Analisis pendapatan, biaya, dan profit per job order
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            const params = new URLSearchParams({ format: "csv" });
            if (startDate) params.set("startDate", startDate);
            if (endDate) params.set("endDate", endDate);
            if (serviceType) params.set("serviceType", serviceType);
            window.open(`/api/reports/export?${params}`, "_blank");
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Dari Tanggal</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sampai Tanggal</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Kelompokkan</Label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job_order">Per Job Order</SelectItem>
                  <SelectItem value="customer">Per Pelanggan</SelectItem>
                  <SelectItem value="branch">Per Cabang</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jenis Layanan</Label>
              <Select value={serviceType || "all"} onValueChange={(v) => setServiceType(v === "all" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="SEA_IMPORT">Sea Import</SelectItem>
                  <SelectItem value="SEA_EXPORT">Sea Export</SelectItem>
                  <SelectItem value="AIR_IMPORT">Air Import</SelectItem>
                  <SelectItem value="AIR_EXPORT">Air Export</SelectItem>
                  <SelectItem value="DOMESTIC">Domestik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {report?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold">
                {formatCurrency(report.summary.totalRevenue)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-xl font-bold">
                {formatCurrency(report.summary.totalCost)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Profit</p>
              <p
                className={`text-xl font-bold ${
                  report.summary.totalProfit >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(report.summary.totalProfit)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg Margin</p>
              <p className="text-xl font-bold">{report.summary.avgMargin}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total JO</p>
              <p className="text-xl font-bold">
                {report.summary.totalJO}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({report.summary.profitable} profit, {report.summary.loss}{" "}
                  rugi)
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grouped Data */}
      {report?.grouped?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Ringkasan per {groupBy === "customer" ? "Pelanggan" : "Cabang"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">JO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.grouped.map((item: Record<string, unknown>) => (
                  <TableRow key={item.id as string}>
                    <TableCell className="font-medium">
                      {item.name as string}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.revenue as number)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.cost as number)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          (item.profit as number) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatCurrency(item.profit as number)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {(item.margin as number).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {item.count as number}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Job Order Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detail Per Job Order</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. JO</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report?.jobOrders?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada data untuk filter yang dipilih
                    </TableCell>
                  </TableRow>
                ) : (
                  report?.jobOrders?.map((jo: Record<string, unknown>) => (
                    <TableRow key={jo.id as string}>
                      <TableCell className="font-mono text-sm">
                        {jo.number as string}
                      </TableCell>
                      <TableCell>{jo.customer as string}</TableCell>
                      <TableCell>{jo.branch as string}</TableCell>
                      <TableCell>
                        {(jo.serviceType as string).replace("_", " ")}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(jo.revenue as number)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(jo.cost as number)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`flex items-center justify-end gap-1 ${
                            (jo.profit as number) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {(jo.profit as number) >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {formatCurrency(jo.profit as number)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {(jo.margin as number).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
