"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Truck,
  Ship,
  Package,
} from "lucide-react";

const financeMenus = [
  {
    title: "AR Invoicing",
    description: "Buat dan kelola invoice ke pelanggan (multi-party billing)",
    href: "/finance/invoices/new",
    icon: ArrowDownLeft,
    color: "bg-green-100 text-green-700",
    iconColor: "text-green-600",
  },
  {
    title: "Penerimaan dari Pelanggan",
    description: "Catat pembayaran masuk dari pelanggan atas invoice job order",
    href: "/finance/receivables",
    icon: ArrowDownLeft,
    color: "bg-green-100 text-green-700",
    iconColor: "text-green-600",
  },
  {
    title: "Pembayaran Uang Muka",
    description: "Catat uang muka (DP) yang diterima dari pelanggan sebelum pengerjaan",
    href: "/finance/advances",
    icon: Wallet,
    color: "bg-blue-100 text-blue-700",
    iconColor: "text-blue-600",
  },
  {
    title: "Pembayaran ke Vendor Trucking",
    description: "Catat pembayaran biaya trucking ke vendor pengiriman darat",
    href: "/finance/vendor-trucking",
    icon: Truck,
    color: "bg-amber-100 text-amber-700",
    iconColor: "text-amber-600",
  },
  {
    title: "Pembayaran Biaya Export",
    description: "Catat pembayaran biaya export (shipping line, dokumentasi, dll)",
    href: "/finance/vendor-export",
    icon: Ship,
    color: "bg-purple-100 text-purple-700",
    iconColor: "text-purple-600",
  },
  {
    title: "Pembayaran Biaya Import",
    description: "Catat pembayaran biaya import (bea cukai, EMKL, handling, dll)",
    href: "/finance/vendor-import",
    icon: Package,
    color: "bg-cyan-100 text-cyan-700",
    iconColor: "text-cyan-600",
  },
  {
    title: "AP Invoice (Vendor)",
    description: "Kelola invoice masuk dari vendor — External AP & Internal Fleet Cost",
    href: "/finance/ap-invoice/new",
    icon: ArrowUpRight,
    color: "bg-red-100 text-red-700",
    iconColor: "text-red-600",
  },
];

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Keuangan</h1>
        <p className="text-muted-foreground">
          Kelola penerimaan, pembayaran, dan transaksi keuangan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {financeMenus.map((menu) => {
          const Icon = menu.icon;
          return (
            <Link key={menu.href} href={menu.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: "hsl(var(--accent))" }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${menu.color}`}>
                      <Icon className={`h-5 w-5 ${menu.iconColor}`} />
                    </div>
                    <CardTitle className="text-base">{menu.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {menu.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
