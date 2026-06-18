import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorize, AuthUser } from "@/lib/api-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateUserSchema = z.object({


  name: z.string().min(1).optional(),
  role: z
    .enum([
      "OWNER",
      "BRANCH_MANAGER",
      "CRM",
      "MARKETING",
      "SALES",
      "CSO",
      "TRUCKING",
      "FINANCE",
      "ADMIN",
    ])
    .optional(),
  branchId: z.string().nullable().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/users/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authorize(request, "read", "user");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        branch: { select: { id: true, name: true, code: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authorize(request, "update", "user");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: params.id },
      data: validated,
      include: {
        branch: { select: { id: true, name: true, code: true } },
      },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authorize(request, "delete", "user");
  if (authResult instanceof NextResponse) return authResult;

  try {
    await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "User dinonaktifkan" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
