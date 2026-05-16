import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateQuotationSchema = z.object({

export const dynamic = 'force-dynamic';

  status: z
    .enum(["DRAFT", "REVIEW", "APPROVED", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"])
    .optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/quotations/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        branch: true,
        items: { orderBy: { createdAt: "asc" } },
        approvals: { orderBy: { createdAt: "desc" } },
        salesOrder: { select: { id: true, number: true, status: true } },
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: quotation });
  } catch (error) {
    console.error("Error fetching quotation:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotation" },
      { status: 500 }
    );
  }
}

// PUT /api/quotations/[id] - Update quotation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateQuotationSchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (validated.status) updateData.status = validated.status;
    if (validated.origin) updateData.origin = validated.origin;
    if (validated.destination) updateData.destination = validated.destination;
    if (validated.validUntil) updateData.validUntil = new Date(validated.validUntil);
    if (validated.notes !== undefined) updateData.notes = validated.notes;

    const quotation = await prisma.quotation.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true, code: true } },
      },
    });

    // Auto-create approval when status changes to REVIEW
    if (validated.status === "REVIEW") {
      // Check if approval already exists
      const existingApproval = await prisma.approval.findFirst({
        where: { entityType: "QUOTATION", entityId: params.id, status: "PENDING" },
      });

      if (!existingApproval) {
        await prisma.approval.create({
          data: {
            entityType: "QUOTATION",
            entityId: params.id,
            quotationId: params.id,
            level: 1,
            status: "PENDING",
          },
        });

        // Notify approvers
        try {
          const { notifyApprovers } = await import("@/lib/notifications");
          const fullQt = await prisma.quotation.findUnique({ where: { id: params.id }, select: { number: true, branchId: true } });
          if (fullQt) {
            await notifyApprovers(fullQt.branchId, "QUOTATION", params.id, fullQt.number);
          }
        } catch (e) {
          console.warn("Failed to notify approvers:", e);
        }
      }
    }

    return NextResponse.json({ data: quotation });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error updating quotation:", error);
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    );
  }
}
