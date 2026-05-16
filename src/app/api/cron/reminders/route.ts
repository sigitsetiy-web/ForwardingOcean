import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { sendDocumentReminderEmail, sendInvoiceOverdueEmail } from "@/lib/email";

// POST /api/cron/reminders - Run daily reminder checks
// This endpoint should be called by a cron job (e.g., Vercel Cron)
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (optional security)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    let documentReminders = 0;
    let invoiceReminders = 0;
    let etaReminders = 0;
    let uninvoicedReminders = 0;

    // ============================================================
    // 1. Document deadline reminders (H-3)
    // ============================================================
    const pendingDocuments = await prisma.document.findMany({
      where: {
        status: "PENDING",
        deadline: { gte: now, lte: threeDaysFromNow },
      },
      include: {
        jobOrder: {
          select: {
            id: true,
            number: true,
            assignedTo: true,
            createdById: true,
          },
        },
      },
    });

    for (const doc of pendingDocuments) {
      const daysLeft = Math.ceil(
        (new Date(doc.deadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const userId = doc.jobOrder.assignedTo || doc.jobOrder.createdById;

      if (userId) {
        await createNotification({
          userId,
          type: "DOCUMENT_REMINDER",
          title: "Reminder Dokumen",
          message: `Dokumen "${doc.name}" untuk JO ${doc.jobOrder.number} harus diupload dalam ${daysLeft} hari.`,
          entityType: "DOCUMENT",
          entityId: doc.id,
        });

        // Send email
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        });
        if (user?.email) {
          await sendDocumentReminderEmail(
            user.email,
            doc.jobOrder.number,
            doc.name,
            daysLeft
          );
        }

        documentReminders++;
      }
    }

    // ============================================================
    // 2. Completed but not invoiced > 3 days
    // ============================================================
    const uninvoicedJOs = await prisma.jobOrder.findMany({
      where: {
        status: "COMPLETED",
        updatedAt: { lte: threeDaysAgo },
      },
      select: {
        id: true,
        number: true,
        createdById: true,
        branchId: true,
      },
    });

    for (const jo of uninvoicedJOs) {
      // Notify finance users in the same branch
      const financeUsers = await prisma.user.findMany({
        where: {
          isActive: true,
          OR: [
            { role: "FINANCE", branchId: jo.branchId },
            { role: "OWNER" },
          ],
        },
        select: { id: true },
      });

      for (const finUser of financeUsers) {
        await createNotification({
          userId: finUser.id,
          type: "SYSTEM",
          title: "JO Belum Diinvoice",
          message: `Job Order ${jo.number} sudah selesai lebih dari 3 hari tapi belum diinvoice.`,
          entityType: "JOB_ORDER",
          entityId: jo.id,
        });
      }

      uninvoicedReminders++;
    }

    // ============================================================
    // 3. Invoice overdue (INVOICED > 30 days)
    // ============================================================
    const overdueInvoices = await prisma.jobOrder.findMany({
      where: {
        status: "INVOICED",
        updatedAt: { lte: thirtyDaysAgo },
      },
      select: {
        id: true,
        number: true,
        totalRevenue: true,
        branchId: true,
        createdById: true,
        updatedAt: true,
      },
    });

    for (const jo of overdueInvoices) {
      const daysPastDue = Math.ceil(
        (now.getTime() - new Date(jo.updatedAt || now).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Notify finance and owner
      const notifyUsers = await prisma.user.findMany({
        where: {
          isActive: true,
          OR: [
            { role: "FINANCE", branchId: jo.branchId },
            { role: "OWNER" },
          ],
        },
        select: { id: true, email: true },
      });

      for (const notifyUser of notifyUsers) {
        await createNotification({
          userId: notifyUser.id,
          type: "INVOICE_OVERDUE",
          title: "Invoice Overdue",
          message: `Invoice JO ${jo.number} sudah lewat ${daysPastDue} hari dari jatuh tempo.`,
          entityType: "JOB_ORDER",
          entityId: jo.id,
        });

        if (notifyUser.email) {
          await sendInvoiceOverdueEmail(
            notifyUser.email,
            jo.number,
            daysPastDue,
            Number(jo.totalRevenue || 0)
          );
        }
      }

      invoiceReminders++;
    }

    // ============================================================
    // 4. ETA/ETD today notifications
    // ============================================================
    const todayShipments = await prisma.jobOrder.findMany({
      where: {
        status: { in: ["CONFIRMED", "IN_PROGRESS"] },
        OR: [
          { etd: { gte: todayStart, lte: todayEnd } },
          { eta: { gte: todayStart, lte: todayEnd } },
        ],
      },
      select: {
        id: true,
        number: true,
        etd: true,
        eta: true,
        assignedTo: true,
        createdById: true,
      },
    });

    for (const shipment of todayShipments) {
      const userId = shipment.assignedTo || shipment.createdById;
      if (userId) {
        const isEtd = shipment.etd && shipment.etd >= todayStart && shipment.etd <= todayEnd;
        const isEta = shipment.eta && shipment.eta >= todayStart && shipment.eta <= todayEnd;

        await createNotification({
          userId,
          type: "ETA_REMINDER",
          title: isEta ? "ETA Hari Ini" : "ETD Hari Ini",
          message: `${isEta ? "Kedatangan" : "Keberangkatan"} JO ${shipment.number} dijadwalkan hari ini.`,
          entityType: "JOB_ORDER",
          entityId: shipment.id,
        });

        etaReminders++;
      }
    }

    return NextResponse.json({
      message: "Reminders processed successfully",
      summary: {
        documentReminders,
        uninvoicedReminders,
        invoiceReminders,
        etaReminders,
        processedAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error running reminders:", error);
    return NextResponse.json(
      { error: "Failed to process reminders" },
      { status: 500 }
    );
  }
}
