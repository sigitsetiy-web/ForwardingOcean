import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export const dynamic = 'force-dynamic';

// GET /api/chat/messages?roomId=xxx - Get messages for a room
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const before = searchParams.get("before") || "";

    if (!roomId) {
      return NextResponse.json({ error: "roomId required" }, { status: 400 });
    }

    const where: Record<string, unknown> = { roomId };
    if (before) {
      where.createdAt = { lt: new Date(before) };
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    return NextResponse.json({ data: messages });
  } catch (error) {
    return NextResponse.json({ data: [] });
  }
}

// POST /api/chat/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, senderId, senderName, content, type, metadata, replyToId } = body;

    if (!roomId || !senderId || !content) {
      return NextResponse.json({ error: "roomId, senderId, content required" }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        senderName: senderName || "Unknown",
        content,
        type: type || "text",
        metadata: metadata || undefined,
        replyToId: replyToId || undefined,
      },
    });

    // Update room's updatedAt
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    });

    // If JO-linked thread, also save to JO Activity Log
    const room = await prisma.chatRoom.findUnique({ where: { id: roomId }, select: { jobOrderId: true, type: true } });
    if (room?.jobOrderId && room.type === "jo-thread") {
      try {
        await prisma.activityLog.create({
          data: {
            jobOrderId: room.jobOrderId,
            action: "CHAT_MESSAGE",
            description: `💬 ${senderName}: ${content.substring(0, 100)}${content.length > 100 ? "..." : ""}`,
            userId: senderId,
            metadata: { messageId: message.id, roomId },
          },
        });
      } catch (e) {
        // Non-critical, don't fail
      }
    }

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
