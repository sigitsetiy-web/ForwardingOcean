import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorize, AuthUser } from "@/lib/api-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const lineItemSchema = z.object({
  description: z.string().min(1),
  category: z.string().optional(),
  uom: z.string().optional(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  amount: z.number().min(0),
  ppnMasukan: z.boolean().default(false),
  ppnAmount: z.number().optional(),
  glAccount: z.string().optional(),
  costCenter: z.string().optional(),
  notes: z.string().optional(),
});

const createAPSchema = z.object({
  jobOrderId: z.string().min(1),
  vendorType: z.string().optional(),
  vendorName: z.string().min(1),
  vendorCode: z.string().optional(),
  vendorNpwp: z.string().optional(),
  vendorAddress: z.string().optional(),
  vendorCountry: z.string().optional(),
  vendorPkpStatus: z.string().optional(),
  vendorBankName: z.string().optional(),
  vendorBankAccount: z.string().optional(),
  vendorInvoiceNo: z.string().optional(),
  vendorInvoiceDate: z.string().optional(),
  dueDate: z.string().optional(),
  apType: z.string().optional(),
  currency: z.string().default("IDR"),
  exchangeRate: z.number().optional(),
  fakturPajakNo: z.string().optional(),
  paymentTerms: z.string().optional(),
  paymentPriority: z.string().optional(),
  notes: z.string().optional(),
  createdById: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1),
});

async function generateAPNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = `API-${year}`;
  const latest = await prisma.vendorInvoice.findFirst({
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

// GET /api/vendor-invoices
export async function GET(request: NextRequest) {
  const authResult = await authorize(request, "read", "invoice");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const jobOrderId = searchParams.get("jobOrderId") || "";
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};
    if (jobOrderId) where.jobOrderId = jobOrderId;
    if (status) where.status = status;

    const invoices = await prisma.vendorInvoice.findMany({
      where,
      include: {
        jobOrder: { select: { id: true, number: true } },
        lineItems: true,
        _count: { select: { payments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: invoices });
  } catch (error) {
    console.error("Error fetching vendor invoices:", error);
    return NextResponse.json({ data: [] });
  }
}

// POST /api/vendor-invoices
export async function POST(request: NextRequest) {
  const authResult = await authorize(request, "create", "invoice");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const validated = createAPSchema.parse(body);

    const apNumber = await generateAPNumber();
    const subtotal = validated.lineItems.reduce((s, i) => s + i.amount, 0);
    const ppnTotal = validated.lineItems.filter(i => i.ppnMasukan).reduce((s, i) => s + (i.ppnAmount || i.amount * 0.12), 0);
    const pph23 = subtotal * 0.02; // Default 2%
    const totalAmount = subtotal + ppnTotal;
    const netPayable = totalAmount - pph23;

    const vendorInvoice = await prisma.vendorInvoice.create({
      data: {
        number: apNumber,
        jobOrderId: validated.jobOrderId,
        vendorType: validated.vendorType,
        vendorName: validated.vendorName,
        vendorCode: validated.vendorCode,
        vendorNpwp: validated.vendorNpwp,
        vendorAddress: validated.vendorAddress,
        vendorCountry: validated.vendorCountry,
        vendorPkpStatus: validated.vendorPkpStatus,
        vendorBankName: validated.vendorBankName,
        vendorBankAccount: validated.vendorBankAccount,
        vendorInvoiceNo: validated.vendorInvoiceNo,
        vendorInvoiceDate: validated.vendorInvoiceDate ? new Date(validated.vendorInvoiceDate) : undefined,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
        apType: validated.apType,
        currency: validated.currency,
        exchangeRate: validated.exchangeRate,
        subtotal,
        ppnMasukan: Math.round(ppnTotal),
        pph23Amount: Math.round(pph23),
        totalAmount: Math.round(totalAmount),
        netPayable: Math.round(netPayable),
        outstandingAmount: Math.round(netPayable),
        fakturPajakNo: validated.fakturPajakNo,
        paymentTerms: validated.paymentTerms,
        paymentPriority: validated.paymentPriority,
        notes: validated.notes,
        createdById: validated.createdById,
        status: "DRAFT",
        lineItems: {
          create: validated.lineItems.map(item => ({
            description: item.description,
            category: item.category,
            uom: item.uom,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
            ppnMasukan: item.ppnMasukan,
            ppnAmount: item.ppnAmount || (item.ppnMasukan ? item.amount * 0.12 : 0),
            glAccount: item.glAccount,
            costCenter: item.costCenter,
            notes: item.notes,
          })),
        },
      },
      include: { lineItems: true, jobOrder: { select: { id: true, number: true } } },
    });

    return NextResponse.json({ data: vendorInvoice }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Error creating vendor invoice:", error);
    return NextResponse.json({ error: "Failed to create vendor invoice" }, { status: 500 });
  }
}
