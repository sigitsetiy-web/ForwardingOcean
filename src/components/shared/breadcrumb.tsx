"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Route label mappings
const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  "control-center": "Papan Control",
  quotations: "Quotation",
  "sales-orders": "Sales Order",
  "job-orders": "Job Order",
  "customs-clearance": "Custom Clearance",
  trucking: "Trucking",
  customers: "Pelanggan",
  finance: "Keuangan",
  invoices: "Invoice AR",
  "ap-invoice": "AP Invoice",
  receivables: "Penerimaan",
  advances: "Uang Muka",
  "vendor-trucking": "Vendor Trucking",
  "vendor-export": "Vendor Export",
  "vendor-import": "Vendor Import",
  reports: "Laporan",
  approvals: "Approval",
  settings: "Pengaturan",
  branches: "Cabang",
  users: "Pengguna",
  "accurate-online": "Accurate Online",
  chat: "Chat",
  new: "Buat Baru",
  import: "Import",
  guide: "Panduan",
};

function getLabel(segment: string): string {
  // Check if it's a dynamic route (UUID-like)
  if (segment.length > 20 || /^[a-z0-9]{20,}$/i.test(segment)) {
    return "Detail";
  }
  return routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function Breadcrumb() {
  const pathname = usePathname();

  // Split path and filter empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Don't show breadcrumb on root dashboard
  if (segments.length <= 1) return null;

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = getLabel(segment);
    const isLast = index === segments.length - 1;

    return { href, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1 text-[12px]" aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-[#6A6D70] hover:text-[#0070F2] transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-[#D1D2D4]" />
          {crumb.isLast ? (
            <span className="font-medium text-[#32363A]">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-[#6A6D70] hover:text-[#0070F2] transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
