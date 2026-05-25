import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const customsSchema = z.object({
  direction: z.string().optional(),
  importirName: z.string().optional(),
  importirNpwp: z.string().optional(),
  apiNumber: z.string().optional(),
  pibNumber: z.string().optional(),
  pibDate: z.string().optional(),
  noPendaftaran: z.string().optional(),
  tglPendaftaran: z.string().optional(),
  sppbNumber: z.string().optional(),
  sppbDate: z.string().optional(),
  eksportirName: z.string().optional(),
  eksportirNpwp: z.string().optional(),
  pebNumber: z.string().optional(),
  pebDate: z.string().optional(),
  npeNumber: z.string().optional(),
  npeDate: z.string().optional(),
  kantorPabean: z.string().optional(),
  jalurPabean: z.enum(["HIJAU", "KUNING", "MERAH", "MITA"]).optional(),
  nilaiCIF: z.union([z.number(), z.string()]).optional(),
  nilaiFOB: z.union([z.number(), z.string()]).optional(),
  freightValue: z.union([z.number(), z.string()]).optional(),
  insuranceValue: z.union([z.number(), z.string()]).optional(),
  beaMasuk: z.union([z.number(), z.string()]).optional(),
  ppnImpor: z.union([z.number(), z.string()]).optional(),
  pphImpor: z.union([z.number(), z.string()]).optional(),
  cukai: z.union([z.number(), z.string()]).optional(),
  pnbp: z.union([z.number(), z.string()]).optional(),
  beaKeluar: z.union([z.number(), z.string()]).optional(),
  statusClearance: z.string().optional(),
  tglPemeriksaan: z.string().optional(),
  petugasPemeriksa: z.string().optional(),
  hasilPemeriksaan: z.string().optional(),
  baNumber: z.string().optional(),
  catatanPemeriksaan: z.string().optional(),
  biayaPemeriksaan: z.union([z.number(), z.string()]).optional(),
  userId: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { jobOrderId: string } }
) {
  try {
    const item = await prisma.customsClearance.findUnique({
      where: { jobOrderId: params.jobOrderId },
    });

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error("Error fetching customs clearance:", error);
    return NextResponse.json(
      { error: "Failed to fetch customs clearance" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { jobOrderId: string } }
) {
  try {
    const body = await request.json();
    const validated = customsSchema.parse(body);
    const userId = validated.userId || "system";

    const jobOrder = await prisma.jobOrder.findUnique({
      where: { id: params.jobOrderId },
      select: { id: true, number: true },
    });

    if (!jobOrder) {
      return NextResponse.json(
        { error: "Job Order tidak ditemukan" },
        { status: 404 }
      );
    }

    const data = toDbData(validated);

    const customs = await prisma.customsClearance.upsert({
      where: { jobOrderId: params.jobOrderId },
      create: {
        jobOrderId: params.jobOrderId,
        ...data,
      },
      update: data,
    });

    await updateCustomsMilestones(params.jobOrderId, customs, userId);

    await prisma.activityLog.create({
      data: {
        jobOrderId: params.jobOrderId,
        action: "CUSTOMS_UPDATED",
        description: `Data custom clearance diperbarui untuk JO ${jobOrder.number}`,
        userId,
      },
    });

    return NextResponse.json({ data: customs });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error saving customs clearance:", error);
    return NextResponse.json(
      { error: "Failed to save customs clearance" },
      { status: 500 }
    );
  }
}

function toDbData(validated: z.infer<typeof customsSchema>) {
  return {
    direction: emptyString(validated.direction),
    importirName: emptyString(validated.importirName),
    importirNpwp: emptyString(validated.importirNpwp),
    apiNumber: emptyString(validated.apiNumber),
    pibNumber: emptyString(validated.pibNumber),
    pibDate: toDate(validated.pibDate),
    noPendaftaran: emptyString(validated.noPendaftaran),
    tglPendaftaran: toDate(validated.tglPendaftaran),
    sppbNumber: emptyString(validated.sppbNumber),
    sppbDate: toDate(validated.sppbDate),
    eksportirName: emptyString(validated.eksportirName),
    eksportirNpwp: emptyString(validated.eksportirNpwp),
    pebNumber: emptyString(validated.pebNumber),
    pebDate: toDate(validated.pebDate),
    npeNumber: emptyString(validated.npeNumber),
    npeDate: toDate(validated.npeDate),
    kantorPabean: emptyString(validated.kantorPabean),
    jalurPabean: validated.jalurPabean || undefined,
    nilaiCIF: toNumber(validated.nilaiCIF),
    nilaiFOB: toNumber(validated.nilaiFOB),
    freightValue: toNumber(validated.freightValue),
    insuranceValue: toNumber(validated.insuranceValue),
    beaMasuk: toNumber(validated.beaMasuk),
    ppnImpor: toNumber(validated.ppnImpor),
    pphImpor: toNumber(validated.pphImpor),
    cukai: toNumber(validated.cukai),
    pnbp: toNumber(validated.pnbp),
    beaKeluar: toNumber(validated.beaKeluar),
    statusClearance: emptyString(validated.statusClearance),
    tglPemeriksaan: toDate(validated.tglPemeriksaan),
    petugasPemeriksa: emptyString(validated.petugasPemeriksa),
    hasilPemeriksaan: emptyString(validated.hasilPemeriksaan),
    baNumber: emptyString(validated.baNumber),
    catatanPemeriksaan: emptyString(validated.catatanPemeriksaan),
    biayaPemeriksaan: toNumber(validated.biayaPemeriksaan),
  };
}

function emptyString(value: string | undefined) {
  return value && value.trim() !== "" ? value.trim() : undefined;
}

function toDate(value: string | undefined) {
  return value && value.trim() !== "" ? new Date(value) : undefined;
}

function toNumber(value: string | number | undefined) {
  if (value === undefined || value === "") return undefined;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isNaN(num) ? undefined : num;
}

async function updateCustomsMilestones(
  jobOrderId: string,
  customs: {
    pibNumber: string | null;
    pebNumber: string | null;
    noPendaftaran: string | null;
    sppbNumber: string | null;
    npeNumber: string | null;
  },
  userId: string
) {
  const hasStarted = Boolean(
    customs.pibNumber || customs.pebNumber || customs.noPendaftaran
  );
  const hasCompleted = Boolean(customs.sppbNumber || customs.npeNumber);

  if (hasStarted) {
    await prisma.milestone.updateMany({
      where: {
        jobOrderId,
        type: "CUSTOMS_STARTED",
      },
      data: {
        status: hasCompleted ? "DONE" : "IN_PROGRESS",
        actualDate: new Date(),
        doneById: userId,
      },
    });
  }

  if (hasCompleted) {
    await prisma.milestone.updateMany({
      where: {
        jobOrderId,
        type: "CUSTOMS_DONE",
      },
      data: {
        status: "DONE",
        actualDate: new Date(),
        doneById: userId,
      },
    });
  }
}
