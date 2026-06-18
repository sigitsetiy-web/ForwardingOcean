import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorize, AuthUser } from "@/lib/api-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateDocumentSchema = z.object({


  status: z.enum(["PENDING", "UPLOADED", "VERIFIED", "APPROVED", "SENT"]).optional(),
  verifiedById: z.string().optional(),
  notes: z.string().optional(),
  deadline: z.string().optional(),
});

// GET /api/documents/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authorize(request, "read", "document");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        jobOrder: { select: { id: true, number: true } },
        approvals: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: document });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update document status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authorize(request, "update", "document");
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult as AuthUser;

  try {
    const body = await request.json();
    const validated = updateDocumentSchema.parse(body);
    const userId = user.id;

    const current = await prisma.document.findUnique({
      where: { id: params.id },
      select: { name: true, type: true, status: true, jobOrderId: true },
    });

    if (!current) {
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (validated.status) updateData.status = validated.status;
    if (validated.verifiedById) updateData.verifiedById = validated.verifiedById;
    if (validated.notes !== undefined) updateData.notes = validated.notes;
    if (validated.deadline) updateData.deadline = new Date(validated.deadline);

    const document = await prisma.document.update({
      where: { id: params.id },
      data: updateData,
    });

    // Log status change
    if (validated.status && validated.status !== current.status) {
      await prisma.activityLog.create({
        data: {
          jobOrderId: current.jobOrderId,
          action: "DOCUMENT_STATUS_CHANGED",
          description: `Status dokumen "${current.name}" berubah dari ${current.status} ke ${validated.status}`,
          userId,
        },
      });
    }

    return NextResponse.json({ data: document });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authorize(request, "delete", "document");
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult as AuthUser;

  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      select: { name: true, jobOrderId: true },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.document.delete({ where: { id: params.id } });

    // Log deletion
    await prisma.activityLog.create({
      data: {
        jobOrderId: document.jobOrderId,
        action: "DOCUMENT_DELETED",
        description: `Dokumen "${document.name}" dihapus`,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Dokumen berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
