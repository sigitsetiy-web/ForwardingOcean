import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createDocumentSchema = z.object({


  jobOrderId: z.string().min(1),
  type: z.enum([
    "BL",
    "AWB",
    "COMMERCIAL_INVOICE",
    "PACKING_LIST",
    "PIB",
    "PEB",
    "SPPB",
    "DO",
    "POD",
    "COO",
    "SI",
    "SPK",
    "SURAT_JALAN",
    "BAST",
    "GATE_PASS",
    "ARRIVAL_NOTICE",
    "PHYTOSANITARY",
    "OTHER",
  ]),
  name: z.string().min(1),
  fileUrl: z.string().optional(),
  deadline: z.string().optional(),
  notes: z.string().optional(),
  uploadedById: z.string().optional(),
});

// GET /api/documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobOrderId = searchParams.get("jobOrderId") || "";
    const status = searchParams.get("status") || "";
    const type = searchParams.get("type") || "";

    const where: Record<string, unknown> = {};

    if (jobOrderId) where.jobOrderId = jobOrderId;
    if (status) where.status = status;
    if (type) where.type = type;

    const documents = await prisma.document.findMany({
      where,
      include: {
        jobOrder: { select: { id: true, number: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST /api/documents
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createDocumentSchema.parse(body);

    const document = await prisma.document.create({
      data: {
        jobOrderId: validated.jobOrderId,
        type: validated.type,
        name: validated.name,
        fileUrl: validated.fileUrl,
        deadline: validated.deadline ? new Date(validated.deadline) : undefined,
        notes: validated.notes,
        uploadedById: validated.uploadedById,
        status: validated.fileUrl ? "UPLOADED" : "PENDING",
      },
      include: {
        jobOrder: { select: { id: true, number: true } },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        jobOrderId: validated.jobOrderId,
        action: "DOCUMENT_ADDED",
        description: `Dokumen "${validated.name}" (${validated.type}) ditambahkan`,
        userId: validated.uploadedById || "system",
      },
    });

    return NextResponse.json({ data: document }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
