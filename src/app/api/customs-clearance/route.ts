import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MOCK_CUSTOMS_CLEARANCE = [
  {
    id: "mock-cc-1",
    direction: "import",
    pibNumber: "PIB-2026-001",
    pebNumber: null,
    sppbNumber: "SPPB-2026-001",
    kantorPabean: "Tanjung Emas",
    jalurPabean: "HIJAU",
    statusClearance: "SPPB TERBIT",
    updatedAt: new Date().toISOString(),
    jobOrder: {
      id: "mock-jo-1",
      number: "SMG-IMP-202605-0001",
      serviceType: "SEA_IMPORT",
      customer: { id: "mock-cust-1", name: "PT Contoh Import Indonesia" },
      branch: { id: "mock-branch-1", name: "Semarang", code: "SMG" },
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search") || "";
    const direction = searchParams.get("direction") || "";
    const jalurPabean = searchParams.get("jalurPabean") || "";
    const statusClearance = searchParams.get("statusClearance") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { pibNumber: { contains: search, mode: "insensitive" } },
        { pebNumber: { contains: search, mode: "insensitive" } },
        { sppbNumber: { contains: search, mode: "insensitive" } },
        {
          jobOrder: {
            number: { contains: search, mode: "insensitive" },
          },
        },
        {
          jobOrder: {
            customer: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    if (direction) where.direction = direction;
    if (jalurPabean) where.jalurPabean = jalurPabean;
    if (statusClearance) {
      where.statusClearance = { contains: statusClearance, mode: "insensitive" };
    }

    const [items, total] = await Promise.all([
      prisma.customsClearance.findMany({
        where,
        include: {
          jobOrder: {
            select: {
              id: true,
              number: true,
              serviceType: true,
              customer: { select: { id: true, name: true } },
              branch: { select: { id: true, name: true, code: true } },
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.customsClearance.count({ where }),
    ]);

    return NextResponse.json({
      data: items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.warn("Customs Clearance: Using mock data", error);
    return NextResponse.json({
      data: MOCK_CUSTOMS_CLEARANCE,
      total: MOCK_CUSTOMS_CLEARANCE.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    });
  }
}
