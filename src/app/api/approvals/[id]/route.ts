import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { createNotification } from "@/lib/notifications";

const processApprovalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  approvedById: z.string().min(1),
  notes: z.string().optional(),
});

// PUT /api/approvals/[id] - Process approval (approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = processApprovalSchema.parse(body);

    const approval = await prisma.approval.update({
      where: { id: params.id },
      data: {
        status: validated.status,
        approvedById: validated.approvedById,
        notes: validated.notes,
      },
      include: {
        jobOrder: { select: { id: true, number: true, createdById: true, branchId: true } },
        quotation: { select: { id: true, number: true, createdById: true, branchId: true } },
      },
    });

    // Update entity status based on approval
    if (validated.status === "APPROVED") {
      if (approval.entityType === "JOB_ORDER" && approval.jobOrderId) {
        await prisma.jobOrder.update({
          where: { id: approval.jobOrderId },
          data: { status: "CONFIRMED" },
        });

        // Update milestone
        await prisma.milestone.updateMany({
          where: {
            jobOrderId: approval.jobOrderId,
            type: "ORDER_CONFIRMED",
          },
          data: {
            status: "DONE",
            actualDate: new Date(),
            doneById: validated.approvedById,
          },
        });
      }

      if (approval.entityType === "QUOTATION" && approval.quotationId) {
        await prisma.quotation.update({
          where: { id: approval.quotationId },
          data: { status: "APPROVED" },
        });
      }

      if (approval.entityType === "DOCUMENT" && approval.documentId) {
        await prisma.document.update({
          where: { id: approval.documentId },
          data: { status: "APPROVED" },
        });
      }
    }

    // Notify the requester about the result
    const createdById =
      approval.jobOrder?.createdById || approval.quotation?.createdById;
    if (createdById) {
      const entityNumber =
        approval.jobOrder?.number || approval.quotation?.number || "";
      await createNotification({
        userId: createdById,
        type: "APPROVAL_RESULT",
        title: `${approval.entityType} ${validated.status === "APPROVED" ? "Disetujui" : "Ditolak"}`,
        message: `${approval.entityType} ${entityNumber} telah ${validated.status === "APPROVED" ? "disetujui" : "ditolak"}.${validated.notes ? ` Catatan: ${validated.notes}` : ""}`,
        entityType: approval.entityType,
        entityId: approval.entityId,
      });
    }

    return NextResponse.json({ data: approval });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error processing approval:", error);
    return NextResponse.json(
      { error: "Failed to process approval" },
      { status: 500 }
    );
  }
}
