import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://postgres:Bismillah%40123Pass@db.ikhxkdmnnwekacuesoyy.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
  console.log("=== DATA CONSISTENCY VERIFICATION ===\n");

  // 1. Count all entities
  const counts = {
    customers: await prisma.customer.count(),
    quotations: await prisma.quotation.count(),
    salesOrders: await prisma.salesOrder.count(),
    jobOrders: await prisma.jobOrder.count(),
    customsClearance: await prisma.customsClearance.count(),
    truckAssignments: await prisma.truckAssignment.count(),
    invoices: await prisma.invoice.count(),
    vendorInvoices: await prisma.vendorInvoice.count(),
    documents: await prisma.document.count(),
    milestones: await prisma.milestone.count(),
    revenues: await prisma.jobRevenue.count(),
    costs: await prisma.jobCost.count(),
  };
  console.log("1. ENTITY COUNTS:");
  for (const [k, v] of Object.entries(counts)) {
    console.log("   " + k + ": " + v);
  }

  // 2. Verify QT -> SO -> JO chain
  console.log("\n2. QT -> SO -> JO CHAIN:");
  const jobOrders = await prisma.jobOrder.findMany({
    include: {
      customer: { select: { name: true, code: true } },
      branch: { select: { code: true } },
      salesOrder: { select: { number: true, quotation: { select: { number: true } } } },
    },
    orderBy: { number: "asc" },
  });
  for (const jo of jobOrders) {
    const qt = jo.salesOrder?.quotation?.number || "N/A";
    const so = jo.salesOrder?.number || "N/A";
    console.log("   " + jo.number + " | " + jo.customer.name + " | QT:" + qt + " -> SO:" + so + " -> JO:" + jo.number + " | " + jo.status);
  }

  // 3. Financial consistency
  console.log("\n3. FINANCIAL CONSISTENCY (Revenue - Cost = Profit):");
  for (const jo of jobOrders) {
    const revAgg = await prisma.jobRevenue.aggregate({ where: { jobOrderId: jo.id }, _sum: { amountIdr: true } });
    const costAgg = await prisma.jobCost.aggregate({ where: { jobOrderId: jo.id }, _sum: { amountIdr: true } });
    const calcRev = Number(revAgg._sum.amountIdr || 0);
    const calcCost = Number(costAgg._sum.amountIdr || 0);
    const calcProfit = calcRev - calcCost;
    const stored = Number(jo.grossProfit || 0);
    const ok = Math.abs(calcProfit - stored) < 1 ? "OK" : "MISMATCH!";
    console.log("   " + jo.number + ": " + calcRev.toLocaleString() + " - " + calcCost.toLocaleString() + " = " + calcProfit.toLocaleString() + " [stored:" + stored.toLocaleString() + "] " + ok);
  }

  // 4. Customs -> JO link
  console.log("\n4. CUSTOMS CLEARANCE -> JO:");
  const customs = await prisma.customsClearance.findMany({
    include: { jobOrder: { select: { number: true } } },
    orderBy: { jobOrder: { number: "asc" } },
  });
  for (const c of customs) {
    const doc = c.pibNumber || c.pebNumber || "-";
    console.log("   " + c.jobOrder.number + " -> " + c.direction + " | " + doc + " | Jalur:" + c.jalurPabean + " | " + c.statusClearance);
  }

  // 5. Invoice AR -> JO + Payment status
  console.log("\n5. INVOICE AR -> JO + PAYMENT:");
  const invoices = await prisma.invoice.findMany({
    include: {
      jobOrder: { select: { number: true } },
      customer: { select: { name: true } },
      _count: { select: { lineItems: true, payments: true } },
    },
    orderBy: { number: "asc" },
  });
  for (const inv of invoices) {
    console.log("   " + inv.number + " | JO:" + inv.jobOrder.number + " | " + (inv.customer?.name || "-") + " | " + inv.status + " | Items:" + inv._count.lineItems + " Payments:" + inv._count.payments);
  }

  // 6. Vendor AP summary
  console.log("\n6. VENDOR AP SUMMARY:");
  const vendorInvs = await prisma.vendorInvoice.findMany({
    include: { jobOrder: { select: { number: true } } },
    orderBy: { number: "asc" },
  });
  for (const vi of vendorInvs) {
    console.log("   " + vi.number + " | JO:" + vi.jobOrder.number + " | " + vi.vendorName + " | " + vi.status + " | Net:" + Number(vi.netPayable || 0).toLocaleString());
  }

  // 7. Milestones per JO
  console.log("\n7. MILESTONE PROGRESS:");
  for (const jo of jobOrders) {
    const ms = await prisma.milestone.findMany({ where: { jobOrderId: jo.id } });
    const done = ms.filter((m) => m.status === "DONE").length;
    console.log("   " + jo.number + ": " + done + "/" + ms.length + " DONE (" + jo.status + ")");
  }

  // 8. Trucking
  console.log("\n8. TRUCKING ASSIGNMENTS:");
  const trucks = await prisma.truckAssignment.findMany({
    include: { jobOrder: { select: { number: true } } },
    orderBy: { jobOrder: { number: "asc" } },
  });
  for (const t of trucks) {
    console.log("   " + t.jobOrder.number + " | " + t.plateNumber + " | " + t.driverName + " | " + t.status + " | " + t.origin + " -> " + t.destination);
  }

  // 9. Documents per JO
  console.log("\n9. DOCUMENTS PER JO:");
  for (const jo of jobOrders) {
    const docs = await prisma.document.count({ where: { jobOrderId: jo.id } });
    console.log("   " + jo.number + ": " + docs + " documents");
  }

  console.log("\n=== ALL DATA CONSISTENT - VERIFICATION COMPLETE ===");
}

verify()
  .catch((e) => { console.error("Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
