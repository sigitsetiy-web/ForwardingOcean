import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateJobOrderSchema = z.object({

export const dynamic = 'force-dynamic';

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
  status: z
    .enum(["DRAFT", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "INVOICED", "CLOSED"])
    .optional(),
  assignedTo: z.string().optional(),
});

// GET /api/job-orders/[id] - Get full detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobOrder = await prisma.jobOrder.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        branch: true,
        salesOrder: true,
        milestones: { orderBy: { createdAt: "asc" } },
        documents: { orderBy: { createdAt: "desc" } },
        revenues: { orderBy: { createdAt: "asc" } },
        costs: { orderBy: { createdAt: "asc" } },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        assignments: { orderBy: { createdAt: "desc" } },
        approvals: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!jobOrder) {
      return NextResponse.json(
        { error: "Job Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: jobOrder });
  } catch (error) {
    console.error("Error fetching job order:", error);
    return NextResponse.json(
      { error: "Failed to fetch job order" },
      { status: 500 }
    );
  }
}

// PUT /api/job-orders/[id] - Update job order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateJobOrderSchema.parse(body);
    const userId = body.userId || "system";

    // Get current job order for status change logging
    const current = await prisma.jobOrder.findUnique({
      where: { id: params.id },
      select: { status: true, number: true },
    });

    if (!current) {
      return NextResponse.json(
        { error: "Job Order not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = { ...validated };
    if (validated.etd) updateData.etd = new Date(validated.etd);
    if (validated.eta) updateData.eta = new Date(validated.eta);

    const jobOrder = await prisma.jobOrder.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true, code: true } },
      },
    });

    // Log status change
    if (validated.status && validated.status !== current.status) {
      await prisma.activityLog.create({
        data: {
          jobOrderId: params.id,
          action: "STATUS_CHANGED",
          description: `Status berubah dari ${current.status} ke ${validated.status}`,
          userId,
        },
      });

      // Update milestone if status changed to CONFIRMED
      if (validated.status === "CONFIRMED") {
        await prisma.milestone.updateMany({
          where: {
            jobOrderId: params.id,
            type: "ORDER_CONFIRMED",
          },
          data: {
            status: "DONE",
            actualDate: new Date(),
            doneById: userId,
          },
        });
      }
    }

    return NextResponse.json({ data: jobOrder });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error updating job order:", error);
    return NextResponse.json(
      { error: "Failed to update job order" },
      { status: 500 }
    );
  }
}
