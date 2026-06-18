"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ClipboardList } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function SalesOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["sales-orders"],
    queryFn: async () => {
      const res = await fetch("/api/sales-orders?pageSize=50");
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Sales Orders
          </h1>
          <p className="text-muted-foreground">Kelola sales order dari quotation yang disetujui</p>
        </div>
        <Link href="/sales-orders/new">
          <Button style={{ background: "#0070F2" }}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Sales Order
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ background: "#F5F6F7" }}>
                <th className="px-4 py-3 text-left font-medium">No. SO</th>
                <th className="px-4 py-3 text-left font-medium">Pelanggan</th>
                <th className="px-4 py-3 text-left font-medium">Jenis</th>
                <th className="px-4 py-3 text-left font-medium">Cabang</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Memuat data...</td></tr>
              ) : !data?.data || data.data.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Belum ada sales order</td></tr>
              ) : (
                data.data.map((so: Record<string, unknown>) => (
                  <tr key={so.id as string} className="border-b hover:bg-blue-50/30">
                    <td className="px-4 py-3">
                      <Link href={`/sales-orders/new`} className="font-mono font-medium hover:underline" style={{ color: "#0070F2" }}>{so.number as string}</Link>
                    </td>
                    <td className="px-4 py-3">{(so.customer as Record<string, string>)?.name}</td>
                    <td className="px-4 py-3 text-xs">{(so.serviceType as string)?.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-xs">{(so.branch as Record<string, string>)?.name}</td>
                    <td className="px-4 py-3 text-right font-mono">{so.totalAmount ? new Intl.NumberFormat("id-ID").format(Number(so.totalAmount)) : "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={statusColors[so.status as string] || ""} variant="secondary">{so.status as string}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
