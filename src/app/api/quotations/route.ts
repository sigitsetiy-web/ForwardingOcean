import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { generateQuotationNumber } from "@/lib/job-number-generator";
import { z } from "zod";

const quotationItemSchema = z.object({

export const dynamic = 'force-dynamic';

  description: z.string().min(1),
  unit: z.string().optional(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  currency: z.string().default("IDR"),
  amount: z.number().min(0),
  notes: z.string().optional(),
});

const createQuotationSchema = z.object({
  customerId: z.string().min(1, "Customer wajib dipilih"),
  serviceType: z.enum([
    "SEA_IMPORT",
    "SEA_EXPORT",
    "AIR_IMPORT",
    "AIR_EXPORT",
    "DOMESTIC",
  ]),
  origin: z.string().min(1, "Origin wajib diisi"),
  destination: z.string().min(1, "Destination wajib diisi"),
  validUntil: z.string().min(1, "Tanggal berlaku wajib diisi"),
  currency: z.string().default("IDR"),
  notes: z.string().optional(),
  branchId: z.string().min(1),
  createdById: z.string().min(1),
  items: z.array(quotationItemSchema).min(1, "Minimal 1 item harga"),
});

// GET /api/quotations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const branchId = searchParams.get("branchId") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status) where.status = status;
    if (branchId) where.branchId = branchId;

    const [quotations, total] = await Promise.all([
      prisma.quotation.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true, code: true } },
          branch: { select: { id: true, name: true, code: true } },
          items: true,
          _count: { select: { approvals: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.quotation.count({ where }),
    ]);

    return NextResponse.json({
      data: quotations,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.warn("Quotations: Using mock data");
    return NextResponse.json({
      data: MOCK_QUOTATIONS,
      total: MOCK_QUOTATIONS.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    });
  }
}

// POST /api/quotations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createQuotationSchema.parse(body);

    // Get branch code
    const branch = await prisma.branch.findUnique({
      where: { id: validated.branchId },
      select: { code: true },
    });

    if (!branch) {
      return NextResponse.json(
        { error: "Cabang tidak ditemukan" },
        { status: 400 }
      );
    }

    // Generate quotation number
    const qtNumber = await generateQuotationNumber(branch.code);

    // Calculate total
    const totalAmount = validated.items.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const quotation = await prisma.quotation.create({
      data: {
        number: qtNumber,
        customerId: validated.customerId,
        serviceType: validated.serviceType,
        origin: validated.origin,
        destination: validated.destination,
        validUntil: new Date(validated.validUntil),
        currency: validated.currency,
        totalAmount,
        notes: validated.notes,
        branchId: validated.branchId,
        createdById: validated.createdById,
        status: "DRAFT",
        items: {
          create: validated.items.map((item) => ({
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            currency: item.currency,
            amount: item.amount,
            notes: item.notes,
          })),
        },
      },
      include: {
        customer: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true, code: true } },
        items: true,
      },
    });

    return NextResponse.json({ data: quotation }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating quotation:", error);
    return NextResponse.json(
      { error: "Failed to create quotation" },
      { status: 500 }
    );
  }
}
