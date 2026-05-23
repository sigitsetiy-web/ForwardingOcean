export const COMPANY = {
  name: "PT Key Ocean Forwarding",
  tagline: "KayOcean — Forwarding Management System",
  address: "Indonesia",
};

export type PrintableDocType = "quotation" | "job-order";

const QUOTATION_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  REVIEW: "Dalam Review",
  APPROVED: "Disetujui",
  SENT: "Terkirim",
  ACCEPTED: "Diterima",
  REJECTED: "Ditolak",
  EXPIRED: "Kadaluarsa",
};

const JOB_ORDER_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Dikonfirmasi",
  IN_PROGRESS: "Dalam Proses",
  COMPLETED: "Selesai",
  INVOICED: "Diinvoice",
  CLOSED: "Ditutup",
};

const SERVICE_LABELS: Record<string, string> = {
  SEA_IMPORT: "Sea Freight Import",
  SEA_EXPORT: "Sea Freight Export",
  AIR_IMPORT: "Air Freight Import",
  AIR_EXPORT: "Air Freight Export",
  DOMESTIC: "Pengiriman Domestik",
};

export function formatCurrency(
  amount: number,
  currency: string = "IDR"
): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  value: string | Date | null | undefined,
  withTime = false
): string {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function serviceLabel(serviceType: string): string {
  return SERVICE_LABELS[serviceType] || serviceType.replace(/_/g, " ");
}

export function statusLabel(type: PrintableDocType, status: string): string {
  if (type === "quotation") return QUOTATION_LABELS[status] || status;
  return JOB_ORDER_LABELS[status] || status.replace(/_/g, " ");
}

/** Dokumen tersimpan dapat dicetak; DRAFT ditandai watermark di layout cetak. */
export function canPrintDocument(_type: PrintableDocType, _status: string): boolean {
  return true;
}

export function isDraftStatus(status: string): boolean {
  return status === "DRAFT" || status === "REVIEW";
}

export function printUrl(type: PrintableDocType, id: string, auto = false): string {
  const base = type === "quotation" ? `/print/quotations/${id}` : `/print/job-orders/${id}`;
  return auto ? `${base}?auto=1` : base;
}
