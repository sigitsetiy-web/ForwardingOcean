import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
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

interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    branchId: string | null;
  };
}

/**
 * Verify the current user from the request session.
 * Returns the user object or null if not authenticated.
 */
export async function getAuthUser(
  request: NextRequest
): Promise<AuthResult | null> {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) return null;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { supabaseUserId: supabaseUser.id },
          { email: supabaseUser.email },
        ],
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        branchId: true,
      },
    });

    if (!user) return null;

    return { user };
  } catch {
    return null;
  }
}

/**
 * Check if the authenticated user has permission to perform an action.
 * Returns a NextResponse error if not authorized, or null if authorized.
 */
export function checkPermission(
  role: Role,
  action: Action,
  resource: Resource
): NextResponse | null {
  if (!hasPermission(role, action, resource)) {
    return NextResponse.json(
      { error: "Anda tidak memiliki akses untuk melakukan aksi ini" },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Apply branch filter for non-owner/admin users.
 * Returns the branchId filter or undefined for full access.
 */
export function getBranchFilter(
  role: Role,
  branchId: string | null
): string | undefined {
  if (role === "OWNER" || role === "ADMIN") {
    return undefined; // Full access
  }
  return branchId || undefined;
}
