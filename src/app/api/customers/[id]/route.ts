import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateCustomerSchema = z.object({


  name: z.string().min(1).optional(),
  npwp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  pic: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  segment: z.enum(["IMPORTER", "EXPORTER", "SHIPPER", "CONSIGNEE"]).optional(),
  creditLimit: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
  leadStatus: z
    .enum(["PROSPECT", "LEAD", "QUALIFIED", "CUSTOMER", "LOST"])
    .optional(),
});

// GET /api/customers/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        jobOrders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            number: true,
            serviceType: true,
            status: true,
            createdAt: true,
          },
        },
        quotations: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            number: true,
            serviceType: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            jobOrders: true,
            quotations: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateCustomerSchema.parse(body);

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json({ data: customer });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.customer.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Customer deactivated" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
