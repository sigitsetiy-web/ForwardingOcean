import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";



const branchSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  pic: z.string().optional(),
});

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: branches });
  } catch (error) {
    console.error("Branches DB Error:", error);
    return NextResponse.json({ data: [], error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
