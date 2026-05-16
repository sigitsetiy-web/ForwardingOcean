"use client";

import { useCurrentUser } from "./use-current-user";
import { hasPermission, canAccessAllBranches } from "@/lib/rbac";
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

/**
 * Hook to check permissions for the current user
 */
export function usePermissions() {
  const { user } = useCurrentUser();

  const can = (action: Action, resource: Resource): boolean => {
    if (!user) return false;
    return hasPermission(user.role, action, resource);
  };

  const canAccessAll = (): boolean => {
    if (!user) return false;
    return canAccessAllBranches(user.role);
  };

  return {
    can,
    canAccessAllBranches: canAccessAll,
    role: user?.role as Role | undefined,
    branchId: user?.branchId,
  };
}
