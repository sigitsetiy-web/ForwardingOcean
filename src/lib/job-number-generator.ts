import { ServiceType } from "@prisma/client";
import prisma from "./prisma";

/**
 * Generate Job Order number with format: [BRANCH_CODE]-[SERVICE_CODE]-[YYYYMM]-[SEQUENCE]
 * Example: SMG-IMP-202501-0001
 */

const SERVICE_CODE_MAP: Record<ServiceType, string> = {
  SEA_IMPORT: "IMP",
  SEA_EXPORT: "EXP",
  AIR_IMPORT: "AIM",
  AIR_EXPORT: "AEX",
  DOMESTIC: "DOM",
};

export async function generateJobOrderNumber(
  branchCode: string,
  serviceType: ServiceType
): Promise<string> {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const serviceCode = SERVICE_CODE_MAP[serviceType];
  const prefix = `${branchCode}-${serviceCode}-${yearMonth}`;

  // Find the latest JO number with this prefix
  const latestJO = await prisma.jobOrder.findFirst({
    where: {
      number: {
        startsWith: prefix,
      },
    },
    orderBy: {
      number: "desc",
    },
    select: {
      number: true,
    },
  });

  let sequence = 1;
  if (latestJO) {
    const parts = latestJO.number.split("-");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      sequence = lastSeq + 1;
    }
  }

  return `${prefix}-${String(sequence).padStart(4, "0")}`;
}

/**
 * Generate Quotation number with format: QT-[BRANCH_CODE]-[YYYYMM]-[SEQUENCE]
 * Example: QT-SMG-202501-0001
 */
export async function generateQuotationNumber(
  branchCode: string
): Promise<string> {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prefix = `QT-${branchCode}-${yearMonth}`;

  const latestQuotation = await prisma.quotation.findFirst({
    where: {
      number: {
        startsWith: prefix,
      },
    },
    orderBy: {
      number: "desc",
    },
    select: {
      number: true,
    },
  });

  let sequence = 1;
  if (latestQuotation) {
    const parts = latestQuotation.number.split("-");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      sequence = lastSeq + 1;
    }
  }

  return `${prefix}-${String(sequence).padStart(4, "0")}`;
}
