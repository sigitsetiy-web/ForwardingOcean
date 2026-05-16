export interface ProfitSummary {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossMargin: number; // percentage
  status: "PROFITABLE" | "BREAK_EVEN" | "LOSS";
}

export interface RevenueItem {
  item: string;
  currency: string;
  amount: number;
  rate?: number;
  amountIdr: number;
}

export interface CostItem {
  vendor?: string;
  item: string;
  currency: string;
  amount: number;
  rate?: number;
  amountIdr: number;
}

/**
 * Calculate profit summary for a Job Order
 */
export function calculateProfit(
  revenues: RevenueItem[],
  costs: CostItem[]
): ProfitSummary {
  const totalRevenue = revenues.reduce((sum, r) => sum + r.amountIdr, 0);
  const totalCost = costs.reduce((sum, c) => sum + c.amountIdr, 0);
  const grossProfit = totalRevenue - totalCost;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  let status: ProfitSummary["status"];
  if (grossProfit > 0) {
    status = "PROFITABLE";
  } else if (grossProfit === 0) {
    status = "BREAK_EVEN";
  } else {
    status = "LOSS";
  }

  return {
    totalRevenue,
    totalCost,
    grossProfit,
    grossMargin: Math.round(grossMargin * 100) / 100,
    status,
  };
}

/**
 * Convert foreign currency amount to IDR
 */
export function convertToIdr(
  amount: number,
  currency: string,
  rate: number
): number {
  if (currency === "IDR") return amount;
  return amount * rate;
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: string = "IDR"
): string {
  if (currency === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert Prisma Decimal to number
 */
export function decimalToNumber(value: unknown): number {
  if (!value) return 0;
  return Number(value);
}
