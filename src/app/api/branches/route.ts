import { NextRequest, NextResponse } from "next/server";
import { MOCK_BRANCHES } from "@/lib/mock-data";
import { z } from "zod";

const branchSchema = z.object({

export const dynamic = 'force-dynamic';

  code: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  pic: z.string().optional(),
});

export async function GET() {
  try {
    const prisma = (await import("@/lib/prisma")).default;
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: branches });
  } catch {
    console.error("Branches DB Error:", error);
    return NextResponse.json({ data: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = (await import("@/lib/prisma")).default;
    const body = await request.json();
    const validated = branchSchema.parse(body);
    const branch = await prisma.branch.create({ data: validated });
    return NextResponse.json({ data: branch }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 });
  }
}
