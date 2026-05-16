import { NotifType } from "@prisma/client";
import prisma from "./prisma";

interface CreateNotificationParams {
  userId: string;
  type: NotifType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
}

/**
 * Create an in-app notification
 */
export async function createNotification(
  params: CreateNotificationParams
): Promise<void> {
  await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      entityType: params.entityType,
      entityId: params.entityId,
    },
  });
}

/**
 * Create notifications for multiple users
 */
export async function createBulkNotifications(
  userIds: string[],
  params: Omit<CreateNotificationParams, "userId">
): Promise<void> {
  await prisma.notification.createMany({
    data: userIds.map((userId) => ({
      userId,
      type: params.type,
      title: params.title,
      message: params.message,
      entityType: params.entityType,
      entityId: params.entityId,
    })),
  });
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

/**
 * Mark notifications as read
 */
export async function markAsRead(notificationIds: string[]): Promise<void> {
  await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
    },
    data: {
      isRead: true,
    },
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}

/**
 * Notify approvers about pending approval
 */
export async function notifyApprovers(
  branchId: string,
  entityType: string,
  entityId: string,
  entityNumber: string
): Promise<void> {
  // Find Branch Manager and Owner for this branch
  const approvers = await prisma.user.findMany({
    where: {
      isActive: true,
      OR: [
        { role: "OWNER" },
        { role: "BRANCH_MANAGER", branchId },
      ],
    },
    select: { id: true },
  });

  await createBulkNotifications(
    approvers.map((a) => a.id),
    {
      type: "APPROVAL_REQUEST",
      title: "Approval Diperlukan",
      message: `${entityType} ${entityNumber} membutuhkan persetujuan Anda.`,
      entityType,
      entityId,
    }
  );
}

/**
 * Notify about document deadline reminder
 */
export async function notifyDocumentDeadline(
  userId: string,
  jobOrderNumber: string,
  documentName: string,
  daysLeft: number
): Promise<void> {
  await createNotification({
    userId,
    type: "DOCUMENT_REMINDER",
    title: "Reminder Dokumen",
    message: `Dokumen "${documentName}" untuk JO ${jobOrderNumber} harus diupload dalam ${daysLeft} hari.`,
  });
}

/**
 * Notify about overdue invoice
 */
export async function notifyInvoiceOverdue(
  userId: string,
  jobOrderNumber: string,
  daysPastDue: number
): Promise<void> {
  await createNotification({
    userId,
    type: "INVOICE_OVERDUE",
    title: "Invoice Overdue",
    message: `Invoice untuk JO ${jobOrderNumber} sudah lewat ${daysPastDue} hari dari jatuh tempo.`,
  });
}
