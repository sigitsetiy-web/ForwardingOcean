import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId") || "";
    const branchFilter = branchId ? { branchId } : {};

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [activeJobOrders, revenueThisMonth, revenueLastMonth, profitThisMonth, pendingApprovals] = await Promise.all([
      prisma.jobOrder.count({ where: { ...branchFilter, status: { in: ["IN_PROGRESS", "CONFIRMED"] } } }),
      prisma.jobOrder.aggregate({ where: { ...branchFilter, createdAt: { gte: startOfMonth } }, _sum: { totalRevenue: true } }),
      prisma.jobOrder.aggregate({ where: { ...branchFilter, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { totalRevenue: true } }),
      prisma.jobOrder.aggregate({ where: { ...branchFilter, createdAt: { gte: startOfMonth }, totalRevenue: { gt: 0 } }, _sum: { totalRevenue: true, grossProfit: true } }),
      prisma.approval.count({ where: { status: "PENDING" } }),
    ]);

    const revThisMonth = Number(revenueThisMonth._sum.totalRevenue || 0);
    const revLastMonth = Number(revenueLastMonth._sum.totalRevenue || 0);
    const totalRevForMargin = Number(profitThisMonth._sum.totalRevenue || 0);
    const totalProfitForMargin = Number(profitThisMonth._sum.grossProfit || 0);

    const recentJobOrders = await prisma.jobOrder.findMany({
      where: branchFilter,
      select: { id: true, number: true, status: true, serviceType: true, createdAt: true, customer: { select: { id: true, name: true } }, branch: { select: { id: true, name: true, code: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    let branchSummary: unknown[] = [];
    if (!branchId) {
      const branches = await prisma.branch.findMany({ where: { isActive: true }, select: { id: true, name: true, code: true } });
      branchSummary = await Promise.all(branches.map(async (branch: { id: string; name: string; code: string }) => {
        const [ao, rev] = await Promise.all([
          prisma.jobOrder.count({ where: { branchId: branch.id, status: { in: ["IN_PROGRESS", "CONFIRMED"] } } }),
          prisma.jobOrder.aggregate({ where: { branchId: branch.id, createdAt: { gte: startOfMonth } }, _sum: { totalRevenue: true } }),
        ]);
        return { branchId: branch.id, branchName: branch.name, branchCode: branch.code, activeOrders: ao, revenueThisMonth: Number(rev._sum.totalRevenue || 0) };
      }));
    }

    return NextResponse.json({
      data: {
        kpiCards: {
          activeJobOrders,
          revenueThisMonth: revThisMonth,
          revenueLastMonth: revLastMonth,
          revenueGrowth: revLastMonth > 0 ? ((revThisMonth - revLastMonth) / revLastMonth) * 100 : 0,
          avgProfitMargin: totalRevForMargin > 0 ? Math.round((totalProfitForMargin / totalRevForMargin) * 10000) / 100 : 0,
          pendingApprovals,
        },
        recentJobOrders,
        alerts: { documentsApproachingDeadline: [], completedNotInvoiced: [], invoicesPastDue: [], etdEtaToday: [] },
        branchSummary,
      },
    });
  } catch (error) {
    console.error("Dashboard DB Error:", error);
    return NextResponse.json({
      data: { kpiCards: { activeJobOrders: 0, revenueThisMonth: 0, revenueLastMonth: 0, revenueGrowth: 0, avgProfitMargin: 0, pendingApprovals: 0 }, recentJobOrders: [], alerts: { documentsApproachingDeadline: [], completedNotInvoiced: [], invoicesPastDue: [], etdEtaToday: [] }, branchSummary: [] },
      error: String(error),
    });
  }
}
