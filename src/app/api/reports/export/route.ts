import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export const dynamic = 'force-dynamic';

// GET /api/reports/export - Export profitability report as CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId") || "";
    const customerId = searchParams.get("customerId") || "";
    const serviceType = searchParams.get("serviceType") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const format = searchParams.get("format") || "csv"; // csv or json

    const where: Record<string, unknown> = {
      status: { in: ["COMPLETED", "INVOICED", "CLOSED"] },
    };

    if (branchId) where.branchId = branchId;
    if (customerId) where.customerId = customerId;
    if (serviceType) where.serviceType = serviceType;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate)
        (where.createdAt as Record<string, unknown>).gte = new Date(startDate);
      if (endDate)
        (where.createdAt as Record<string, unknown>).lte = new Date(endDate);
    }

    const jobOrders = await prisma.jobOrder.findMany({
      where,
      include: {
        customer: { select: { name: true, code: true } },
        branch: { select: { name: true, code: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "No. JO",
        "Pelanggan",
        "Kode Pelanggan",
        "Cabang",
        "Jenis Layanan",
        "Status",
        "Revenue (IDR)",
        "Cost (IDR)",
        "Profit (IDR)",
        "Margin (%)",
        "Tanggal Dibuat",
      ];

      const rows = jobOrders.map((jo) => {
        const revenue = Number(jo.totalRevenue || 0);
        const cost = Number(jo.totalCost || 0);
        const profit = revenue - cost;
        const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : "0";

        return [
          jo.number,
          jo.customer.name,
          jo.customer.code,
          jo.branch.name,
          jo.serviceType,
          jo.status,
          revenue.toString(),
          cost.toString(),
          profit.toString(),
          margin,
          new Date(jo.createdAt).toLocaleDateString("id-ID"),
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      // Add BOM for Excel compatibility
      const bom = "\uFEFF";

      return new NextResponse(bom + csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="laporan-profitabilitas-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // JSON format
    return NextResponse.json({
      data: jobOrders.map((jo) => ({
        number: jo.number,
        customer: jo.customer.name,
        customerCode: jo.customer.code,
        branch: jo.branch.name,
        serviceType: jo.serviceType,
        status: jo.status,
        revenue: Number(jo.totalRevenue || 0),
        cost: Number(jo.totalCost || 0),
        profit: Number(jo.grossProfit || 0),
        margin:
          Number(jo.totalRevenue || 0) > 0
            ? (Number(jo.grossProfit || 0) / Number(jo.totalRevenue || 0)) * 100
            : 0,
        createdAt: jo.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error exporting report:", error);
    return NextResponse.json(
      { error: "Failed to export report" },
      { status: 500 }
    );
  }
}
