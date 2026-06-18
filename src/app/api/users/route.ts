import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { authorize, AuthUser } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const createUserSchema = z.object({


  email: z.string().email("Email tidak valid"),
  name: z.string().min(1, "Nama wajib diisi"),
  role: z.enum([
    "OWNER",
    "BRANCH_MANAGER",
    "CRM",
    "MARKETING",
    "SALES",
    "CSO",
    "TRUCKING",
    "FINANCE",
    "ADMIN",
  ]),
  branchId: z.string().optional(),
  phone: z.string().optional(),
});

// GET /api/users - List users with pagination & filters
export async function GET(request: NextRequest) {
  const authResult = await authorize(request, "read", "user");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const branchId = searchParams.get("branchId") || "";

    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) where.role = role;
    if (branchId) where.branchId = branchId;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          branch: { select: { id: true, name: true, code: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  const authResult = await authorize(request, "create", "user");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const validated = createUserSchema.parse(body);

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        name: validated.name,
        role: validated.role,
        branchId: validated.branchId || undefined,
        phone: validated.phone || undefined,
      },
      include: {
        branch: { select: { id: true, name: true, code: true } },
      },
    });

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
