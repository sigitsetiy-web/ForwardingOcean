"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ClipboardList } from "lucide-react";
import Link from "next/link";

export default function SalesOrdersPage() {
  // Demo data
  const orders = [
    { id: "so-1", number: "SO-2025-0001", customer: "Design Pergola", status: "CONFIRMED", date: "2025-05-12", total: 95850000 },
    { id: "so-2", number: "SO-2025-0002", customer: "General Customer", status: "DRAFT", date: "2025-05-14", total: 45000000 },
  ];

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    "IN PROGRESS": "bg-amber-100 text-amber-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

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
                <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((so) => (
                <tr key={so.id} className="border-b hover:bg-blue-50/30">
                  <td className="px-4 py-3">
                    <Link href={`/sales-orders/new`} className="font-mono font-medium hover:underline" style={{ color: "#0070F2" }}>{so.number}</Link>
                  </td>
                  <td className="px-4 py-3">{so.customer}</td>
                  <td className="px-4 py-3">{so.date}</td>
                  <td className="px-4 py-3 text-right font-mono">{new Intl.NumberFormat("id-ID").format(so.total)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={statusColors[so.status] || ""} variant="secondary">{so.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
