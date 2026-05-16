import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { calculateProfit } from "@/lib/profit-calculator";

export const dynamic = "force-dynamic";

const revenueSchema = z.object({


  item: z.string().min(1),
  currency: z.string().default("IDR"),
  amount: z.number().min(0),
  rate: z.number().optional(),
  amountIdr: z.number().min(0),
  aoAccountId: z.string().optional(),
});

const costSchema = z.object({
  vendor: z.string().optional(),
  item: z.string().min(1),
  currency: z.string().default("IDR"),
  amount: z.number().min(0),
  rate: z.number().optional(),
  amountIdr: z.number().min(0),
  aoAccountId: z.string().optional(),
});

const financialSchema = z.object({
  type: z.enum(["revenue", "cost"]),
  data: z.union([revenueSchema, costSchema]),
});

// GET /api/job-orders/[id]/financial - Get financial summary
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [revenues, costs] = await Promise.all([
      prisma.jobRevenue.findMany({
        where: { jobOrderId: params.id },
        orderBy: { createdAt: "asc" },
      }),
      prisma.jobCost.findMany({
        where: { jobOrderId: params.id },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const revenueItems = revenues.map((r) => ({
      item: r.item,
      currency: r.currency,
      amount: Number(r.amount),
      rate: r.rate ? Number(r.rate) : undefined,
      amountIdr: Number(r.amountIdr),
    }));

    const costItems = costs.map((c) => ({
      vendor: c.vendor || undefined,
      item: c.item,
      currency: c.currency,
      amount: Number(c.amount),
      rate: c.rate ? Number(c.rate) : undefined,
      amountIdr: Number(c.amountIdr),
    }));

    const profitSummary = calculateProfit(revenueItems, costItems);

    return NextResponse.json({
      data: {
        revenues,
        costs,
        summary: profitSummary,
      },
    });
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial data" },
      { status: 500 }
    );
  }
}

// POST /api/job-orders/[id]/financial - Add revenue or cost
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = financialSchema.parse(body);

    if (validated.type === "revenue") {
      const data = validated.data as z.infer<typeof revenueSchema>;
      await prisma.jobRevenue.create({
        data: {
          jobOrderId: params.id,
          item: data.item,
          currency: data.currency,
          amount: data.amount,
          rate: data.rate,
          amountIdr: data.amountIdr,
          aoAccountId: data.aoAccountId,
        },
      });
    } else {
      const data = validated.data as z.infer<typeof costSchema>;
      await prisma.jobCost.create({
        data: {
          jobOrderId: params.id,
          vendor: data.vendor,
          item: data.item,
          currency: data.currency,
          amount: data.amount,
          rate: data.rate,
          amountIdr: data.amountIdr,
          aoAccountId: data.aoAccountId,
        },
      });
    }

    // Recalculate totals
    const [revenues, costs] = await Promise.all([
      prisma.jobRevenue.findMany({ where: { jobOrderId: params.id } }),
      prisma.jobCost.findMany({ where: { jobOrderId: params.id } }),
    ]);

    const totalRevenue = revenues.reduce(
      (sum, r) => sum + Number(r.amountIdr),
      0
    );
    const totalCost = costs.reduce((sum, c) => sum + Number(c.amountIdr), 0);
    const grossProfit = totalRevenue - totalCost;

    // Update cached totals on job order
    await prisma.jobOrder.update({
      where: { id: params.id },
      data: { totalRevenue, totalCost, grossProfit },
    });

    return NextResponse.json(
      {
        message: "Financial data added",
        summary: { totalRevenue, totalCost, grossProfit },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error adding financial data:", error);
    return NextResponse.json(
      { error: "Failed to add financial data" },
      { status: 500 }
    );
  }
}
