import { NextRequest, NextResponse } from "next/server";


export const dynamic = 'force-dynamic';

// Mock data for demo mode
const MOCK_DASHBOARD = {
  kpiCards: {
    activeJobOrders: 12,
    revenueThisMonth: 850000000,
    revenueLastMonth: 720000000,
    revenueGrowth: 18.1,
    avgProfitMargin: 22.5,
    pendingApprovals: 4,
  },
  recentJobOrders: [
    { id: "jo-1", number: "SMG-IMP-202605-0012", status: "IN_PROGRESS", serviceType: "SEA_IMPORT", customer: { id: "c1", name: "PT Maju Jaya" }, branch: { id: "b1", name: "Semarang", code: "SMG" }, createdAt: "2026-05-14T08:00:00Z" },
    { id: "jo-2", number: "JKT-EXP-202605-0008", status: "CONFIRMED", serviceType: "SEA_EXPORT", customer: { id: "c2", name: "CV Sentosa Abadi" }, branch: { id: "b2", name: "Jakarta", code: "JKT" }, createdAt: "2026-05-13T10:00:00Z" },
    { id: "jo-3", number: "SMG-DOM-202605-0005", status: "COMPLETED", serviceType: "DOMESTIC", customer: { id: "c3", name: "PT Nusantara Logistik" }, branch: { id: "b1", name: "Semarang", code: "SMG" }, createdAt: "2026-05-12T09:00:00Z" },
    { id: "jo-4", number: "SBY-AIM-202605-0003", status: "IN_PROGRESS", serviceType: "AIR_IMPORT", customer: { id: "c4", name: "PT Global Trade" }, branch: { id: "b3", name: "Surabaya", code: "SBY" }, createdAt: "2026-05-11T14:00:00Z" },
    { id: "jo-5", number: "JKT-IMP-202605-0015", status: "DRAFT", serviceType: "SEA_IMPORT", customer: { id: "c5", name: "PT Indo Cargo" }, branch: { id: "b2", name: "Jakarta", code: "JKT" }, createdAt: "2026-05-10T11:00:00Z" },
  ],
  alerts: {
    documentsApproachingDeadline: [
      { id: "d1", name: "Bill of Lading", type: "BL", deadline: "2026-05-17T00:00:00Z", jobOrder: { id: "jo-1", number: "SMG-IMP-202605-0012" } },
      { id: "d2", name: "PIB", type: "PIB", deadline: "2026-05-18T00:00:00Z", jobOrder: { id: "jo-4", number: "SBY-AIM-202605-0003" } },
    ],
    completedNotInvoiced: [
      { id: "jo-3", number: "SMG-DOM-202605-0005", customer: { name: "PT Nusantara Logistik" }, updatedAt: "2026-05-10T00:00:00Z" },
    ],
    invoicesPastDue: [],
    etdEtaToday: [
      { id: "jo-1", number: "SMG-IMP-202605-0012", eta: "2026-05-15T00:00:00Z", etd: null, vesselName: "EVER GIVEN", pol: "CNSHA", pod: "IDSMG", customer: { name: "PT Maju Jaya" } },
    ],
  },
  branchSummary: [
    { branchId: "b1", branchName: "Semarang", branchCode: "SMG", activeOrders: 5, revenueThisMonth: 350000000 },
    { branchId: "b2", branchName: "Jakarta", branchCode: "JKT", activeOrders: 4, revenueThisMonth: 320000000 },
    { branchId: "b3", branchName: "Surabaya", branchCode: "SBY", activeOrders: 3, revenueThisMonth: 180000000 },
  ],
};

// GET /api/dashboard
export async function GET(request: NextRequest) {
  try {
    // Try database first
    const prismaModule = await import("@/lib/prisma");
    const prisma = prismaModule.default;

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
      prisma.approval.count({ where: { status: "PENDING", ...(branchId ? { jobOrder: { branchId } } : {}) } }),
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

    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [documentsApproachingDeadline, completedNotInvoiced, invoicesPastDue, etdEtaToday] = await Promise.all([
      prisma.document.findMany({ where: { status: "PENDING", deadline: { gte: now, lte: threeDaysFromNow }, ...(branchId ? { jobOrder: { branchId } } : {}) }, select: { id: true, name: true, type: true, deadline: true, jobOrder: { select: { id: true, number: true } } }, orderBy: { deadline: "asc" }, take: 10 }),
      prisma.jobOrder.findMany({ where: { ...branchFilter, status: "COMPLETED", updatedAt: { lte: threeDaysAgo } }, select: { id: true, number: true, customer: { select: { name: true } }, updatedAt: true }, take: 10 }),
      prisma.jobOrder.findMany({ where: { ...branchFilter, status: "INVOICED", updatedAt: { lte: thirtyDaysAgo } }, select: { id: true, number: true, customer: { select: { name: true } }, totalRevenue: true, updatedAt: true }, take: 10 }),
      prisma.jobOrder.findMany({ where: { ...branchFilter, status: { in: ["CONFIRMED", "IN_PROGRESS"] }, OR: [{ etd: { gte: todayStart, lte: todayEnd } }, { eta: { gte: todayStart, lte: todayEnd } }] }, select: { id: true, number: true, etd: true, eta: true, vesselName: true, flightNo: true, pol: true, pod: true, customer: { select: { name: true } } }, take: 10 }),
    ]);

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
        alerts: { documentsApproachingDeadline, completedNotInvoiced, invoicesPastDue, etdEtaToday },
        branchSummary,
      },
    });
  } catch (error) {
    // Fallback to mock data if database is not available
    console.warn("Dashboard: Using mock data (DB unavailable):", (error as Error).message);
    return NextResponse.json({ data: MOCK_DASHBOARD });
  }
}
