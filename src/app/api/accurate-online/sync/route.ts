import { NextRequest, NextResponse } from "next/server";
import { getAccurateService } from "@/lib/accurate-online";
import { z } from "zod";

const syncSchema = z.object({
  action: z.enum([
    "sync_customer",
    "create_ar_invoice",
    "create_ap_invoice",
    "sync_payment",
    "get_exchange_rate",
  ]),
  customerId: z.string().optional(),
  jobOrderId: z.string().optional(),
  vendorName: z.string().optional(),
  date: z.string().optional(),
  currency: z.string().optional(),
});

// POST /api/accurate-online/sync
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = syncSchema.parse(body);
    const service = getAccurateService();

    switch (validated.action) {
      case "sync_customer": {
        if (!validated.customerId) {
          return NextResponse.json(
            { error: "customerId is required" },
            { status: 400 }
          );
        }
        await service.syncCustomer(validated.customerId);
        return NextResponse.json({ message: "Customer synced successfully" });
      }

      case "create_ar_invoice": {
        if (!validated.jobOrderId) {
          return NextResponse.json(
            { error: "jobOrderId is required" },
            { status: 400 }
          );
        }
        await service.createARInvoice(validated.jobOrderId);
        return NextResponse.json({
          message: "AR Invoice created successfully",
        });
      }

      case "create_ap_invoice": {
        if (!validated.jobOrderId || !validated.vendorName) {
          return NextResponse.json(
            { error: "jobOrderId and vendorName are required" },
            { status: 400 }
          );
        }
        await service.createAPInvoice(
          validated.jobOrderId,
          validated.vendorName
        );
        return NextResponse.json({
          message: "AP Invoice created successfully",
        });
      }

      case "sync_payment": {
        if (!validated.jobOrderId) {
          return NextResponse.json(
            { error: "jobOrderId is required" },
            { status: 400 }
          );
        }
        const isPaid = await service.syncPaymentStatus(validated.jobOrderId);
        return NextResponse.json({ isPaid });
      }

      case "get_exchange_rate": {
        const date =
          validated.date || new Date().toLocaleDateString("en-GB");
        const currency = validated.currency || "USD";
        const rate = await service.getExchangeRate(date, currency);
        return NextResponse.json({ rate, currency, date });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Accurate Online sync error:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
