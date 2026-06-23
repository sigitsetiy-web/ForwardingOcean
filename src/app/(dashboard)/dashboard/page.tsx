"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Package, DollarSign, TrendingUp, Clock, AlertTriangle, CheckCircle,
  Building2, Users, Plus, X, Settings2, GripVertical, Truck, FileText,
} from "lucide-react";
import Link from "next/link";
import { WIDGET_REGISTRY, getDefaultWidgets, canAccessWidget } from "@/components/dashboard/widget-registry";
import {
  ChartRevenueMonthly, ChartProfitTrend, ChartServiceType,
  ChartBranchCompare, ChartCustomerTop, ChartJOStatus,
} from "@/components/dashboard/chart-widgets";

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}K`;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [showWidgetPanel, setShowWidgetPanel] = useState(false);

  // Load user widget preferences from localStorage
  useEffect(() => {
    if (user) {
      const key = `dashboard_widgets_${user.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setActiveWidgets(JSON.parse(saved));
      } else {
        setActiveWidgets(getDefaultWidgets(user.role));
      }
    }
  }, [user]);

  // Save widget preferences
  const saveWidgets = (widgets: string[]) => {
    setActiveWidgets(widgets);
    if (user) {
      localStorage.setItem(`dashboard_widgets_${user.id}`, JSON.stringify(widgets));
    }
  };

  const addWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      saveWidgets([...activeWidgets, widgetId]);
    }
  };

  const removeWidget = (widgetId: string) => {
    saveWidgets(activeWidgets.filter((w) => w !== widgetId));
  };

  const resetToDefault = () => {
    if (user) saveWidgets(getDefaultWidgets(user.role));
  };

  // Fetch dashboard data
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user?.branchId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (user?.branchId && user?.role !== "OWNER" && user?.role !== "ADMIN") {
        params.set("branchId", user.branchId);
      }
      const res = await fetch(`/api/dashboard?${params}`);
      return res.json();
    },
    enabled: !!user,
  });

  const dashboard = data?.data || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-[#0070F2] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#32363A" }}>
            Selamat datang, {user?.name}
          </h1>
          <p className="text-[13px]" style={{ color: "#6A6D70" }}>
            Dashboard personal — sesuaikan widget sesuai kebutuhan Anda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[12px] h-8" onClick={resetToDefault}>
            Reset Default
          </Button>
          <Button size="sm" className="text-[12px] h-8" style={{ background: "#0070F2" }} onClick={() => setShowWidgetPanel(!showWidgetPanel)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Tambah Widget
          </Button>
        </div>
      </div>

      {/* Widget Selector Panel */}
      {showWidgetPanel && (
        <Card className="border-[#0070F2]">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-[14px]">Pilih Widget</CardTitle>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowWidgetPanel(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {WIDGET_REGISTRY.filter((w) => canAccessWidget(w.id, user?.role || "")).map((widget) => {
                const isActive = activeWidgets.includes(widget.id);
                const Icon = widget.icon;
                return (
                  <button
                    key={widget.id}
                    onClick={() => isActive ? removeWidget(widget.id) : addWidget(widget.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${isActive ? "border-[#0070F2] bg-[#E8F4FD]" : "border-[#E5E7EB] hover:border-[#0070F2] hover:bg-[#F8F9FA]"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4" style={{ color: isActive ? "#0070F2" : "#6A6D70" }} />
                      {isActive && <CheckCircle className="h-3.5 w-3.5 text-[#0070F2] ml-auto" />}
                    </div>
                    <p className="text-[11px] font-medium" style={{ color: "#32363A" }}>{widget.title}</p>
                    <p className="text-[10px]" style={{ color: "#6A6D70" }}>{widget.description}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Row */}
      {activeWidgets.some((w) => w.startsWith("kpi-")) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {activeWidgets.includes("kpi-active-jo") && (
            <KpiCard title="JO Aktif" value={String(dashboard?.kpiCards?.activeJobOrders ?? 0)} icon={<Package className="h-4 w-4" />} sub="Confirmed & In Progress" color="#0070F2" onRemove={() => removeWidget("kpi-active-jo")} />
          )}
          {activeWidgets.includes("kpi-revenue") && (
            <KpiCard title="Revenue" value={formatCurrency(dashboard?.kpiCards?.revenueThisMonth ?? 0)} icon={<DollarSign className="h-4 w-4" />} sub={`${(dashboard?.kpiCards?.revenueGrowth ?? 0) >= 0 ? "+" : ""}${(dashboard?.kpiCards?.revenueGrowth ?? 0).toFixed(1)}% MoM`} color="#107E3E" onRemove={() => removeWidget("kpi-revenue")} />
          )}
          {activeWidgets.includes("kpi-profit-margin") && (
            <KpiCard title="Profit Margin" value={`${(dashboard?.kpiCards?.avgProfitMargin ?? 0).toFixed(1)}%`} icon={<TrendingUp className="h-4 w-4" />} sub="Rata-rata bulan ini" color="#E78C07" onRemove={() => removeWidget("kpi-profit-margin")} />
          )}
          {activeWidgets.includes("kpi-pending-approval") && (
            <KpiCard title="Pending Approval" value={String(dashboard?.kpiCards?.pendingApprovals ?? 0)} icon={<Clock className="h-4 w-4" />} sub="Menunggu persetujuan" color="#BB0000" onRemove={() => removeWidget("kpi-pending-approval")} />
          )}
          {activeWidgets.includes("kpi-total-customer") && (
            <KpiCard title="Pelanggan" value="5" icon={<Users className="h-4 w-4" />} sub="Customer aktif" color="#8B5CF6" onRemove={() => removeWidget("kpi-total-customer")} />
          )}
          {activeWidgets.includes("kpi-outstanding-ar") && (
            <KpiCard title="Outstanding AR" value={formatCurrency(dashboard?.kpiCards?.outstandingAR ?? 0)} icon={<DollarSign className="h-4 w-4" />} sub="Piutang belum dibayar" color="#BB0000" onRemove={() => removeWidget("kpi-outstanding-ar")} />
          )}
        </div>
      )}

      {/* Charts & Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeWidgets.includes("chart-revenue-monthly") && <ChartRevenueMonthly data={dashboard} />}
        {activeWidgets.includes("chart-profit-trend") && <ChartProfitTrend data={dashboard} />}
        {activeWidgets.includes("chart-service-type") && <ChartServiceType data={dashboard} />}
        {activeWidgets.includes("chart-jo-status") && <ChartJOStatus data={dashboard} />}
        {activeWidgets.includes("chart-branch-compare") && <ChartBranchCompare data={dashboard} />}
        {activeWidgets.includes("chart-customer-top") && <ChartCustomerTop data={dashboard} />}

        {/* Recent JO */}
        {activeWidgets.includes("list-recent-jo") && (
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-[14px] font-semibold">JO Terbaru</CardTitle>
              <button onClick={() => removeWidget("list-recent-jo")} className="p-1 rounded hover:bg-gray-100"><X className="h-3.5 w-3.5 text-[#6A6D70]" /></button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(dashboard?.recentJobOrders || []).length === 0 ? (
                  <p className="text-center text-[12px] py-4" style={{ color: "#6A6D70" }}>Belum ada JO</p>
                ) : (
                  (dashboard?.recentJobOrders || []).slice(0, 5).map((jo: Record<string, unknown>) => (
                    <Link key={jo.id as string} href={`/job-orders/${jo.id}`} className="flex items-center justify-between p-2.5 rounded-lg border hover:bg-[#F8F9FA] transition-colors" style={{ borderColor: "#E5E7EB" }}>
                      <div>
                        <p className="text-[12px] font-semibold" style={{ color: "#0070F2" }}>{jo.number as string}</p>
                        <p className="text-[11px]" style={{ color: "#6A6D70" }}>{(jo.customer as Record<string, string>)?.name} • {(jo.serviceType as string)?.replace("_", " ")}</p>
                      </div>
                      <Badge variant="secondary" className={`text-[10px] ${(jo.status as string) === "COMPLETED" ? "bg-green-50 text-green-700" : (jo.status as string) === "IN_PROGRESS" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                        {(jo.status as string)?.replace("_", " ")}
                      </Badge>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerts */}
        {activeWidgets.includes("list-alerts") && (
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-[14px] font-semibold">Perhatian Diperlukan</CardTitle>
              <button onClick={() => removeWidget("list-alerts")} className="p-1 rounded hover:bg-gray-100"><X className="h-3.5 w-3.5 text-[#6A6D70]" /></button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(dashboard?.alerts?.completedNotInvoiced?.length ?? 0) > 0 && (
                  <AlertItem icon={<Clock className="h-4 w-4 text-amber-600" />} title="Belum Diinvoice" desc={`${dashboard.alerts.completedNotInvoiced.length} JO selesai tapi belum diinvoice`} color="amber" />
                )}
                {(dashboard?.alerts?.invoicesPastDue?.length ?? 0) > 0 && (
                  <AlertItem icon={<AlertTriangle className="h-4 w-4 text-red-600" />} title="Invoice Overdue" desc={`${dashboard.alerts.invoicesPastDue.length} invoice melewati jatuh tempo`} color="red" />
                )}
                {(dashboard?.alerts?.etdEtaToday?.length ?? 0) > 0 && (
                  <AlertItem icon={<Truck className="h-4 w-4 text-blue-600" />} title="ETD/ETA Hari Ini" desc={`${dashboard.alerts.etdEtaToday.length} shipment dijadwalkan hari ini`} color="blue" />
                )}
                {!dashboard?.alerts?.completedNotInvoiced?.length && !dashboard?.alerts?.invoicesPastDue?.length && !dashboard?.alerts?.etdEtaToday?.length && (
                  <AlertItem icon={<CheckCircle className="h-4 w-4 text-green-600" />} title="Semua Baik" desc="Tidak ada alert" color="green" />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming ETA */}
        {activeWidgets.includes("list-upcoming-eta") && (
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-[14px] font-semibold">ETA Mendatang</CardTitle>
              <button onClick={() => removeWidget("list-upcoming-eta")} className="p-1 rounded hover:bg-gray-100"><X className="h-3.5 w-3.5 text-[#6A6D70]" /></button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(dashboard?.recentJobOrders || []).filter((jo: Record<string, unknown>) => jo.eta).slice(0, 4).map((jo: Record<string, unknown>) => (
                  <div key={jo.id as string} className="flex items-center justify-between p-2 rounded border" style={{ borderColor: "#E5E7EB" }}>
                    <div>
                      <p className="text-[12px] font-medium" style={{ color: "#32363A" }}>{jo.number as string}</p>
                      <p className="text-[10px]" style={{ color: "#6A6D70" }}>{(jo.customer as Record<string, string>)?.name}</p>
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: "#0070F2" }}>
                      {new Date(jo.eta as string).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overdue Invoice */}
        {activeWidgets.includes("list-overdue-invoice") && (
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-[14px] font-semibold">Invoice Overdue</CardTitle>
              <button onClick={() => removeWidget("list-overdue-invoice")} className="p-1 rounded hover:bg-gray-100"><X className="h-3.5 w-3.5 text-[#6A6D70]" /></button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(dashboard?.alerts?.invoicesPastDue || []).length === 0 ? (
                  <p className="text-center text-[12px] py-4" style={{ color: "#6A6D70" }}>Tidak ada invoice overdue 👍</p>
                ) : (
                  (dashboard?.alerts?.invoicesPastDue || []).slice(0, 5).map((inv: Record<string, unknown>) => (
                    <div key={inv.id as string} className="flex items-center justify-between p-2 rounded border border-red-100 bg-red-50">
                      <p className="text-[12px] font-medium text-red-800">{inv.number as string}</p>
                      <span className="text-[11px] text-red-600">{formatCurrency(Number(inv.outstandingAmount || 0))}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Branch Summary (full width) */}
      {activeWidgets.includes("list-branch-summary") && (dashboard?.branchSummary?.length ?? 0) > 0 && (
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-[14px] font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Ringkasan Per Cabang
            </CardTitle>
            <button onClick={() => removeWidget("list-branch-summary")} className="p-1 rounded hover:bg-gray-100"><X className="h-3.5 w-3.5 text-[#6A6D70]" /></button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(dashboard?.branchSummary || []).map((branch: Record<string, unknown>) => (
                <div key={branch.branchId as string} className="border rounded-lg p-4 space-y-2" style={{ borderColor: "#E5E7EB" }}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[13px]">{branch.branchName as string}</span>
                    <Badge variant="outline" className="text-[10px]">{branch.branchCode as string}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div><p style={{ color: "#6A6D70" }}>JO Aktif</p><p className="font-bold">{branch.activeOrders as number}</p></div>
                    <div><p style={{ color: "#6A6D70" }}>Revenue</p><p className="font-bold">{formatCurrency(Number(branch.revenueThisMonth || 0))}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// KPI Card Component
function KpiCard({ title, value, icon, sub, color, onRemove }: {
  title: string; value: string; icon: React.ReactNode; sub: string; color: string; onRemove: () => void;
}) {
  return (
    <Card className="relative group">
      <button onClick={onRemove} className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-opacity">
        <X className="h-3 w-3 text-[#6A6D70]" />
      </button>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: color + "15", color }}>
            {icon}
          </div>
        </div>
        <p className="text-[22px] font-bold" style={{ color: "#32363A" }}>{value}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "#6A6D70" }}>{title}</p>
        <p className="text-[10px]" style={{ color }}>{sub}</p>
      </CardContent>
    </Card>
  );
}

// Alert Item Component
function AlertItem({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  const bgMap: Record<string, string> = { amber: "#FFFBEB", red: "#FEF2F2", blue: "#EFF6FF", green: "#F0FDF4" };
  const borderMap: Record<string, string> = { amber: "#FCD34D", red: "#FECACA", blue: "#BFDBFE", green: "#BBF7D0" };
  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-lg border" style={{ background: bgMap[color], borderColor: borderMap[color] }}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[12px] font-medium" style={{ color: "#32363A" }}>{title}</p>
        <p className="text-[11px]" style={{ color: "#6A6D70" }}>{desc}</p>
      </div>
    </div>
  );
}
