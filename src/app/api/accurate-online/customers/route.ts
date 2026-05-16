import { NextRequest, NextResponse } from "next/server";
import { getAccurateService } from "@/lib/accurate-online";


export const dynamic = 'force-dynamic';

// GET /api/accurate-online/customers - Fetch customers from Accurate Online
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const keyword = searchParams.get("keyword") || "";

    const service = getAccurateService();
    await service.init();

    // Build params for Accurate API
    const params: Record<string, string> = {
      fields: "id,customerNo,name,mobilePhone,email,billStreet,npwpNo",
      "sp.pageSize": String(pageSize),
      "sp.page": String(page - 1),
    };

    if (keyword) {
      params["filter.keywords.op"] = "LIKE";
      params["filter.keywords.val"] = keyword;
    }

    const result = await service.request("GET", "/customer/list.do", undefined, params);

    if (result.s && Array.isArray(result.d)) {
      const responseData = result as unknown as { sp?: { rowCount?: number } };
      return NextResponse.json({
        data: result.d,
        total: responseData.sp?.rowCount || result.d.length,
        page,
        pageSize,
      });
    }

    return NextResponse.json({
      data: [],
      error: Array.isArray(result.d) ? result.d.join(", ") : "Failed to fetch",
    });
  } catch (error) {
    console.error("Error fetching AO customers:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch customers from Accurate Online" },
      { status: 500 }
    );
  }
}

// POST /api/accurate-online/customers - Import customers from Accurate to FMS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customers } = body; // Array of AO customer objects to import

    if (!customers || !Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json(
        { error: "Pilih minimal 1 pelanggan untuk diimport" },
        { status: 400 }
      );
    }

    const prisma = (await import("@/lib/prisma")).default;
    const imported: string[] = [];
    const skipped: string[] = [];
    const errors: string[] = [];

    for (const aoCustomer of customers) {
      try {
        const code = aoCustomer.customerNo || `AO-${aoCustomer.id}`;

        // Check if already exists
        const existing = await prisma.customer.findFirst({
          where: {
            OR: [
              { code },
              { aoCustomerId: String(aoCustomer.id) },
            ],
          },
        });

        if (existing) {
          // Update existing
          await prisma.customer.update({
            where: { id: existing.id },
            data: {
              name: aoCustomer.name || existing.name,
              phone: aoCustomer.mobilePhone || existing.phone,
              email: aoCustomer.email || existing.email,
              address: aoCustomer.billStreet || existing.address,
              npwp: aoCustomer.npwpNo || existing.npwp,
              aoCustomerId: String(aoCustomer.id),
            },
          });
          skipped.push(`${code} - ${aoCustomer.name} (updated)`);
        } else {
          // Create new
          await prisma.customer.create({
            data: {
              code,
              name: aoCustomer.name || "Unknown",
              phone: aoCustomer.mobilePhone || undefined,
              email: aoCustomer.email || undefined,
              address: aoCustomer.billStreet || undefined,
              npwp: aoCustomer.npwpNo || undefined,
              segment: "IMPORTER", // Default segment
              leadStatus: "CUSTOMER",
              aoCustomerId: String(aoCustomer.id),
            },
          });
          imported.push(`${code} - ${aoCustomer.name}`);
        }
      } catch (err) {
        errors.push(
          `${aoCustomer.name}: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      }
    }

    return NextResponse.json({
      message: `Import selesai: ${imported.length} baru, ${skipped.length} diupdate, ${errors.length} gagal`,
      imported,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("Error importing AO customers:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Import failed" },
      { status: 500 }
    );
  }
}
