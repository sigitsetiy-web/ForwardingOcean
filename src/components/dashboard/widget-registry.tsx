"use client";

import { Package, DollarSign, TrendingUp, Clock, AlertTriangle, CheckCircle, Building2, BarChart3, PieChart, Activity, Truck, FileText, Users } from "lucide-react";

export interface WidgetDef {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  size: "sm" | "md" | "lg" | "full"; // grid column span
  roles: string[]; // which roles can see this
  category: "kpi" | "chart" | "list" | "alert";
}

export const WIDGET_REGISTRY: WidgetDef[] = [
  // KPI Widgets (all roles)
  { id: "kpi-active-jo", title: "Job Order Aktif", description: "Jumlah JO yang sedang berjalan", icon: Package, size: "sm", roles: ["ALL"], category: "kpi" },
  { id: "kpi-revenue", title: "Revenue Bulan Ini", description: "Total pendapatan bulan berjalan", icon: DollarSign, size: "sm", roles: ["OWNER", "BRANCH_MANAGER", "FINANCE"], category: "kpi" },
  { id: "kpi-profit-margin", title: "Profit Margin", description: "Rata-rata margin profit", icon: TrendingUp, size: "sm", roles: ["OWNER", "BRANCH_MANAGER", "FINANCE"], category: "kpi" },
  { id: "kpi-pending-approval", title: "Pending Approval", description: "Dokumen menunggu persetujuan", icon: Clock, size: "sm", roles: ["ALL"], category: "kpi" },
  { id: "kpi-total-customer", title: "Total Pelanggan", description: "Jumlah pelanggan aktif", icon: Users, size: "sm", roles: ["OWNER", "SALES", "CRM", "MARKETING"], category: "kpi" },
  { id: "kpi-outstanding-ar", title: "Outstanding AR", description: "Piutang belum dibayar", icon: DollarSign, size: "sm", roles: ["OWNER", "FINANCE"], category: "kpi" },

  // Chart Widgets (Owner/Manager/Finance)
  { id: "chart-revenue-monthly", title: "Revenue Bulanan", description: "Grafik pendapatan per bulan", icon: BarChart3, size: "lg", roles: ["OWNER", "BRANCH_MANAGER", "FINANCE"], category: "chart" },
  { id: "chart-profit-trend", title: "Trend Profit", description: "Grafik profit margin trend", icon: TrendingUp, size: "lg", roles: ["OWNER", "BRANCH_MANAGER", "FINANCE"], category: "chart" },
  { id: "chart-service-type", title: "Distribusi Layanan", description: "Pie chart jenis layanan", icon: PieChart, size: "md", roles: ["OWNER", "BRANCH_MANAGER"], category: "chart" },
  { id: "chart-branch-compare", title: "Perbandingan Cabang", description: "Revenue per cabang", icon: Building2, size: "lg", roles: ["OWNER"], category: "chart" },
  { id: "chart-customer-top", title: "Top 5 Customer", description: "Customer dengan revenue tertinggi", icon: Users, size: "md", roles: ["OWNER", "BRANCH_MANAGER", "SALES"], category: "chart" },
  { id: "chart-jo-status", title: "Status JO", description: "Distribusi status job order", icon: PieChart, size: "md", roles: ["ALL"], category: "chart" },

  // List Widgets
  { id: "list-recent-jo", title: "JO Terbaru", description: "5 job order terakhir dibuat", icon: Package, size: "md", roles: ["ALL"], category: "list" },
  { id: "list-alerts", title: "Perhatian Diperlukan", description: "Alert & reminder penting", icon: AlertTriangle, size: "md", roles: ["ALL"], category: "alert" },
  { id: "list-branch-summary", title: "Ringkasan Cabang", description: "Performa per cabang", icon: Building2, size: "full", roles: ["OWNER"], category: "list" },
  { id: "list-upcoming-eta", title: "ETA Mendatang", description: "Shipment yang akan tiba", icon: Truck, size: "md", roles: ["ALL"], category: "list" },
  { id: "list-overdue-invoice", title: "Invoice Overdue", description: "Invoice melewati jatuh tempo", icon: FileText, size: "md", roles: ["OWNER", "FINANCE"], category: "list" },
];

// Default widget layout per role
export function getDefaultWidgets(role: string): string[] {
  switch (role) {
    case "OWNER":
      return ["kpi-active-jo", "kpi-revenue", "kpi-profit-margin", "kpi-pending-approval", "chart-revenue-monthly", "chart-service-type", "chart-branch-compare", "chart-customer-top", "list-recent-jo", "list-alerts", "list-branch-summary"];
    case "BRANCH_MANAGER":
      return ["kpi-active-jo", "kpi-revenue", "kpi-profit-margin", "kpi-pending-approval", "chart-revenue-monthly", "chart-service-type", "list-recent-jo", "list-alerts"];
    case "FINANCE":
      return ["kpi-revenue", "kpi-profit-margin", "kpi-outstanding-ar", "kpi-pending-approval", "chart-revenue-monthly", "chart-profit-trend", "list-overdue-invoice", "list-alerts"];
    case "SALES":
    case "MARKETING":
    case "CRM":
      return ["kpi-active-jo", "kpi-total-customer", "kpi-pending-approval", "chart-customer-top", "list-recent-jo", "list-alerts"];
    default:
      return ["kpi-active-jo", "kpi-pending-approval", "list-recent-jo", "list-alerts", "list-upcoming-eta"];
  }
}

export function canAccessWidget(widgetId: string, role: string): boolean {
  const widget = WIDGET_REGISTRY.find((w) => w.id === widgetId);
  if (!widget) return false;
  return widget.roles.includes("ALL") || widget.roles.includes(role);
}
