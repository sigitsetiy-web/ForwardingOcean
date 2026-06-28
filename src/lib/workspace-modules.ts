export interface WorkspaceModule {
  id: string;
  label: string;
  basePath: string;
  listHref: string;
  newHref?: string;
}

/** Modul yang mendukung tab Daftar + Data Baru */
export const WORKSPACE_MODULES: WorkspaceModule[] = [
  { id: "/dashboard", label: "Dashboard", basePath: "/dashboard", listHref: "/dashboard" },
  { id: "/control-center", label: "Papan Control", basePath: "/control-center", listHref: "/control-center" },
  { id: "/chat", label: "Chat", basePath: "/chat", listHref: "/chat" },
  {
    id: "/quotations",
    label: "Quotation",
    basePath: "/quotations",
    listHref: "/quotations",
    newHref: "/quotations/new",
  },
  {
    id: "/sales-orders",
    label: "Sales Order",
    basePath: "/sales-orders",
    listHref: "/sales-orders",
    newHref: "/sales-orders/new",
  },
  {
    id: "/job-orders",
    label: "Job Order",
    basePath: "/job-orders",
    listHref: "/job-orders",
    newHref: "/job-orders/new",
  },
  {
    id: "/customs-clearance",
    label: "Custom Clearance",
    basePath: "/customs-clearance",
    listHref: "/customs-clearance",
  },
  { id: "/trucking", label: "Trucking", basePath: "/trucking", listHref: "/trucking" },
  {
    id: "/customers",
    label: "Pelanggan",
    basePath: "/customers",
    listHref: "/customers",
    newHref: "/customers/new",
  },
  {
    id: "/finance",
    label: "Keuangan",
    basePath: "/finance",
    listHref: "/finance",
    newHref: "/finance/invoices/new",
  },
  { id: "/reports", label: "Laporan", basePath: "/reports", listHref: "/reports" },
  { id: "/approvals", label: "Approval", basePath: "/approvals", listHref: "/approvals" },
  { id: "/settings/branches", label: "Cabang", basePath: "/settings/branches", listHref: "/settings/branches" },
  { id: "/settings/users", label: "Pengguna", basePath: "/settings/users", listHref: "/settings/users" },
  {
    id: "/settings/accurate-online",
    label: "Accurate Online",
    basePath: "/settings/accurate-online",
    listHref: "/settings/accurate-online",
  },
];

export function getModuleByPath(pathname: string): WorkspaceModule | null {
  const sorted = [...WORKSPACE_MODULES].sort(
    (a, b) => b.basePath.length - a.basePath.length
  );
  return (
    sorted.find(
      (m) =>
        pathname === m.basePath || pathname.startsWith(`${m.basePath}/`)
    ) ?? null
  );
}

export function getViewFromPath(
  pathname: string,
  module: WorkspaceModule
): "list" | "new" {
  if (module.newHref && pathname === module.newHref) return "new";
  if (module.newHref && pathname.startsWith(module.newHref)) return "new";
  return "list";
}

export function getNewHrefForMenu(href: string): string | undefined {
  return WORKSPACE_MODULES.find((m) => m.id === href)?.newHref;
}
