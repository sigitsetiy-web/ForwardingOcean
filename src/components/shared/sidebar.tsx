"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { hasPermission } from "@/lib/rbac";
import { Role } from "@prisma/client";
import {
  LayoutDashboard,
  LayoutGrid,
  Users,
  FileText,
  Package,
  Truck,
  DollarSign,
  CheckCircle,
  BarChart3,
  Building2,
  UserCog,
  Settings,
  ChevronLeft,
  Globe,
  ClipboardList,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  resource?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

function getGroupedMenu(role: Role): MenuGroup[] {
  const groups: MenuGroup[] = [];

  // Main
  groups.push({
    title: "UTAMA",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, resource: "dashboard" },
      { label: "Papan Control", href: "/control-center", icon: LayoutGrid, resource: "dashboard" },
    ],
  });

  // Operations
  const opsItems: MenuItem[] = [];
  if (hasPermission(role, "read", "quotation"))
    opsItems.push({ label: "Quotation", href: "/quotations", icon: FileText });
  if (hasPermission(role, "read", "job_order"))
    opsItems.push({ label: "Sales Order", href: "/sales-orders", icon: ClipboardList });
  if (hasPermission(role, "read", "job_order"))
    opsItems.push({ label: "Job Order", href: "/job-orders", icon: Package });
  if (hasPermission(role, "read", "trucking"))
    opsItems.push({ label: "Trucking", href: "/trucking", icon: Truck });
  if (opsItems.length > 0) {
    groups.push({ title: "OPERASIONAL", items: opsItems });
  }

  // CRM
  const crmItems: MenuItem[] = [];
  if (hasPermission(role, "read", "customer"))
    crmItems.push({ label: "Pelanggan", href: "/customers", icon: Users });
  if (crmItems.length > 0) {
    groups.push({ title: "CRM", items: crmItems });
  }

  // Finance & Reports
  const finItems: MenuItem[] = [];
  if (hasPermission(role, "read", "invoice"))
    finItems.push({ label: "Keuangan", href: "/finance", icon: DollarSign });
  if (hasPermission(role, "read", "report"))
    finItems.push({ label: "Laporan", href: "/reports", icon: BarChart3 });
  if (hasPermission(role, "read", "approval"))
    finItems.push({ label: "Approval", href: "/approvals", icon: CheckCircle });
  if (finItems.length > 0) {
    groups.push({ title: "KEUANGAN", items: finItems });
  }

  // Settings
  const settItems: MenuItem[] = [];
  if (hasPermission(role, "read", "branch"))
    settItems.push({ label: "Cabang", href: "/settings/branches", icon: Building2 });
  if (hasPermission(role, "read", "user"))
    settItems.push({ label: "Pengguna", href: "/settings/users", icon: UserCog });
  if (hasPermission(role, "read", "settings"))
    settItems.push({ label: "Accurate Online", href: "/settings/accurate-online", icon: Globe });
  if (settItems.length > 0) {
    groups.push({ title: "PENGATURAN", items: settItems });
  }

  return groups;
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const menuGroups = user ? getGroupedMenu(user.role) : [];

  return (
    <aside
      className={cn(
        "flex flex-col h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      style={{
        background: "#FFFFFF",
        borderRight: "1px solid #D1D2D4",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between h-14 px-4"
        style={{ borderBottom: "1px solid #D1D2D4" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <img src="/images/logo-keyocean.svg" alt="KayOcean" className="h-8 w-auto" />
            <div>
              <span className="font-bold text-[14px]" style={{ color: "#2B4C9B" }}>KayOcean</span>
              <p className="text-[10px] leading-tight" style={{ color: "#6A6D70" }}>Forwarding System</p>
            </div>
          </div>
        )}
        {collapsed && (
          <img src="/images/logo-keyocean.svg" alt="KayOcean" className="h-7 w-auto mx-auto" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: "#6A6D70" }}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-4">
            {/* Group Title */}
            {!collapsed && (
              <p
                className="px-4 mb-1 text-[10px] font-semibold tracking-wider uppercase"
                style={{ color: "#6A6D70" }}
              >
                {group.title}
              </p>
            )}
            {collapsed && <div className="h-px mx-3 my-2" style={{ background: "#D1D2D4" }} />}

            {/* Items */}
            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150",
                        isActive
                          ? "text-white"
                          : "hover:bg-[#F5F6F7]"
                      )}
                      style={
                        isActive
                          ? { background: "#0070F2", color: "#FFFFFF" }
                          : { color: "#32363A" }
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", isActive ? "text-white" : "text-[#6A6D70]")} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Info */}
      {user && !collapsed && (
        <div className="p-4" style={{ borderTop: "1px solid #D1D2D4" }}>
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "#0070F2" }}
            >
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate" style={{ color: "#32363A" }}>{user.name}</div>
              <div className="text-[11px] truncate" style={{ color: "#6A6D70" }}>
                {user.role.replace("_", " ")}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
