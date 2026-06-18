import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorize, AuthUser } from "@/lib/api-auth";

export const dynamic = "force-dynamic";



// GET /api/reports/profitability - Profitability report
export async function GET(request: NextRequest) {
  const authResult = await authorize(request, "read", "report");
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId") || "";
    const customerId = searchParams.get("customerId") || "";
    const serviceType = searchParams.get("serviceType") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const groupBy = searchParams.get("groupBy") || "job_order"; // job_order, customer, branch, period

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
        customer: { select: { id: true, name: true, code: true } },
        branch: { select: { id: true, name: true, code: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate summary
    const totalRevenue = jobOrders.reduce(
      (sum, jo) => sum + Number(jo.totalRevenue || 0),
      0
    );
    const totalCost = jobOrders.reduce(
      (sum, jo) => sum + Number(jo.totalCost || 0),
      0
    );
    const totalProfit = totalRevenue - totalCost;
    const avgMargin =
      totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Group data based on groupBy parameter
    let grouped: Record<string, unknown>[] = [];

    if (groupBy === "customer") {
      const customerMap = new Map<
        string,
        { name: string; revenue: number; cost: number; count: number }
      >();

      jobOrders.forEach((jo) => {
        const key = jo.customerId;
        const existing = customerMap.get(key) || {
          name: jo.customer.name,
          revenue: 0,
          cost: 0,
          count: 0,
        };
        existing.revenue += Number(jo.totalRevenue || 0);
        existing.cost += Number(jo.totalCost || 0);
        existing.count += 1;
        customerMap.set(key, existing);
      });

      grouped = Array.from(customerMap.entries()).map(([id, data]) => ({
        id,
        name: data.name,
        revenue: data.revenue,
        cost: data.cost,
        profit: data.revenue - data.cost,
        margin:
          data.revenue > 0
            ? ((data.revenue - data.cost) / data.revenue) * 100
            : 0,
        count: data.count,
      }));
    } else if (groupBy === "branch") {
      const branchMap = new Map<
        string,
        { name: string; revenue: number; cost: number; count: number }
      >();

      jobOrders.forEach((jo) => {
        const key = jo.branchId;
        const existing = branchMap.get(key) || {
          name: jo.branch.name,
          revenue: 0,
          cost: 0,
          count: 0,
        };
        existing.revenue += Number(jo.totalRevenue || 0);
        existing.cost += Number(jo.totalCost || 0);
        existing.count += 1;
        branchMap.set(key, existing);
      });

      grouped = Array.from(branchMap.entries()).map(([id, data]) => ({
        id,
        name: data.name,
        revenue: data.revenue,
        cost: data.cost,
        profit: data.revenue - data.cost,
        margin:
          data.revenue > 0
            ? ((data.revenue - data.cost) / data.revenue) * 100
            : 0,
        count: data.count,
      }));
    }

    return NextResponse.json({
      data: {
        jobOrders: jobOrders.map((jo) => ({
          id: jo.id,
          number: jo.number,
          customer: jo.customer.name,
          branch: jo.branch.name,
          serviceType: jo.serviceType,
          revenue: Number(jo.totalRevenue || 0),
          cost: Number(jo.totalCost || 0),
          profit: Number(jo.grossProfit || 0),
          margin:
            Number(jo.totalRevenue || 0) > 0
              ? (Number(jo.grossProfit || 0) / Number(jo.totalRevenue || 0)) *
                100
              : 0,
          status: jo.status,
          createdAt: jo.createdAt,
        })),
        grouped,
        summary: {
          totalRevenue,
          totalCost,
          totalProfit,
          avgMargin: Math.round(avgMargin * 100) / 100,
          totalJO: jobOrders.length,
          profitable: jobOrders.filter(
            (jo) => Number(jo.grossProfit || 0) > 0
          ).length,
          loss: jobOrders.filter((jo) => Number(jo.grossProfit || 0) < 0)
            .length,
        },
      },
    });
  } catch (error) {
    console.error("Error generating profitability report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
