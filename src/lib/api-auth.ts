import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hasPermission } from "@/lib/rbac";
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

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  branchId: string | null;
}

/**
 * Get authenticated user from request.
 * Checks X-User-Id header or cookie for session.
 * Returns user or null if not authenticated.
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Get user ID from header (set by client) or cookie
    const userId = request.headers.get("x-user-id") || 
                   request.cookies.get("fms_user_id")?.value;

    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId, isActive: true },
      select: { id: true, email: true, name: true, role: true, branchId: true },
    });

    return user || null;
  } catch {
    return null;
  }
}

/**
 * Require authentication. Returns 401 if not authenticated.
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | NextResponse> {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }
  return user;
}

/**
 * Require specific permission. Returns 403 if not authorized.
 */
export function requirePermission(
  user: AuthUser,
  action: Action,
  resource: Resource
): NextResponse | null {
  if (!hasPermission(user.role, action, resource)) {
    return NextResponse.json(
      { error: `Anda tidak memiliki akses untuk ${action} ${resource}` },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Get branch filter for queries.
 * Owner/Admin see all, others see only their branch.
 */
export function getBranchFilter(user: AuthUser): Record<string, string> | Record<string, never> {
  if (user.role === "OWNER" || user.role === "ADMIN") {
    return {}; // No filter — see all
  }
  if (user.branchId) {
    return { branchId: user.branchId };
  }
  return {};
}

/**
 * Helper: check auth + permission in one call.
 * Returns user if authorized, or NextResponse error.
 */
export async function authorize(
  request: NextRequest,
  action: Action,
  resource: Resource
): Promise<AuthUser | NextResponse> {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const permError = requirePermission(authResult, action, resource);
  if (permError) return permError;

  return authResult;
}
