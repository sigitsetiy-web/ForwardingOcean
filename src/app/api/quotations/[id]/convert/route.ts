import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateJobOrderNumber } from "@/lib/job-number-generator";


export const dynamic = 'force-dynamic';

// POST /api/quotations/[id]/convert - Convert quotation to job order
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { createdById, assignedTo } = body;

    if (!createdById) {
      return NextResponse.json(
        { error: "createdById wajib diisi" },
        { status: 400 }
      );
    }

    // Get quotation with all details
    const quotation = await prisma.quotation.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        branch: true,
        items: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if quotation is in ACCEPTED or APPROVED status
    if (!["ACCEPTED", "APPROVED"].includes(quotation.status)) {
      return NextResponse.json(
        {
          error: `Quotation harus berstatus APPROVED atau ACCEPTED untuk dikonversi. Status saat ini: ${quotation.status}`,
        },
        { status: 400 }
      );
    }

    // Check if already converted - check by looking for existing SO linked to this QT
    const existingSO = await prisma.salesOrder.findUnique({
      where: { quotationId: quotation.id },
    });

    if (existingSO) {
      return NextResponse.json(
        { error: "Quotation sudah dikonversi" },
        { status: 400 }
      );
    }

    // Generate JO number
    const joNumber = await generateJobOrderNumber(
      quotation.branch.code,
      quotation.serviceType
    );

    // Create Job Order from Quotation (skip Sales Order for simplicity)
    const jobOrder = await prisma.jobOrder.create({
      data: {
        number: joNumber,
        customerId: quotation.customerId,
        serviceType: quotation.serviceType,
        branchId: quotation.branchId,
        pol: quotation.origin,
        pod: quotation.destination,
        status: "DRAFT",
        createdById,
        assignedTo,
        // Create default milestones
        milestones: {
          create: [
            { type: "ORDER_CONFIRMED", status: "PENDING" },
            { type: "DOCUMENT_RECEIVED", status: "PENDING" },
            { type: "CUSTOMS_STARTED", status: "PENDING" },
            { type: "CUSTOMS_DONE", status: "PENDING" },
            { type: "CARGO_RELEASED", status: "PENDING" },
            { type: "DELIVERY_TO_CONSIGNEE", status: "PENDING" },
            { type: "POD_RECEIVED", status: "PENDING" },
            { type: "INVOICE_ISSUED", status: "PENDING" },
            { type: "PAYMENT_RECEIVED", status: "PENDING" },
            { type: "JOB_CLOSED", status: "PENDING" },
          ],
        },
        // Pre-fill revenue from quotation items
        revenues: {
          create: quotation.items.map((item) => ({
            item: item.description,
            currency: item.currency,
            amount: item.amount,
            amountIdr: item.amount, // Assuming IDR for now
          })),
        },
        // Log activity
        activities: {
          create: {
            action: "CREATED_FROM_QUOTATION",
            description: `Job Order ${joNumber} dibuat dari Quotation ${quotation.number}`,
            userId: createdById,
          },
        },
      },
      include: {
        customer: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true, code: true } },
        milestones: true,
      },
    });

    // Update quotation status to ACCEPTED if it was APPROVED
    if (quotation.status === "APPROVED") {
      await prisma.quotation.update({
        where: { id: quotation.id },
        data: { status: "ACCEPTED" },
      });
    }

    // Calculate total revenue
    const totalRevenue = quotation.items.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    await prisma.jobOrder.update({
      where: { id: jobOrder.id },
      data: { totalRevenue },
    });

    return NextResponse.json(
      {
        data: jobOrder,
        message: `Quotation ${quotation.number} berhasil dikonversi ke Job Order ${joNumber}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error converting quotation:", error);
    return NextResponse.json(
      { error: "Gagal mengkonversi quotation ke job order" },
      { status: 500 }
    );
  }
}
