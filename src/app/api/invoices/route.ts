import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorize, getBranchFilter, AuthUser } from "@/lib/api-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const lineItemSchema = z.object({
  description: z.string().min(1),
  category: z.string().optional(),
  uom: z.string().optional(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  amount: z.number().min(0),
  ppn: z.boolean().default(false),
  ppnAmount: z.number().optional(),
  notes: z.string().optional(),
});

const createInvoiceSchema = z.object({
  jobOrderId: z.string().min(1),
  customerId: z.string().optional(),
  invoiceType: z.string().default("COMMERCIAL"),
  billingPartyType: z.string().optional(),
  billingCompany: z.string().optional(),
  billingAddress: z.string().optional(),
  billingContact: z.string().optional(),
  billingEmail: z.string().optional(),
  billingCountry: z.string().optional(),
  billingNpwp: z.string().optional(),
  taxStatus: z.string().optional(),
  currency: z.string().default("IDR"),
  exchangeRate: z.number().optional(),
  paymentTerms: z.string().optional(),
  paymentMethod: z.string().optional(),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  swiftCode: z.string().optional(),
  fakturPajakNo: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  createdById: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1),
});

async function generateInvoiceNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = `INV-${year}`;

  const latest = await prisma.invoice.findFirst({
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

// GET /api/invoices
export async function GET(request: NextRequest) {
  const authResult = await authorize(request, "read", "invoice");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const jobOrderId = searchParams.get("jobOrderId") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where: Record<string, unknown> = {};
    if (jobOrderId) where.jobOrderId = jobOrderId;
    if (status) where.status = status;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          jobOrder: { select: { id: true, number: true } },
          customer: { select: { id: true, name: true } },
          lineItems: true,
          _count: { select: { payments: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({ data: invoices, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ data: [], total: 0 });
  }
}

// POST /api/invoices
export async function POST(request: NextRequest) {
  const authResult = await authorize(request, "create", "invoice");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const validated = createInvoiceSchema.parse(body);

    const invNumber = await generateInvoiceNumber();
    const subtotal = validated.lineItems.reduce((s, i) => s + i.amount, 0);
    const ppnTotal = validated.lineItems.filter(i => i.ppn).reduce((s, i) => s + (i.ppnAmount || i.amount * 0.12), 0);
    const totalAmount = subtotal + ppnTotal;

    const invoice = await prisma.invoice.create({
      data: {
        number: invNumber,
        jobOrderId: validated.jobOrderId,
        customerId: validated.customerId,
        invoiceType: validated.invoiceType,
        billingPartyType: validated.billingPartyType,
        billingCompany: validated.billingCompany,
        billingAddress: validated.billingAddress,
        billingContact: validated.billingContact,
        billingEmail: validated.billingEmail,
        billingCountry: validated.billingCountry,
        billingNpwp: validated.billingNpwp,
        taxStatus: validated.taxStatus,
        currency: validated.currency,
        exchangeRate: validated.exchangeRate,
        subtotal,
        ppnAmount: Math.round(ppnTotal),
        totalAmount: Math.round(totalAmount),
        outstandingAmount: Math.round(totalAmount),
        paymentTerms: validated.paymentTerms,
        paymentMethod: validated.paymentMethod,
        bankName: validated.bankName,
        bankAccount: validated.bankAccount,
        swiftCode: validated.swiftCode,
        fakturPajakNo: validated.fakturPajakNo,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
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
            ppn: item.ppn,
            ppnAmount: item.ppnAmount || (item.ppn ? item.amount * 0.12 : 0),
            notes: item.notes,
          })),
        },
      },
      include: { lineItems: true, jobOrder: { select: { id: true, number: true } } },
    });

    return NextResponse.json({ data: invoice }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
