import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { notifyApprovers } from "@/lib/notifications";

const createApprovalSchema = z.object({

export const dynamic = 'force-dynamic';

  entityType: z.enum(["JOB_ORDER", "QUOTATION", "DOCUMENT", "INVOICE"]),
  entityId: z.string().min(1),
  level: z.number().min(1).max(3),
  jobOrderId: z.string().optional(),
  quotationId: z.string().optional(),
  documentId: z.string().optional(),
});

const processApprovalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  approvedById: z.string().min(1),
  notes: z.string().optional(),
});

// GET /api/approvals - List pending approvals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";
    const entityType = searchParams.get("entityType") || "";

    const where: Record<string, unknown> = { status };
    if (entityType) where.entityType = entityType;

    const approvals = await prisma.approval.findMany({
      where,
      include: {
        jobOrder: { select: { id: true, number: true, customer: { select: { name: true } } } },
        quotation: { select: { id: true, number: true, customer: { select: { name: true } } } },
        document: { select: { id: true, name: true, type: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: approvals });
  } catch (error) {
    console.warn("Approvals: Using mock data");
    return NextResponse.json({ data: [] });
  }
}

// POST /api/approvals - Create approval request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createApprovalSchema.parse(body);

    const approval = await prisma.approval.create({
      data: {
        entityType: validated.entityType,
        entityId: validated.entityId,
        level: validated.level,
        jobOrderId: validated.jobOrderId,
        quotationId: validated.quotationId,
        documentId: validated.documentId,
        status: "PENDING",
      },
    });

    // Notify approvers
    // Determine branch from entity
    let branchId = "";
    let entityNumber = "";

    if (validated.jobOrderId) {
      const jo = await prisma.jobOrder.findUnique({
        where: { id: validated.jobOrderId },
        select: { branchId: true, number: true },
      });
      if (jo) {
        branchId = jo.branchId;
        entityNumber = jo.number;
      }
    } else if (validated.quotationId) {
      const qt = await prisma.quotation.findUnique({
        where: { id: validated.quotationId },
        select: { branchId: true, number: true },
      });
      if (qt) {
        branchId = qt.branchId;
        entityNumber = qt.number;
      }
    }

    if (branchId) {
      await notifyApprovers(
        branchId,
        validated.entityType,
        validated.entityId,
        entityNumber
      );
    }

    return NextResponse.json({ data: approval }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating approval:", error);
    return NextResponse.json(
      { error: "Failed to create approval" },
      { status: 500 }
    );
  }
}
