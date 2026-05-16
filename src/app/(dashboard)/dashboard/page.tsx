"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Building2,
} from "lucide-react";
import Link from "next/link";

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardPage() {
  const { user } = useCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user?.branchId],
    queryFn: async () => {
      const params = new URLSearchParams();
      // Non-owner users only see their branch
      if (user?.branchId && user?.role !== "OWNER" && user?.role !== "ADMIN") {
        params.set("branchId", user.branchId);
      }
      const res = await fetch(`/api/dashboard?${params}`);
      return res.json();
    },
    enabled: !!user,
  });

  const dashboard = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Selamat datang, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Berikut ringkasan aktivitas hari ini.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Job Order Aktif
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.kpiCards?.activeJobOrders ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Status Confirmed & In Progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue Bulan Ini
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboard?.kpiCards?.revenueThisMonth ?? 0)}
            </div>
            <p
              className={`text-xs ${
                (dashboard?.kpiCards?.revenueGrowth ?? 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {(dashboard?.kpiCards?.revenueGrowth ?? 0) >= 0 ? "+" : ""}
              {(dashboard?.kpiCards?.revenueGrowth ?? 0).toFixed(1)}% dari bulan
              lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profit Margin
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(dashboard?.kpiCards?.avgProfitMargin ?? 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Rata-rata bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.kpiCards?.pendingApprovals ?? 0}
            </div>
            <p className="text-xs text-amber-600">Menunggu persetujuan</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Job Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Job Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Order Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboard?.recentJobOrders?.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Belum ada job order
                </p>
              ) : (
                dashboard?.recentJobOrders?.map(
                  (jo: Record<string, unknown>) => (
                    <Link
                      key={jo.id as string}
                      href={`/job-orders/${jo.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {jo.number as string}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {
                            (jo.customer as Record<string, string>)?.name
                          }{" "}
                          •{" "}
                          {(jo.serviceType as string).replace("_", " ")}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          (jo.status as string) === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : (jo.status as string) === "IN_PROGRESS"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {(jo.status as string).replace("_", " ")}
                      </Badge>
                    </Link>
                  )
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Perhatian Diperlukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(dashboard?.alerts?.documentsApproachingDeadline?.length ?? 0) >
                0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Dokumen Belum Upload</p>
                    <p className="text-xs text-muted-foreground">
                      {
                        dashboard.alerts.documentsApproachingDeadline.length
                      }{" "}
                      dokumen mendekati deadline
                    </p>
                  </div>
                </div>
              )}

              {(dashboard?.alerts?.completedNotInvoiced?.length ?? 0) > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50">
                  <Clock className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Belum Diinvoice</p>
                    <p className="text-xs text-muted-foreground">
                      {dashboard.alerts.completedNotInvoiced.length} JO selesai
                      tapi belum diinvoice &gt; 3 hari
                    </p>
                  </div>
                </div>
              )}

              {(dashboard?.alerts?.invoicesPastDue?.length ?? 0) > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-red-50">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Invoice Overdue</p>
                    <p className="text-xs text-muted-foreground">
                      {dashboard.alerts.invoicesPastDue.length} invoice melewati
                      jatuh tempo
                    </p>
                  </div>
                </div>
              )}

              {(dashboard?.alerts?.etdEtaToday?.length ?? 0) > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">ETD/ETA Hari Ini</p>
                    <p className="text-xs text-muted-foreground">
                      {dashboard.alerts.etdEtaToday.length} shipment
                      dijadwalkan hari ini
                    </p>
                  </div>
                </div>
              )}

              {!dashboard?.alerts?.documentsApproachingDeadline?.length &&
                !dashboard?.alerts?.completedNotInvoiced?.length &&
                !dashboard?.alerts?.invoicesPastDue?.length &&
                !dashboard?.alerts?.etdEtaToday?.length && (
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Semua Baik</p>
                      <p className="text-xs text-muted-foreground">
                        Tidak ada alert yang memerlukan perhatian
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch Summary (Owner only) */}
      {dashboard?.branchSummary?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Ringkasan Per Cabang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboard.branchSummary.map(
                (branch: Record<string, unknown>) => (
                  <div
                    key={branch.branchId as string}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {branch.branchName as string}
                      </span>
                      <Badge variant="outline">
                        {branch.branchCode as string}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">JO Aktif</p>
                        <p className="font-medium">
                          {branch.activeOrders as number}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium">
                          {formatCurrency(
                            branch.revenueThisMonth as number
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
