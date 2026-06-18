import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorize, getBranchFilter, AuthUser } from "@/lib/api-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createSOSchema = z.object({
  quotationId: z.string().optional(),
  customerId: z.string().min(1),
  serviceType: z.enum(["SEA_IMPORT", "SEA_EXPORT", "AIR_IMPORT", "AIR_EXPORT", "DOMESTIC"]),
  branchId: z.string().min(1),
  priority: z.string().optional(),
  currency: z.string().default("IDR"),
  exchangeRate: z.number().optional(),
  totalAmount: z.number().optional(),
  paymentTerms: z.string().optional(),
  paymentMethod: z.string().optional(),
  billingTrigger: z.string().optional(),
  poNumber: z.string().optional(),
  poDate: z.string().optional(),
  billingAttention: z.string().optional(),
  salesPerson: z.string().optional(),
  accountManager: z.string().optional(),
  trafficOfficer: z.string().optional(),
  incoterms: z.string().optional(),
  pol: z.string().optional(),
  pod: z.string().optional(),
  etd: z.string().optional(),
  eta: z.string().optional(),
  commodity: z.string().optional(),
  notes: z.string().optional(),
  createdById: z.string().min(1),
});

// Auto-generate SO number
async function generateSONumber(branchCode: string): Promise<string> {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prefix = `SO-${branchCode}-${yearMonth}`;

  const latest = await prisma.salesOrder.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: "desc" },
    select: { number: true },
  });

  let seq = 1;
  if (latest) {
    const parts = latest.number.split("-");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) seq = lastSeq + 1;
  }

  return `${prefix}-${String(seq).padStart(4, "0")}`;
}

// GET /api/sales-orders
export async function GET(request: NextRequest) {
  const authResult = await authorize(request, "read", "job_order");
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult as AuthUser;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const status = searchParams.get("status") || "";

    const branchFilter = getBranchFilter(user);
    const where: Record<string, unknown> = { ...branchFilter };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.salesOrder.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true, code: true } },
          branch: { select: { id: true, name: true, code: true } },
          quotation: { select: { id: true, number: true } },
          _count: { select: { jobOrders: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.salesOrder.count({ where }),
    ]);

    return NextResponse.json({ data: orders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    console.error("Error fetching sales orders:", error);
    return NextResponse.json({ data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 });
  }
}

// POST /api/sales-orders
export async function POST(request: NextRequest) {
  const authResult = await authorize(request, "create", "job_order");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const validated = createSOSchema.parse(body);

    const branch = await prisma.branch.findUnique({ where: { id: validated.branchId }, select: { code: true } });
    if (!branch) return NextResponse.json({ error: "Cabang tidak ditemukan" }, { status: 400 });

    const soNumber = await generateSONumber(branch.code);

    const salesOrder = await prisma.salesOrder.create({
      data: {
        number: soNumber,
        quotationId: validated.quotationId || undefined,
        customerId: validated.customerId,
        serviceType: validated.serviceType,
        branchId: validated.branchId,
        status: "DRAFT",
        priority: validated.priority,
        currency: validated.currency,
        exchangeRate: validated.exchangeRate,
        totalAmount: validated.totalAmount,
        paymentTerms: validated.paymentTerms,
        paymentMethod: validated.paymentMethod,
        billingTrigger: validated.billingTrigger,
        poNumber: validated.poNumber,
        poDate: validated.poDate ? new Date(validated.poDate) : undefined,
        billingAttention: validated.billingAttention,
        salesPerson: validated.salesPerson,
        accountManager: validated.accountManager,
        trafficOfficer: validated.trafficOfficer,
        incoterms: validated.incoterms,
        pol: validated.pol,
        pod: validated.pod,
        etd: validated.etd ? new Date(validated.etd) : undefined,
        eta: validated.eta ? new Date(validated.eta) : undefined,
        commodity: validated.commodity,
        notes: validated.notes,
        createdById: validated.createdById,
      },
      include: {
        customer: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true, code: true } },
      },
    });

    return NextResponse.json({ data: salesOrder }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Error creating sales order:", error);
    return NextResponse.json({ error: "Failed to create sales order" }, { status: 500 });
  }
}
