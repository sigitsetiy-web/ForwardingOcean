import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createAssignmentSchema = z.object({


  jobOrderId: z.string().min(1),
  plateNumber: z.string().min(1),
  driverName: z.string().min(1),
  driverPhone: z.string().optional(),
  vendorName: z.string().optional(),
  spkNumber: z.string().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  departureTime: z.string().optional(),
  estimatedArrival: z.string().optional(),
  notes: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["ASSIGNED", "DEPARTED", "DELIVERED", "POD_RECEIVED"]),
  arrivalTime: z.string().optional(),
  photos: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// GET /api/trucking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobOrderId = searchParams.get("jobOrderId") || "";
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};
    if (jobOrderId) where.jobOrderId = jobOrderId;
    if (status) where.status = status;

    const assignments = await prisma.truckAssignment.findMany({
      where,
      include: {
        jobOrder: {
          select: { id: true, number: true, customer: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: assignments });
  } catch (error) {
    console.warn("Trucking: Using mock data");
    return NextResponse.json({ data: [] });
  }
}

// POST /api/trucking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createAssignmentSchema.parse(body);

    const assignment = await prisma.truckAssignment.create({
      data: {
        jobOrderId: validated.jobOrderId,
        plateNumber: validated.plateNumber,
        driverName: validated.driverName,
        driverPhone: validated.driverPhone,
        vendorName: validated.vendorName,
        spkNumber: validated.spkNumber,
        origin: validated.origin,
        destination: validated.destination,
        departureTime: validated.departureTime
          ? new Date(validated.departureTime)
          : undefined,
        estimatedArrival: validated.estimatedArrival
          ? new Date(validated.estimatedArrival)
          : undefined,
        notes: validated.notes,
        status: "ASSIGNED",
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        jobOrderId: validated.jobOrderId,
        action: "TRUCK_ASSIGNED",
        description: `Kendaraan ${validated.plateNumber} (${validated.driverName}) ditugaskan`,
        userId: "system",
      },
    });

    return NextResponse.json({ data: assignment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
