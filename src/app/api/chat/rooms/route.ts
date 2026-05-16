import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export const dynamic = 'force-dynamic';

// GET /api/chat/rooms - Get all rooms for current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "";

    const rooms = await prisma.chatRoom.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ data: rooms });
  } catch (error) {
    // Return default rooms if DB fails
    return NextResponse.json({ data: [] });
  }
}

// POST /api/chat/rooms - Create a new room (or return existing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, description, jobOrderId, members, createdById } = body;

    // Check if room already exists with same name
    const existing = await prisma.chatRoom.findFirst({
      where: { name, type },
      include: { members: true },
    });

    if (existing) {
      // Add member if not already in room
      if (createdById) {
        const isMember = existing.members.some((m) => m.userId === createdById);
        if (!isMember) {
          await prisma.chatMember.create({
            data: {
              roomId: existing.id,
              userId: createdById,
              userName: members?.[0]?.userName || "User",
            },
          });
        }
      }
      return NextResponse.json({ data: existing });
    }

    const room = await prisma.chatRoom.create({
      data: {
        type: type || "channel",
        name,
        description,
        jobOrderId,
        createdById,
        members: {
          create: (members || []).map((m: { userId: string; userName: string }) => ({
            userId: m.userId,
            userName: m.userName,
            role: m.userId === createdById ? "owner" : "member",
          })),
        },
      },
      include: { members: true },
    });

    return NextResponse.json({ data: room }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
