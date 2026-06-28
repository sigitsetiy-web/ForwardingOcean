"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSidebar } from "@/hooks/use-sidebar";
import { useWorkspaceTabs } from "@/hooks/use-workspace-tabs";
import { getNewHrefForMenu, WORKSPACE_MODULES } from "@/lib/workspace-modules";
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
  Globe,
  ClipboardList,
  MessageCircle,
  Pin,
  PinOff,
  X,
  List,
  Plus,
} from "lucide-react";
import { useEffect, useRef } from "react";
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

  groups.push({
    title: "UTAMA",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, resource: "dashboard" },
      { label: "Papan Control", href: "/control-center", icon: LayoutGrid, resource: "dashboard" },
      { label: "Chat", href: "/chat", icon: MessageCircle, resource: "dashboard" },
    ],
  });

  const opsItems: MenuItem[] = [];
  if (hasPermission(role, "read", "quotation"))
    opsItems.push({ label: "Quotation", href: "/quotations", icon: FileText });
  if (hasPermission(role, "read", "job_order"))
    opsItems.push({ label: "Sales Order", href: "/sales-orders", icon: ClipboardList });
  if (hasPermission(role, "read", "job_order"))
    opsItems.push({ label: "Job Order", href: "/job-orders", icon: Package });
  if (hasPermission(role, "read", "job_order"))
    opsItems.push({ label: "Custom Clearance", href: "/customs-clearance", icon: FileText });
  if (hasPermission(role, "read", "trucking"))
    opsItems.push({ label: "Trucking", href: "/trucking", icon: Truck });
  if (opsItems.length > 0) {
    groups.push({ title: "OPERASIONAL", items: opsItems });
  }

  const crmItems: MenuItem[] = [];
  if (hasPermission(role, "read", "customer"))
    crmItems.push({ label: "Pelanggan", href: "/customers", icon: Users });
  if (crmItems.length > 0) {
    groups.push({ title: "CRM", items: crmItems });
  }

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
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();
  const { isOpen, isPinned, open, close, togglePin } = useSidebar();
  const { openTab } = useWorkspaceTabs();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuGroups = user ? getGroupedMenu(user.role) : [];

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    if (isPinned) return;
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => close(), 350);
  };

  useEffect(() => () => clearCloseTimer(), []);

  const handleNavClick = () => {
    if (!isPinned) close();
  };

  const handleOpenModule = (href: string, view: "list" | "new" = "list") => {
    const module = WORKSPACE_MODULES.find((m) => m.id === href);
    if (module) {
      openTab(module, view);
    } else {
      router.push(href);
    }
    handleNavClick();
  };

  return (
    <>
      {/* Hover zone — geser mouse ke kiri untuk buka menu */}
      {!isOpen && (
        <div
          className="absolute left-0 top-0 z-30 h-full w-3 cursor-pointer"
          onMouseEnter={() => {
            clearCloseTimer();
            open();
          }}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "flex h-screen flex-shrink-0 flex-col overflow-hidden transition-[width] duration-300 ease-in-out",
          isOpen ? "w-64 shadow-lg" : "w-0"
        )}
        style={{
          background: "#FFFFFF",
          borderRight: isOpen ? "1px solid #D1D2D4" : "none",
        }}
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleClose}
      >
        <div className="flex h-full w-64 flex-col">
        {/* Logo */}
        <div
          className="flex h-14 items-center justify-between px-4"
          style={{ borderBottom: "1px solid #D1D2D4" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="/images/logo-keyocean.svg" alt="KayOcean" className="h-8 w-auto flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-[14px]" style={{ color: "#2B4C9B" }}>KayOcean</span>
              <p className="text-[10px] leading-tight truncate" style={{ color: "#6A6D70" }}>Forwarding System</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={togglePin}
              title={isPinned ? "Lepas pin sidebar" : "Pin sidebar tetap terbuka"}
              style={{ color: isPinned ? "#0070F2" : "#6A6D70" }}
            >
              {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </Button>
            {!isPinned && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={close}
                title="Tutup menu"
                style={{ color: "#6A6D70" }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-4">
              <p
                className="px-4 mb-1 text-[10px] font-semibold tracking-wider uppercase"
                style={{ color: "#6A6D70" }}
              >
                {group.title}
              </p>
              <ul className="space-y-0.5 px-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const newHref = getNewHrefForMenu(item.href);
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        onClick={() => handleOpenModule(item.href, "list")}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150",
                          isActive ? "text-white" : "hover:bg-[#F5F6F7]"
                        )}
                        style={
                          isActive
                            ? { background: "#0070F2", color: "#FFFFFF" }
                            : { color: "#32363A" }
                        }
                      >
                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] flex-shrink-0",
                            isActive ? "text-white" : "text-[#6A6D70]"
                          )}
                        />
                        <span className="text-left">{item.label}</span>
                      </button>

                      {newHref && (
                        <div className="ml-9 mt-0.5 mb-1 flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenModule(item.href, "list")}
                            className={cn(
                              "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium transition-colors",
                              isActive && pathname !== newHref
                                ? "bg-[#E8F4FD] text-[#0070F2]"
                                : "text-[#6A6D70] hover:bg-[#F5F6F7]"
                            )}
                          >
                            <List className="h-3 w-3" />
                            Daftar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenModule(item.href, "new")}
                            className={cn(
                              "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium transition-colors",
                              pathname === newHref || pathname.startsWith(`${newHref}/`)
                                ? "bg-[#E8F4FD] text-[#0070F2]"
                                : "text-[#6A6D70] hover:bg-[#F5F6F7]"
                            )}
                          >
                            <Plus className="h-3 w-3" />
                            Baru
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Info */}
        {user && (
          <div className="p-4" style={{ borderTop: "1px solid #D1D2D4" }}>
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "#0070F2" }}
              >
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate" style={{ color: "#32363A" }}>
                  {user.name}
                </div>
                <div className="text-[11px] truncate" style={{ color: "#6A6D70" }}>
                  {user.role.replace("_", " ")}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </aside>
    </>
  );
}
