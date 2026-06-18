import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorize, getBranchFilter, AuthUser } from "@/lib/api-auth";
import { generateJobOrderNumber } from "@/lib/job-number-generator";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createJobOrderSchema = z.object({
  customerId: z.string().min(1, "Customer wajib dipilih"),
  customerName: z.string().optional(),
  customerCode: z.string().optional(),
  serviceType: z.enum(["SEA_IMPORT", "SEA_EXPORT", "AIR_IMPORT", "AIR_EXPORT", "DOMESTIC"]),
  branchId: z.string().min(1, "Cabang wajib dipilih"),
  quotationId: z.string().optional(),
  shipper: z.string().optional(),
  consignee: z.string().optional(),
  pol: z.string().optional(),
  pod: z.string().optional(),
  commodity: z.string().optional(),
  hsCode: z.string().optional(),
  incoterms: z.string().optional(),
  quantity: z.number().optional(),
  grossWeight: z.number().optional(),
  cbm: z.number().optional(),
  containerType: z.string().optional(),
  containerQty: z.number().optional(),
  vesselName: z.string().optional(),
  voyageNo: z.string().optional(),
  flightNo: z.string().optional(),
  etd: z.string().optional(),
  eta: z.string().optional(),
  createdById: z.string().min(1),
  assignedTo: z.string().optional(),
});

// GET /api/job-orders
export async function GET(request: NextRequest) {
  // Auth check
  const authResult = await authorize(request, "read", "job_order");
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult as AuthUser;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const serviceType = searchParams.get("serviceType") || "";
    const branchId = searchParams.get("branchId") || "";
    const customerId = searchParams.get("customerId") || "";

    // Apply branch filter based on user role
    const branchFilter = getBranchFilter(user);
    const where: Record<string, unknown> = { ...branchFilter };

    if (search) {
      where.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { shipper: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (serviceType) where.serviceType = serviceType;
    if (branchId) where.branchId = branchId;
    if (customerId) where.customerId = customerId;

    const [jobOrders, total] = await Promise.all([
      prisma.jobOrder.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true, code: true } },
          branch: { select: { id: true, name: true, code: true } },
          _count: { select: { documents: true, milestones: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobOrder.count({ where }),
    ]);

    return NextResponse.json({ data: jobOrders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    console.error("Error fetching job orders:", error);
    return NextResponse.json({ data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 });
  }
}

// POST /api/job-orders
export async function POST(request: NextRequest) {
  // Auth check
  const authResult = await authorize(request, "create", "job_order");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const validated = createJobOrderSchema.parse(body);

    const branch = await prisma.branch.findUnique({
      where: { id: validated.branchId },
      select: { code: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Cabang tidak ditemukan" }, { status: 400 });
    }

    // Resolve customer (from Accurate ID or local)
    let localCustomerId = validated.customerId;
    const isAoId = /^\d+$/.test(validated.customerId);
    if (isAoId) {
      let customer = await prisma.customer.findFirst({ where: { aoCustomerId: validated.customerId } });
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            code: validated.customerCode || `AO-${validated.customerId}`,
            name: validated.customerName || "Customer",
            segment: "IMPORTER",
            leadStatus: "CUSTOMER",
            aoCustomerId: validated.customerId,
          },
        });
      }
      localCustomerId = customer.id;
    }

    const joNumber = await generateJobOrderNumber(branch.code, validated.serviceType);

    const jobOrder = await prisma.jobOrder.create({
      data: {
        number: joNumber,
        customerId: localCustomerId,
        serviceType: validated.serviceType,
        branchId: validated.branchId,
        shipper: validated.shipper,
        consignee: validated.consignee,
        pol: validated.pol,
        pod: validated.pod,
        commodity: validated.commodity,
        hsCode: validated.hsCode,
        incoterms: validated.incoterms,
        quantity: validated.quantity,
        grossWeight: validated.grossWeight,
        cbm: validated.cbm,
        containerType: validated.containerType,
        containerQty: validated.containerQty,
        vesselName: validated.vesselName,
        voyageNo: validated.voyageNo,
        flightNo: validated.flightNo,
        etd: validated.etd ? new Date(validated.etd) : undefined,
        eta: validated.eta ? new Date(validated.eta) : undefined,
        createdById: validated.createdById,
        assignedTo: validated.assignedTo,
        status: "DRAFT",
        milestones: {
          create: [
            { type: "ORDER_CONFIRMED", status: "PENDING" },
            { type: "DOCUMENT_RECEIVED", status: "PENDING" },
            { type: "CUSTOMS_STARTED", status: "PENDING" },
            { type: "CUSTOMS_DONE", status: "PENDING" },
            { type: "CARGO_RELEASED", status: "PENDING" },
            { type: "DELIVERY_TO_CONSIGNEE", status: "PENDING" },
            { type: "POD_RECEIVED", status: "PENDING" },
            { type: "INVOICE_ISSUED", status: "PENDING" },
            { type: "PAYMENT_RECEIVED", status: "PENDING" },
            { type: "JOB_CLOSED", status: "PENDING" },
          ],
        },
        activities: {
          create: { action: "CREATED", description: `Job Order ${joNumber} dibuat`, userId: validated.createdById },
        },
      },
      include: {
        customer: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true, code: true } },
        milestones: true,
      },
    });

    return NextResponse.json({ data: jobOrder }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Error creating job order:", error);
    return NextResponse.json({ error: "Failed to create job order" }, { status: 500 });
  }
}
