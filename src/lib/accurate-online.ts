import crypto from "crypto";
import prisma from "./prisma";

interface AccurateConfig {
  signatureSecret: string;
  apiToken: string;
}

interface AccurateResponse {
  s: boolean;
  d: Record<string, unknown> | string[];
}

/**
 * Accurate Online API Service
 * Handles all integration with Accurate Online accounting system
 */
class AccurateOnlineService {
  private signatureSecret: string;
  private apiToken: string;
  private host: string | null = null;
  private initialized = false;

  constructor(config?: AccurateConfig) {
    this.signatureSecret =
      config?.signatureSecret || process.env.ACCURATE_SIGNATURE_SECRET || "";
    this.apiToken =
      config?.apiToken || process.env.ACCURATE_API_TOKEN || "";
  }

  private getTimestamp(): string {
    const now = new Date();
    const p = (n: number) => n.toString().padStart(2, "0");
    return `${p(now.getDate())}/${p(now.getMonth() + 1)}/${now.getFullYear()} ${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
  }

  private getSignature(timestamp: string): string {
    return crypto
      .createHmac("sha256", this.signatureSecret)
      .update(timestamp)
      .digest("base64");
  }

  private getHeaders(): Record<string, string> {
    const timestamp = this.getTimestamp();
    return {
      Authorization: `Bearer ${this.apiToken}`,
      "X-Api-Timestamp": timestamp,
      "X-Api-Signature": this.getSignature(timestamp),
      "Content-Type": "application/json",
    };
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    const response = await fetch(
      "https://account.accurate.id/api/api-token.do",
      {
        method: "POST",
        headers: this.getHeaders(),
      }
    );

    const data = (await response.json()) as AccurateResponse;
    if (data.s && typeof data.d === "object" && "database" in data.d) {
      const db = data.d.database as { host: string };
      this.host = db.host;
      this.initialized = true;
    } else {
      throw new Error("Failed to initialize Accurate Online connection");
    }
  }

  async request(
    method: "GET" | "POST",
    endpoint: string,
    data?: Record<string, unknown>,
    params?: Record<string, string>
  ): Promise<AccurateResponse> {
    await this.init();

    let url = `${this.host}/accurate/api${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (method === "POST" && data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    return (await response.json()) as AccurateResponse;
  }

  // ============================================================
  // CUSTOMER SYNC
  // ============================================================

  /**
   * Sync customer from FMS to Accurate Online
   */
  async syncCustomer(customerId: string): Promise<void> {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) throw new Error("Customer not found");

    const aoData = {
      name: customer.name,
      customerNo: customer.code,
      npwpNo: customer.npwp || "",
      mobilePhone: customer.phone || "",
      email: customer.email || "",
      billStreet: customer.address || "",
    };

    try {
      let result: AccurateResponse;

      if (customer.aoCustomerId) {
        // Update existing
        result = await this.request("POST", "/customer/save.do", {
          ...aoData,
          id: parseInt(customer.aoCustomerId),
        });
      } else {
        // Create new
        result = await this.request("POST", "/customer/save.do", aoData);
      }

      if (result.s && typeof result.d === "object" && "id" in result.d) {
        await prisma.customer.update({
          where: { id: customerId },
          data: { aoCustomerId: String(result.d.id) },
        });

        await this.logSync("CUSTOMER", customerId, "SYNC", "SYNCED");
      } else {
        throw new Error(
          Array.isArray(result.d) ? result.d.join(", ") : "Sync failed"
        );
      }
    } catch (error) {
      await this.logSync(
        "CUSTOMER",
        customerId,
        "SYNC",
        "FAILED",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }

  // ============================================================
  // AR INVOICE (Sales Invoice)
  // ============================================================

  /**
   * Create AR Invoice in Accurate Online from Job Order revenues
   */
  async createARInvoice(jobOrderId: string): Promise<void> {
    const jobOrder = await prisma.jobOrder.findUnique({
      where: { id: jobOrderId },
      include: {
        customer: true,
        revenues: true,
      },
    });

    if (!jobOrder) throw new Error("Job Order not found");
    if (!jobOrder.customer.aoCustomerId) {
      throw new Error("Customer not synced to Accurate Online");
    }

    const detailItems = jobOrder.revenues.map((rev) => ({
      itemNo: rev.item,
      unitPrice: Number(rev.amountIdr),
      quantity: 1,
      accountId: rev.aoAccountId || undefined,
    }));

    const invoiceData = {
      customerId: parseInt(jobOrder.customer.aoCustomerId),
      transDate: new Date().toLocaleDateString("en-GB"), // dd/mm/yyyy
      number: jobOrder.number,
      detailItem: detailItems,
    };

    try {
      const result = await this.request(
        "POST",
        "/sales-invoice/save.do",
        invoiceData
      );

      if (result.s && typeof result.d === "object" && "id" in result.d) {
        await prisma.jobOrder.update({
          where: { id: jobOrderId },
          data: {
            aoInvoiceId: String(result.d.id),
            aoSyncStatus: "SYNCED",
          },
        });

        await this.logSync("AR_INVOICE", jobOrderId, "CREATE", "SYNCED");
      } else {
        throw new Error(
          Array.isArray(result.d) ? result.d.join(", ") : "Invoice creation failed"
        );
      }
    } catch (error) {
      await prisma.jobOrder.update({
        where: { id: jobOrderId },
        data: { aoSyncStatus: "FAILED" },
      });

      await this.logSync(
        "AR_INVOICE",
        jobOrderId,
        "CREATE",
        "FAILED",
        error instanceof Error ? error.message : "Unknown error"
      );

      // Retry logic
      await this.handleRetry("AR_INVOICE", jobOrderId);
      throw error;
    }
  }

  // ============================================================
  // AP INVOICE (Purchase Invoice)
  // ============================================================

  /**
   * Create AP Invoice in Accurate Online from Job Order costs
   */
  async createAPInvoice(
    jobOrderId: string,
    vendorName: string
  ): Promise<void> {
    const jobOrder = await prisma.jobOrder.findUnique({
      where: { id: jobOrderId },
      include: {
        costs: {
          where: { vendor: vendorName },
        },
      },
    });

    if (!jobOrder) throw new Error("Job Order not found");

    const detailItems = jobOrder.costs.map((cost) => ({
      itemNo: cost.item,
      unitPrice: Number(cost.amountIdr),
      quantity: 1,
      accountId: cost.aoAccountId || undefined,
    }));

    const invoiceData = {
      vendorNo: vendorName,
      transDate: new Date().toLocaleDateString("en-GB"),
      number: `AP-${jobOrder.number}`,
      detailItem: detailItems,
    };

    try {
      const result = await this.request(
        "POST",
        "/purchase-invoice/save.do",
        invoiceData
      );

      if (result.s) {
        await this.logSync("AP_INVOICE", jobOrderId, "CREATE", "SYNCED");
      } else {
        throw new Error(
          Array.isArray(result.d) ? result.d.join(", ") : "AP Invoice creation failed"
        );
      }
    } catch (error) {
      await this.logSync(
        "AP_INVOICE",
        jobOrderId,
        "CREATE",
        "FAILED",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }

  // ============================================================
  // PAYMENT STATUS SYNC
  // ============================================================

  /**
   * Check payment status from Accurate Online
   */
  async syncPaymentStatus(jobOrderId: string): Promise<boolean> {
    const jobOrder = await prisma.jobOrder.findUnique({
      where: { id: jobOrderId },
    });

    if (!jobOrder?.aoInvoiceId) return false;

    try {
      const result = await this.request("GET", "/sales-invoice/detail.do", undefined, {
        id: jobOrder.aoInvoiceId,
      });

      if (result.s && typeof result.d === "object" && "statusName" in result.d) {
        const isPaid = result.d.statusName === "Closed";

        if (isPaid && jobOrder.status === "INVOICED") {
          await prisma.jobOrder.update({
            where: { id: jobOrderId },
            data: { status: "CLOSED" },
          });

          await this.logSync("PAYMENT", jobOrderId, "SYNC", "SYNCED");
          return true;
        }
      }

      return false;
    } catch (error) {
      await this.logSync(
        "PAYMENT",
        jobOrderId,
        "SYNC",
        "FAILED",
        error instanceof Error ? error.message : "Unknown error"
      );
      return false;
    }
  }

  // ============================================================
  // EXCHANGE RATE
  // ============================================================

  /**
   * Get exchange rate from Accurate Online
   */
  async getExchangeRate(
    date: string,
    currency: string = "USD"
  ): Promise<number> {
    try {
      const result = await this.request("GET", "/currency/get-rate.do", undefined, {
        date,
        currency,
      });

      if (result.s && typeof result.d === "object" && "rate" in result.d) {
        return Number(result.d.rate);
      }

      // Fallback: return 0 if rate not found
      return 0;
    } catch {
      return 0;
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private async logSync(
    entityType: string,
    entityId: string,
    action: string,
    status: "PENDING" | "SYNCED" | "FAILED",
    errorMsg?: string
  ): Promise<void> {
    await prisma.syncLog.create({
      data: {
        entityType,
        entityId,
        action,
        status,
        errorMsg,
      },
    });
  }

  private async handleRetry(
    entityType: string,
    entityId: string
  ): Promise<void> {
    const recentLogs = await prisma.syncLog.findMany({
      where: {
        entityType,
        entityId,
        status: "FAILED",
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    if (recentLogs.length >= 3) {
      // Alert Owner/Finance after 3 consecutive failures
      await prisma.notification.create({
        data: {
          userId: "system", // Will be resolved to Owner/Finance users
          type: "SYSTEM",
          title: "Sync Gagal Berulang",
          message: `Sinkronisasi ${entityType} untuk ${entityId} gagal 3x berturut-turut. Mohon periksa koneksi Accurate Online.`,
          entityType,
          entityId,
        },
      });
    }
  }
}

// Singleton instance
let accurateService: AccurateOnlineService | null = null;

export function getAccurateService(): AccurateOnlineService {
  if (!accurateService) {
    accurateService = new AccurateOnlineService();
  }
  return accurateService;
}

export default AccurateOnlineService;
