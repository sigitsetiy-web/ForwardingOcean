import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_JOB_ORDERS } from "@/lib/mock-data";
import { generateJobOrderNumber } from "@/lib/job-number-generator";
import { z } from "zod";

const createJobOrderSchema = z.object({

export const dynamic = 'force-dynamic';

  customerId: z.string().min(1, "Customer wajib dipilih"),
  customerName: z.string().optional(), // Nama customer dari Accurate
  customerCode: z.string().optional(), // Kode customer dari Accurate
  serviceType: z.enum([
    "SEA_IMPORT",
    "SEA_EXPORT",
    "AIR_IMPORT",
    "AIR_EXPORT",
    "DOMESTIC",
  ]),
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

// GET /api/job-orders - List with pagination & filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const serviceType = searchParams.get("serviceType") || "";
    const branchId = searchParams.get("branchId") || "";
    const customerId = searchParams.get("customerId") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { shipper: { contains: search, mode: "insensitive" } },
        { consignee: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) where.status = status;
    if (serviceType) where.serviceType = serviceType;
    if (branchId) where.branchId = branchId;
    if (customerId) where.customerId = customerId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate)
        (where.createdAt as Record<string, unknown>).gte = new Date(startDate);
      if (endDate)
        (where.createdAt as Record<string, unknown>).lte = new Date(endDate);
    }

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

    return NextResponse.json({
      data: jobOrders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.warn("Job Orders: Using mock data");
    return NextResponse.json({
      data: MOCK_JOB_ORDERS,
      total: MOCK_JOB_ORDERS.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    });
  }
}

// POST /api/job-orders - Create new job order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createJobOrderSchema.parse(body);

    // Get branch code for number generation
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

    // Resolve customer: find or create from Accurate Online ID
    let localCustomerId = validated.customerId;
    
    // Check if customerId is an Accurate Online ID (numeric)
    const isAoId = /^\d+$/.test(validated.customerId);
    if (isAoId) {
      // Find existing customer linked to this AO ID
      let customer = await prisma.customer.findFirst({
        where: { aoCustomerId: validated.customerId },
      });

      if (!customer) {
        // Create new customer from Accurate data
        const code = validated.customerCode || `AO-${validated.customerId}`;
        customer = await prisma.customer.create({
          data: {
            code,
            name: validated.customerName || "Customer AO",
            segment: "IMPORTER",
            leadStatus: "CUSTOMER",
            aoCustomerId: validated.customerId,
          },
        });
      }
      localCustomerId = customer.id;
    }

    // Generate JO number
    const joNumber = await generateJobOrderNumber(
      branch.code,
      validated.serviceType
    );

    // Create job order with milestones
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
        // Create default milestones
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
        // Log activity
        activities: {
          create: {
            action: "CREATED",
            description: `Job Order ${joNumber} dibuat`,
            userId: validated.createdById,
          },
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
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating job order:", error);
    return NextResponse.json(
      { error: "Failed to create job order" },
      { status: 500 }
    );
  }
}
