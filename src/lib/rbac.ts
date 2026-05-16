import { Role } from "@prisma/client";

type Action = "create" | "read" | "update" | "delete" | "approve" | "export";
type Resource =
  | "job_order"
  | "quotation"
  | "customer"
  | "document"
  | "invoice"
  | "report"
  | "branch"
  | "user"
  | "approval"
  | "trucking"
  | "settings"
  | "dashboard";

// Permission matrix: role -> resource -> allowed actions
const permissions: Record<Role, Partial<Record<Resource, Action[]>>> = {
  OWNER: {
    job_order: ["create", "read", "update", "delete", "approve", "export"],
    quotation: ["create", "read", "update", "delete", "approve", "export"],
    customer: ["create", "read", "update", "delete", "export"],
    document: ["create", "read", "update", "delete", "approve", "export"],
    invoice: ["create", "read", "update", "delete", "approve", "export"],
    report: ["read", "export"],
    branch: ["create", "read", "update", "delete"],
    user: ["create", "read", "update", "delete"],
    approval: ["create", "read", "approve"],
    trucking: ["create", "read", "update", "delete"],
    settings: ["create", "read", "update", "delete"],
    dashboard: ["read"],
  },
  BRANCH_MANAGER: {
    job_order: ["create", "read", "update", "approve", "export"],
    quotation: ["create", "read", "update", "approve", "export"],
    customer: ["create", "read", "update", "export"],
    document: ["create", "read", "update", "approve", "export"],
    invoice: ["create", "read", "update", "approve", "export"],
    report: ["read", "export"],
    branch: ["read"],
    user: ["read"],
    approval: ["read", "approve"],
    trucking: ["create", "read", "update"],
    settings: ["read"],
    dashboard: ["read"],
  },
  CRM: {
    job_order: ["read"],
    quotation: ["read"],
    customer: ["create", "read", "update"],
    document: ["read"],
    invoice: ["read"],
    report: ["read"],
    dashboard: ["read"],
  },
  MARKETING: {
    job_order: ["read"],
    quotation: ["create", "read", "update"],
    customer: ["create", "read", "update"],
    document: ["read"],
    report: ["read"],
    dashboard: ["read"],
  },
  SALES: {
    job_order: ["create", "read", "update"],
    quotation: ["create", "read", "update"],
    customer: ["create", "read", "update"],
    document: ["read", "create"],
    report: ["read"],
    dashboard: ["read"],
  },
  CSO: {
    job_order: ["read", "update"],
    quotation: ["read"],
    customer: ["read"],
    document: ["create", "read", "update"],
    invoice: ["read"],
    trucking: ["read", "update"],
    dashboard: ["read"],
  },
  TRUCKING: {
    job_order: ["read"],
    document: ["create", "read"],
    trucking: ["create", "read", "update"],
    dashboard: ["read"],
  },
  FINANCE: {
    job_order: ["read", "update"],
    quotation: ["read"],
    customer: ["read"],
    document: ["read"],
    invoice: ["create", "read", "update", "export"],
    report: ["read", "export"],
    dashboard: ["read"],
  },
  ADMIN: {
    job_order: ["read"],
    quotation: ["read"],
    customer: ["create", "read", "update", "delete"],
    document: ["read"],
    branch: ["create", "read", "update"],
    user: ["create", "read", "update", "delete"],
    settings: ["create", "read", "update"],
    dashboard: ["read"],
  },
};

/**
 * Check if a role has permission to perform an action on a resource
 */
export function hasPermission(
  role: Role,
  action: Action,
  resource: Resource
): boolean {
  const rolePermissions = permissions[role];
  if (!rolePermissions) return false;

  const resourceActions = rolePermissions[resource];
  if (!resourceActions) return false;

  return resourceActions.includes(action);
}

/**
 * Check if a role can access all branches (cross-branch access)
 */
export function canAccessAllBranches(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN";
}

/**
 * Get all allowed resources for a role (for menu visibility)
 */
export function getAllowedResources(role: Role): Resource[] {
  const rolePermissions = permissions[role];
  if (!rolePermissions) return [];
  return Object.keys(rolePermissions) as Resource[];
}

/**
 * Get menu items based on role
 */
export function getMenuItems(role: Role) {
  const menuMap: Record<Resource, { label: string; href: string; icon: string }> = {
    dashboard: { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    customer: { label: "Pelanggan", href: "/customers", icon: "Users" },
    quotation: { label: "Quotation", href: "/quotations", icon: "FileText" },
    job_order: { label: "Job Order", href: "/job-orders", icon: "Package" },
    document: { label: "Dokumen", href: "/documents", icon: "FolderOpen" },
    trucking: { label: "Trucking", href: "/trucking", icon: "Truck" },
    invoice: { label: "Keuangan", href: "/finance", icon: "DollarSign" },
    approval: { label: "Approval", href: "/approvals", icon: "CheckCircle" },
    report: { label: "Laporan", href: "/reports", icon: "BarChart3" },
    branch: { label: "Cabang", href: "/settings/branches", icon: "Building2" },
    user: { label: "Pengguna", href: "/settings/users", icon: "UserCog" },
    settings: { label: "Pengaturan", href: "/settings/accurate-online", icon: "Settings" },
  };

  const allowedResources = getAllowedResources(role);
  return allowedResources
    .filter((resource) => menuMap[resource])
    .map((resource) => menuMap[resource]);
}
