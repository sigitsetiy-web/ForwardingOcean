import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorize, AuthUser } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authResult = await authorize(request, "read", "job_order");
  if (authResult instanceof NextResponse) return authResult;

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
    console.error("Customs Clearance error:", error);
    return NextResponse.json({
      data: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    });
  }
}
