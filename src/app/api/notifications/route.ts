import { NextRequest, NextResponse } from "next/server";


export const dynamic = 'force-dynamic';

// GET /api/notifications - Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    const prisma = (await import("@/lib/prisma")).default;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "";
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = { userId };
    if (unreadOnly) where.isRead = false;

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return NextResponse.json({
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    return NextResponse.json({ data: [], unreadCount: 0 });
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const prisma = (await import("@/lib/prisma")).default;
    const body = await request.json();
    const { notificationIds, userId, markAll } = body;

    if (markAll && userId) {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    } else if (notificationIds?.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: notificationIds } },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ message: "Notifications updated" });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
