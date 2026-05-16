import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create transporter (configure via env variables)
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
}

const FROM_EMAIL = process.env.SMTP_FROM || "noreply@fms.co.id";
const FROM_NAME = process.env.SMTP_FROM_NAME || "FMS - Forwarding Management System";

/**
 * Send an email notification
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("Email not configured: SMTP_USER or SMTP_PASS missing");
      return false;
    }

    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Send approval request email
 */
export async function sendApprovalEmail(
  to: string,
  entityType: string,
  entityNumber: string,
  requesterName: string
): Promise<boolean> {
  return sendEmail({
    to,
    subject: `[FMS] Approval Diperlukan: ${entityType} ${entityNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E3A5F; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Forwarding Management System</h1>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1E3A5F; margin-top: 0;">Approval Diperlukan</h2>
          <p>${entityType} <strong>${entityNumber}</strong> membutuhkan persetujuan Anda.</p>
          <p>Diajukan oleh: <strong>${requesterName}</strong></p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/approvals" 
               style="background: #1E3A5F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Lihat & Proses Approval
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">
            Email ini dikirim otomatis oleh sistem FMS. Jangan membalas email ini.
          </p>
        </div>
      </div>
    `,
  });
}

/**
 * Send document deadline reminder email
 */
export async function sendDocumentReminderEmail(
  to: string,
  jobOrderNumber: string,
  documentName: string,
  daysLeft: number
): Promise<boolean> {
  return sendEmail({
    to,
    subject: `[FMS] Reminder: Dokumen "${documentName}" - ${jobOrderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E3A5F; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Forwarding Management System</h1>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #F59E0B; margin-top: 0;">⚠️ Reminder Dokumen</h2>
          <p>Dokumen <strong>"${documentName}"</strong> untuk Job Order <strong>${jobOrderNumber}</strong> 
             harus diupload dalam <strong>${daysLeft} hari</strong>.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/job-orders" 
               style="background: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Buka Job Order
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">
            Email ini dikirim otomatis oleh sistem FMS.
          </p>
        </div>
      </div>
    `,
  });
}

/**
 * Send invoice overdue notification email
 */
export async function sendInvoiceOverdueEmail(
  to: string,
  jobOrderNumber: string,
  daysPastDue: number,
  amount: number
): Promise<boolean> {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

  return sendEmail({
    to,
    subject: `[FMS] Invoice Overdue: ${jobOrderNumber} (${daysPastDue} hari)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E3A5F; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Forwarding Management System</h1>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #EF4444; margin-top: 0;">🚨 Invoice Overdue</h2>
          <p>Invoice untuk Job Order <strong>${jobOrderNumber}</strong> sudah melewati 
             <strong>${daysPastDue} hari</strong> dari jatuh tempo.</p>
          <p>Jumlah: <strong>${formattedAmount}</strong></p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/job-orders" 
               style="background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Lihat Detail
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">
            Email ini dikirim otomatis oleh sistem FMS.
          </p>
        </div>
      </div>
    `,
  });
}

/**
 * Send status update notification email
 */
export async function sendStatusUpdateEmail(
  to: string,
  jobOrderNumber: string,
  oldStatus: string,
  newStatus: string
): Promise<boolean> {
  return sendEmail({
    to,
    subject: `[FMS] Status Update: ${jobOrderNumber} → ${newStatus}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E3A5F; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Forwarding Management System</h1>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1E3A5F; margin-top: 0;">Status Update</h2>
          <p>Job Order <strong>${jobOrderNumber}</strong> telah berubah status:</p>
          <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="color: #666;">${oldStatus}</span>
            <span style="margin: 0 10px;">→</span>
            <span style="color: #10B981; font-weight: bold;">${newStatus}</span>
          </div>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/job-orders" 
               style="background: #1E3A5F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Lihat Detail
            </a>
          </div>
        </div>
      </div>
    `,
  });
}
