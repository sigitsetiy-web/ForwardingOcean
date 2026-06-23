"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from "recharts";

const COLORS = ["#0070F2", "#107E3E", "#E78C07", "#BB0000", "#8B5CF6", "#06B6D4"];

function formatIDR(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

// Revenue Monthly Bar Chart
export function ChartRevenueMonthly({ data }: { data: Record<string, unknown> }) {
  const chartData = [
    { month: "Jan", revenue: 45000000, cost: 38000000 },
    { month: "Feb", revenue: 52000000, cost: 42000000 },
    { month: "Mar", revenue: 48000000, cost: 40000000 },
    { month: "Apr", revenue: 61000000, cost: 49000000 },
    { month: "Mei", revenue: 55000000, cost: 45000000 },
    { month: "Jun", revenue: Number(data?.kpiCards?.revenueThisMonth || 190300000), cost: Number(data?.kpiCards?.revenueThisMonth || 190300000) * 0.75 },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-semibold" style={{ color: "#32363A" }}>Revenue & Cost Bulanan</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6A6D70" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6A6D70" }} tickFormatter={formatIDR} />
            <Tooltip formatter={(v: number) => `Rp ${v.toLocaleString()}`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="revenue" name="Revenue" fill="#0070F2" radius={[3, 3, 0, 0]} />
            <Bar dataKey="cost" name="Cost" fill="#E5E7EB" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Profit Trend Line Chart
export function ChartProfitTrend({ data }: { data: Record<string, unknown> }) {
  const chartData = [
    { month: "Jan", margin: 15.2 },
    { month: "Feb", margin: 19.1 },
    { month: "Mar", margin: 16.8 },
    { month: "Apr", margin: 19.7 },
    { month: "Mei", margin: 18.2 },
    { month: "Jun", margin: Number(data?.kpiCards?.avgProfitMargin || 12.7) },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-semibold" style={{ color: "#32363A" }}>Trend Profit Margin (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6A6D70" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6A6D70" }} unit="%" />
            <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
            <Area type="monotone" dataKey="margin" stroke="#107E3E" fill="#107E3E" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Service Type Pie Chart
export function ChartServiceType({ data }: { data: Record<string, unknown> }) {
  const chartData = [
    { name: "Sea Import", value: 3 },
    { name: "Sea Export", value: 2 },
    { name: "Air Import", value: 1 },
    { name: "Air Export", value: 0 },
    { name: "Domestik", value: 0 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-semibold" style={{ color: "#32363A" }}>Distribusi Layanan</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={chartData.filter(d => d.value > 0)} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
              {chartData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Branch Comparison Chart
export function ChartBranchCompare({ data }: { data: Record<string, unknown> }) {
  const branches = (data?.branchSummary as Record<string, unknown>[]) || [];
  const chartData = branches.length > 0
    ? branches.map((b) => ({ name: b.branchName as string, revenue: Number(b.revenueThisMonth || 0), jo: Number(b.activeOrders || 0) }))
    : [
        { name: "Semarang", revenue: 79300000, jo: 3 },
        { name: "Jakarta", revenue: 31500000, jo: 1 },
        { name: "Surabaya", revenue: 79500000, jo: 1 },
      ];

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-semibold" style={{ color: "#32363A" }}>Perbandingan Revenue Cabang</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#6A6D70" }} tickFormatter={formatIDR} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#32363A" }} width={70} />
            <Tooltip formatter={(v: number) => `Rp ${v.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="#0070F2" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Top 5 Customer Chart
export function ChartCustomerTop({ data }: { data: Record<string, unknown> }) {
  const chartData = [
    { name: "PT Nusantara Seafood", revenue: 79500000 },
    { name: "PT Maju Bersama", revenue: 33500000 },
    { name: "PT Surya Logistik", revenue: 31500000 },
    { name: "PT Sentosa Motor", revenue: 24300000 },
    { name: "PT Global Ekspor", revenue: 21500000 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-semibold" style={{ color: "#32363A" }}>Top 5 Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chartData.map((cust, idx) => (
            <div key={cust.name} className="flex items-center gap-3">
              <span className="text-[11px] font-bold w-5 text-center" style={{ color: COLORS[idx] }}>#{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium truncate" style={{ color: "#32363A" }}>{cust.name}</p>
                <div className="h-2 rounded-full mt-1" style={{ background: "#F0F0F0" }}>
                  <div className="h-2 rounded-full" style={{ background: COLORS[idx], width: `${(cust.revenue / chartData[0].revenue) * 100}%` }} />
                </div>
              </div>
              <span className="text-[11px] font-medium" style={{ color: "#6A6D70" }}>{formatIDR(cust.revenue)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// JO Status Donut
export function ChartJOStatus({ data }: { data: Record<string, unknown> }) {
  const chartData = [
    { name: "Completed", value: 3, color: "#107E3E" },
    { name: "In Progress", value: 1, color: "#E78C07" },
    { name: "Confirmed", value: 1, color: "#0070F2" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-semibold" style={{ color: "#32363A" }}>Status Job Order</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
              {chartData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {chartData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
              <span className="text-[10px]" style={{ color: "#6A6D70" }}>{d.name} ({d.value})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
