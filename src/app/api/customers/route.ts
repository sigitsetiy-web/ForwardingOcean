import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorize, AuthUser } from "@/lib/api-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const customerSchema = z.object({


  code: z.string().min(1, "Kode pelanggan wajib diisi"),
  name: z.string().min(1, "Nama pelanggan wajib diisi"),
  npwp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  pic: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  segment: z.enum(["IMPORTER", "EXPORTER", "SHIPPER", "CONSIGNEE"]),
  creditLimit: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
  leadStatus: z
    .enum(["PROSPECT", "LEAD", "QUALIFIED", "CUSTOMER", "LOST"])
    .optional(),
});

// GET /api/customers - List customers with pagination & filters
export async function GET(request: NextRequest) {
  const authResult = await authorize(request, "read", "customer");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search") || "";
    const segment = searchParams.get("segment") || "";
    const leadStatus = searchParams.get("leadStatus") || "";

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { pic: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    if (segment) {
      where.segment = segment;
    }

    if (leadStatus) {
      where.leadStatus = leadStatus;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({
      data: customers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.warn("Customers: Using mock data");
    return NextResponse.json({
      data: MOCK_CUSTOMERS,
      total: MOCK_CUSTOMERS.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    });
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = customerSchema.parse(body);

    // Check if code already exists
    const existing = await prisma.customer.findUnique({
      where: { code: validated.code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Kode pelanggan sudah digunakan" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        ...validated,
        creditLimit: validated.creditLimit || undefined,
        email: validated.email || undefined,
      },
    });

    return NextResponse.json({ data: customer }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
