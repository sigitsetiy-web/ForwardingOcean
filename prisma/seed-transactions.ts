import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://postgres:Bismillah%40123Pass@db.ikhxkdmnnwekacuesoyy.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 5 Transactions: Full lifecycle Juni 2026
const TRANSACTIONS = [
  {
    customer: { code: "CUST-001", name: "PT Maju Bersama", segment: "IMPORTER" as const, city: "Semarang", npwp: "01.234.567.8-501.000", phone: "024-8881234", pic: "Pak Hendra" },
    qt: { serviceType: "SEA_IMPORT" as const, origin: "Shanghai, China", destination: "Semarang, Indonesia", currency: "IDR" },
    items: [
      { description: "Ocean Freight 20'", qty: 2, unitPrice: 8500000 },
      { description: "THC Destination", qty: 2, unitPrice: 2500000 },
      { description: "Customs Clearance Fee", qty: 1, unitPrice: 3500000 },
      { description: "Trucking Delivery", qty: 2, unitPrice: 4000000 },
    ],
    jo: { shipper: "Shanghai Trading Co Ltd", consignee: "PT Maju Bersama", pol: "CNSHA", pod: "IDSMG", commodity: "Textile Fabric", hsCode: "5208.21.00", containerType: "20GP", containerQty: 2, vesselName: "EVER GOLDEN", voyageNo: "EG2605N", etd: "2026-06-05", eta: "2026-06-18" },
    customs: { direction: "import", pibNumber: "PIB-001234/2026", kantorPabean: "KPU Tanjung Emas", jalurPabean: "HIJAU" as const, sppbNumber: "SPPB/001234/2026", nilaiCIF: 285000000, beaMasuk: 28500000, ppnImpor: 34200000, pphImpor: 7125000, statusClearance: "SPPB TERBIT" },
    trucking: { plateNumber: "H 1234 AB", driverName: "Pak Sugi", origin: "Pelabuhan Tanjung Emas", destination: "Gudang PT Maju Bersama, Demak" },
    vendorCosts: [
      { vendorName: "Evergreen Line", description: "Ocean Freight", amount: 14500000 },
      { vendorName: "PT Pelindo", description: "THC + Handling", amount: 4200000 },
      { vendorName: "PPJK Anugerah", description: "Customs Broker Fee", amount: 2800000 },
      { vendorName: "CV Lancar Jaya", description: "Trucking 2x20'", amount: 6500000 },
    ],
  },
  {
    customer: { code: "CUST-002", name: "PT Global Ekspor Indonesia", segment: "EXPORTER" as const, city: "Semarang", npwp: "02.345.678.9-501.000", phone: "024-8882345", pic: "Bu Diana" },
    qt: { serviceType: "SEA_EXPORT" as const, origin: "Semarang, Indonesia", destination: "Tokyo, Japan", currency: "IDR" },
    items: [
      { description: "Ocean Freight 40HC", qty: 1, unitPrice: 15000000 },
      { description: "THC Origin", qty: 1, unitPrice: 3000000 },
      { description: "Documentation Fee", qty: 1, unitPrice: 1500000 },
      { description: "Stuffing Service", qty: 1, unitPrice: 2000000 },
    ],
    jo: { shipper: "PT Global Ekspor Indonesia", consignee: "Nippon Import Co Ltd", pol: "IDSMG", pod: "JPTYO", commodity: "Furniture Kayu Jati", hsCode: "9403.60.00", containerType: "40HC", containerQty: 1, vesselName: "NYK VENUS", voyageNo: "NYK0612S", etd: "2026-06-10", eta: "2026-06-22" },
    customs: { direction: "export", pebNumber: "PEB-005678/2026", kantorPabean: "KPU Tanjung Emas", jalurPabean: "HIJAU" as const, npeNumber: "NPE/005678/2026", nilaiFOB: 450000000, beaKeluar: 0, statusClearance: "NPE TERBIT" },
    trucking: { plateNumber: "H 5678 CD", driverName: "Pak Wahyu", origin: "Pabrik PT Global, Jepara", destination: "Pelabuhan Tanjung Emas" },
    vendorCosts: [
      { vendorName: "NYK Line", description: "Ocean Freight 40HC", amount: 12000000 },
      { vendorName: "PT Pelindo", description: "THC Origin", amount: 2500000 },
      { vendorName: "CV Express Trucking", description: "Trucking Jepara-Port", amount: 5500000 },
    ],
  },
  {
    customer: { code: "CUST-003", name: "PT Surya Logistik", segment: "IMPORTER" as const, city: "Jakarta", npwp: "03.456.789.0-011.000", phone: "021-5551234", pic: "Pak Bambang" },
    qt: { serviceType: "AIR_IMPORT" as const, origin: "Singapore", destination: "Jakarta, Indonesia", currency: "IDR" },
    items: [
      { description: "Air Freight (500kg)", qty: 1, unitPrice: 25000000 },
      { description: "Customs Clearance", qty: 1, unitPrice: 4000000 },
      { description: "Delivery to Warehouse", qty: 1, unitPrice: 2500000 },
    ],
    jo: { shipper: "SG Electronics Pte Ltd", consignee: "PT Surya Logistik", pol: "SGSIN", pod: "IDJKT", commodity: "Electronic Components", hsCode: "8542.31.00", containerType: "Loose Cargo", containerQty: 0, vesselName: "", voyageNo: "", flightNo: "SQ-952", etd: "2026-06-12", eta: "2026-06-12" },
    customs: { direction: "import", pibNumber: "PIB-007890/2026", kantorPabean: "KPU Soekarno Hatta", jalurPabean: "KUNING" as const, sppbNumber: "SPPB/007890/2026", nilaiCIF: 180000000, beaMasuk: 9000000, ppnImpor: 20790000, pphImpor: 4500000, statusClearance: "SPPB TERBIT" },
    trucking: { plateNumber: "B 9012 EF", driverName: "Pak Agus", origin: "Bandara Soekarno Hatta", destination: "Gudang PT Surya, Cikarang" },
    vendorCosts: [
      { vendorName: "Singapore Airlines Cargo", description: "Air Freight 500kg", amount: 21000000 },
      { vendorName: "PT PPJK Mandiri", description: "Customs Clearance", amount: 3200000 },
      { vendorName: "CV Cepat Kirim", description: "Delivery Bandara-Cikarang", amount: 1800000 },
    ],
  },
  {
    customer: { code: "CUST-004", name: "PT Nusantara Seafood", segment: "EXPORTER" as const, city: "Surabaya", npwp: "04.567.890.1-601.000", phone: "031-5559876", pic: "Bu Ratna" },
    qt: { serviceType: "SEA_EXPORT" as const, origin: "Surabaya, Indonesia", destination: "Los Angeles, USA", currency: "USD" },
    items: [
      { description: "Reefer Container 40RF", qty: 2, unitPrice: 35000000 },
      { description: "Documentation & B/L", qty: 1, unitPrice: 2500000 },
      { description: "Port Handling", qty: 2, unitPrice: 3500000 },
    ],
    jo: { shipper: "PT Nusantara Seafood", consignee: "Pacific Foods Inc", pol: "IDSUB", pod: "USLAX", commodity: "Frozen Shrimp", hsCode: "0306.17.00", containerType: "40RF", containerQty: 2, vesselName: "MAERSK SEALAND", voyageNo: "MS2620W", etd: "2026-06-15", eta: "2026-07-05" },
    customs: { direction: "export", pebNumber: "PEB-009012/2026", kantorPabean: "KPU Tanjung Perak", jalurPabean: "HIJAU" as const, npeNumber: "NPE/009012/2026", nilaiFOB: 1200000000, beaKeluar: 0, statusClearance: "NPE TERBIT" },
    trucking: { plateNumber: "L 3456 GH", driverName: "Pak Joko", origin: "Cold Storage PT Nusantara, Gresik", destination: "Pelabuhan Tanjung Perak" },
    vendorCosts: [
      { vendorName: "Maersk Line", description: "Reefer Freight 2x40RF", amount: 58000000 },
      { vendorName: "PT Pelindo III", description: "Port Handling + THC", amount: 5800000 },
      { vendorName: "CV Reefer Trans", description: "Trucking Reefer", amount: 8000000 },
    ],
  },
  {
    customer: { code: "CUST-005", name: "PT Sentosa Motor", segment: "IMPORTER" as const, city: "Semarang", npwp: "05.678.901.2-501.000", phone: "024-8883456", pic: "Pak Wawan" },
    qt: { serviceType: "SEA_IMPORT" as const, origin: "Bangkok, Thailand", destination: "Semarang, Indonesia", currency: "IDR" },
    items: [
      { description: "Ocean Freight 40GP", qty: 1, unitPrice: 12000000 },
      { description: "THC Destination", qty: 1, unitPrice: 2800000 },
      { description: "Customs Clearance", qty: 1, unitPrice: 4500000 },
      { description: "Trucking Delivery", qty: 1, unitPrice: 3500000 },
      { description: "Insurance", qty: 1, unitPrice: 1500000 },
    ],
    jo: { shipper: "Thai Auto Parts Co Ltd", consignee: "PT Sentosa Motor", pol: "THBKK", pod: "IDSMG", commodity: "Auto Spare Parts", hsCode: "8708.99.00", containerType: "40GP", containerQty: 1, vesselName: "COSCO HARMONY", voyageNo: "CH2618E", etd: "2026-06-20", eta: "2026-06-28" },
    customs: { direction: "import", pibNumber: "PIB-011234/2026", kantorPabean: "KPU Tanjung Emas", jalurPabean: "MERAH" as const, sppbNumber: "", nilaiCIF: 520000000, beaMasuk: 52000000, ppnImpor: 62920000, pphImpor: 13000000, statusClearance: "PEMERIKSAAN FISIK" },
    trucking: { plateNumber: "H 7890 IJ", driverName: "Pak Darto", origin: "Pelabuhan Tanjung Emas", destination: "Gudang PT Sentosa, Ungaran" },
    vendorCosts: [
      { vendorName: "COSCO Shipping", description: "Ocean Freight 40GP", amount: 9800000 },
      { vendorName: "PT Pelindo", description: "THC + Handling", amount: 2300000 },
      { vendorName: "PPJK Anugerah", description: "Customs Clearance + Pemeriksaan", amount: 5500000 },
      { vendorName: "CV Lancar Jaya", description: "Trucking 40GP", amount: 2800000 },
    ],
  },
];

async function main() {
  console.log("🚀 Seeding 5 complete transactions for Juni 2026...\n");

  // Get existing branches and admin user
  const smg = await prisma.branch.findUnique({ where: { code: "SMG" } });
  const jkt = await prisma.branch.findUnique({ where: { code: "JKT" } });
  const sby = await prisma.branch.findUnique({ where: { code: "SBY" } });
  const admin = await prisma.user.findUnique({ where: { email: "admin@keyocean.co.id" } });
  const sales = await prisma.user.findFirst({ where: { role: "SALES" } });

  if (!smg || !jkt || !sby || !admin) {
    throw new Error("Branches or admin not found. Run base seed first.");
  }

  const branchMap: Record<string, string> = {
    Semarang: smg.id,
    Jakarta: jkt.id,
    Surabaya: sby.id,
  };
  const branchCodeMap: Record<string, string> = {
    Semarang: "SMG",
    Jakarta: "JKT",
    Surabaya: "SBY",
  };

  const serviceCodeMap: Record<string, string> = {
    SEA_IMPORT: "IMP",
    SEA_EXPORT: "EXP",
    AIR_IMPORT: "AIM",
    AIR_EXPORT: "AEX",
    DOMESTIC: "DOM",
  };

  for (let i = 0; i < TRANSACTIONS.length; i++) {
    const tx = TRANSACTIONS[i];
    const seq = String(i + 1).padStart(4, "0");
    const branchId = branchMap[tx.customer.city] || smg.id;
    const branchCode = branchCodeMap[tx.customer.city] || "SMG";
    const serviceCode = serviceCodeMap[tx.qt.serviceType];

    console.log(`--- Transaction ${i + 1}: ${tx.customer.name} ---`);

    // 1. Create Customer
    const customer = await prisma.customer.upsert({
      where: { code: tx.customer.code },
      update: { name: tx.customer.name },
      create: {
        code: tx.customer.code,
        name: tx.customer.name,
        segment: tx.customer.segment,
        city: tx.customer.city,
        npwp: tx.customer.npwp,
        phone: tx.customer.phone,
        pic: tx.customer.pic,
        leadStatus: "CUSTOMER",
      },
    });
    console.log(`  ✓ Customer: ${customer.code} - ${customer.name}`);

    // 2. Create Quotation
    const qtNumber = `QT-${branchCode}-202606-${seq}`;
    const totalAmount = tx.items.reduce((s, item) => s + item.qty * item.unitPrice, 0);

    const quotation = await prisma.quotation.create({
      data: {
        number: qtNumber,
        customerId: customer.id,
        serviceType: tx.qt.serviceType,
        origin: tx.qt.origin,
        destination: tx.qt.destination,
        currency: tx.qt.currency,
        totalAmount,
        validUntil: new Date("2026-07-15"),
        status: "ACCEPTED",
        branchId,
        createdById: sales?.id || admin.id,
        items: {
          create: tx.items.map((item) => ({
            description: item.description,
            unit: "unit",
            quantity: item.qty,
            unitPrice: item.unitPrice,
            currency: tx.qt.currency,
            amount: item.qty * item.unitPrice,
          })),
        },
      },
    });
    console.log(`  ✓ Quotation: ${qtNumber} (${tx.qt.currency} ${totalAmount.toLocaleString()})`);

    // 3. Create Sales Order
    const soNumber = `SO-${branchCode}-202606-${seq}`;
    const salesOrder = await prisma.salesOrder.create({
      data: {
        number: soNumber,
        quotationId: quotation.id,
        customerId: customer.id,
        serviceType: tx.qt.serviceType,
        branchId,
        status: "CONFIRMED",
        currency: tx.qt.currency,
        totalAmount,
        paymentTerms: "30 days",
        salesPerson: sales?.name || "Siti Rahayu",
        incoterms: tx.qt.serviceType.includes("IMPORT") ? "CIF" : "FOB",
        pol: tx.jo.pol,
        pod: tx.jo.pod,
        etd: new Date(tx.jo.etd),
        eta: new Date(tx.jo.eta),
        commodity: tx.jo.commodity,
        createdById: sales?.id || admin.id,
      },
    });
    console.log(`  ✓ Sales Order: ${soNumber}`);

    // 4. Create Job Order with milestones
    const joNumber = `${branchCode}-${serviceCode}-202606-${seq}`;
    const totalCost = tx.vendorCosts.reduce((s, v) => s + v.amount, 0);
    const grossProfit = totalAmount - totalCost;

    const jobOrder = await prisma.jobOrder.create({
      data: {
        number: joNumber,
        salesOrderId: salesOrder.id,
        customerId: customer.id,
        serviceType: tx.qt.serviceType,
        branchId,
        shipper: tx.jo.shipper,
        consignee: tx.jo.consignee,
        pol: tx.jo.pol,
        pod: tx.jo.pod,
        commodity: tx.jo.commodity,
        hsCode: tx.jo.hsCode,
        incoterms: tx.qt.serviceType.includes("IMPORT") ? "CIF" : "FOB",
        containerType: tx.jo.containerType,
        containerQty: tx.jo.containerQty || undefined,
        vesselName: tx.jo.vesselName || undefined,
        voyageNo: tx.jo.voyageNo || undefined,
        flightNo: tx.jo.flightNo || undefined,
        etd: new Date(tx.jo.etd),
        eta: new Date(tx.jo.eta),
        status: i === 4 ? "IN_PROGRESS" : "COMPLETED", // Last one still in progress
        totalRevenue: totalAmount,
        totalCost,
        grossProfit,
        createdById: admin.id,
        assignedTo: sales?.id || admin.id,
        milestones: {
          create: [
            { type: "ORDER_CONFIRMED", status: "DONE", actualDate: new Date(`2026-06-0${i + 2}`) },
            { type: "DOCUMENT_RECEIVED", status: "DONE", actualDate: new Date(`2026-06-0${i + 3}`) },
            { type: "CUSTOMS_STARTED", status: "DONE", actualDate: new Date(tx.jo.eta) },
            { type: "CUSTOMS_DONE", status: i === 4 ? "IN_PROGRESS" : "DONE", actualDate: i === 4 ? undefined : new Date(tx.jo.eta) },
            { type: "CARGO_RELEASED", status: i === 4 ? "PENDING" : "DONE", actualDate: i === 4 ? undefined : new Date(tx.jo.eta) },
            { type: "DELIVERY_TO_CONSIGNEE", status: i === 4 ? "PENDING" : "DONE" },
            { type: "POD_RECEIVED", status: i < 3 ? "DONE" : "PENDING" },
            { type: "INVOICE_ISSUED", status: i < 3 ? "DONE" : "PENDING" },
            { type: "PAYMENT_RECEIVED", status: i < 2 ? "DONE" : "PENDING" },
            { type: "JOB_CLOSED", status: i < 1 ? "DONE" : "PENDING" },
          ],
        },
        revenues: {
          create: tx.items.map((item) => ({
            item: item.description,
            currency: tx.qt.currency,
            amount: item.qty * item.unitPrice,
            amountIdr: item.qty * item.unitPrice,
          })),
        },
        costs: {
          create: tx.vendorCosts.map((vc) => ({
            vendor: vc.vendorName,
            item: vc.description,
            currency: "IDR",
            amount: vc.amount,
            amountIdr: vc.amount,
          })),
        },
        activities: {
          create: [
            { action: "CREATED", description: `Job Order ${joNumber} dibuat dari SO ${soNumber}`, userId: admin.id },
            { action: "STATUS_CHANGED", description: "Status berubah: DRAFT → CONFIRMED", userId: admin.id },
            { action: "DOCUMENT_RECEIVED", description: "Dokumen shipping diterima", userId: admin.id },
          ],
        },
      },
    });
    console.log(`  ✓ Job Order: ${joNumber} (Profit: ${grossProfit.toLocaleString()})`);

    // 5. Create Customs Clearance
    const customsData: Record<string, unknown> = {
      jobOrderId: jobOrder.id,
      direction: tx.customs.direction,
      kantorPabean: tx.customs.kantorPabean,
      jalurPabean: tx.customs.jalurPabean,
      statusClearance: tx.customs.statusClearance,
    };
    if (tx.customs.pibNumber) customsData.pibNumber = tx.customs.pibNumber;
    if (tx.customs.pebNumber) customsData.pebNumber = tx.customs.pebNumber;
    if (tx.customs.sppbNumber) customsData.sppbNumber = tx.customs.sppbNumber;
    if (tx.customs.npeNumber) customsData.npeNumber = tx.customs.npeNumber;
    if (tx.customs.nilaiCIF) customsData.nilaiCIF = tx.customs.nilaiCIF;
    if (tx.customs.nilaiFOB) customsData.nilaiFOB = tx.customs.nilaiFOB;
    if (tx.customs.beaMasuk) customsData.beaMasuk = tx.customs.beaMasuk;
    if (tx.customs.ppnImpor) customsData.ppnImpor = tx.customs.ppnImpor;
    if (tx.customs.pphImpor) customsData.pphImpor = tx.customs.pphImpor;
    if (tx.customs.beaKeluar !== undefined) customsData.beaKeluar = tx.customs.beaKeluar;

    await prisma.customsClearance.create({ data: customsData as any });
    console.log(`  ✓ Customs: ${tx.customs.pibNumber || tx.customs.pebNumber} (${tx.customs.jalurPabean})`);

    // 6. Create Truck Assignment
    await prisma.truckAssignment.create({
      data: {
        jobOrderId: jobOrder.id,
        plateNumber: tx.trucking.plateNumber,
        driverName: tx.trucking.driverName,
        origin: tx.trucking.origin,
        destination: tx.trucking.destination,
        status: i === 4 ? "ASSIGNED" : "POD_RECEIVED",
        departureTime: new Date(tx.jo.eta),
      },
    });
    console.log(`  ✓ Trucking: ${tx.trucking.plateNumber} (${tx.trucking.driverName})`);

    // 7. Create Invoice AR (for completed ones)
    if (i < 4) {
      const invNumber = `INV-2026-${seq}`;
      const ppnAmount = Math.round(totalAmount * 0.12);
      const invTotal = totalAmount + ppnAmount;

      await prisma.invoice.create({
        data: {
          number: invNumber,
          jobOrderId: jobOrder.id,
          customerId: customer.id,
          invoiceType: "COMMERCIAL",
          currency: tx.qt.currency,
          subtotal: totalAmount,
          ppnAmount,
          totalAmount: invTotal,
          outstandingAmount: i < 2 ? 0 : invTotal, // First 2 paid
          paidAmount: i < 2 ? invTotal : 0,
          status: i < 2 ? "PAID" : "SENT",
          paymentTerms: "30 days",
          dueDate: new Date("2026-07-20"),
          createdById: admin.id,
          lineItems: {
            create: tx.items.map((item) => ({
              description: item.description,
              quantity: item.qty,
              unitPrice: item.unitPrice,
              amount: item.qty * item.unitPrice,
              ppn: true,
              ppnAmount: Math.round(item.qty * item.unitPrice * 0.12),
            })),
          },
          payments: i < 2 ? {
            create: {
              receiptNo: `RCP-2026-${seq}`,
              paymentDate: new Date(`2026-06-${20 + i}`),
              amount: invTotal,
              method: "Transfer Bank",
              bankRef: `BCA-${Date.now()}-${i}`,
              receivedBy: admin.name,
            },
          } : undefined,
        },
      });
      console.log(`  ✓ Invoice AR: ${invNumber} (${i < 2 ? "PAID" : "SENT"})`);
    }

    // 8. Create Vendor Invoices (AP)
    for (let v = 0; v < tx.vendorCosts.length; v++) {
      const vc = tx.vendorCosts[v];
      const apNumber = `API-2026-${seq}${String(v + 1).padStart(2, "0")}`;
      const ppnMasukan = Math.round(vc.amount * 0.12);
      const pph23 = Math.round(vc.amount * 0.02);

      await prisma.vendorInvoice.create({
        data: {
          number: apNumber,
          jobOrderId: jobOrder.id,
          vendorName: vc.vendorName,
          vendorType: "Vendor",
          currency: "IDR",
          subtotal: vc.amount,
          ppnMasukan,
          pph23Amount: pph23,
          totalAmount: vc.amount + ppnMasukan,
          netPayable: vc.amount + ppnMasukan - pph23,
          outstandingAmount: i < 2 ? 0 : vc.amount + ppnMasukan - pph23,
          paidAmount: i < 2 ? vc.amount + ppnMasukan - pph23 : 0,
          status: i < 2 ? "PAID" : i < 4 ? "APPROVED" : "DRAFT",
          paymentTerms: "14 days",
          dueDate: new Date("2026-07-10"),
          createdById: admin.id,
          lineItems: {
            create: {
              description: vc.description,
              quantity: 1,
              unitPrice: vc.amount,
              amount: vc.amount,
              ppnMasukan: true,
              ppnAmount: ppnMasukan,
            },
          },
          payments: i < 2 ? {
            create: {
              paymentNo: `PAY-${apNumber}`,
              paymentDate: new Date(`2026-06-${22 + i}`),
              amount: vc.amount + ppnMasukan - pph23,
              method: "Transfer Bank",
              processedBy: admin.name,
            },
          } : undefined,
        },
      });
    }
    console.log(`  ✓ Vendor AP: ${tx.vendorCosts.length} invoices`);

    // 9. Create Documents
    const docTypes = tx.qt.serviceType.includes("IMPORT")
      ? ["BL", "COMMERCIAL_INVOICE", "PACKING_LIST", "PIB", "SPPB", "DO"]
      : ["BL", "COMMERCIAL_INVOICE", "PACKING_LIST", "PEB", "SI"];

    for (const docType of docTypes) {
      await prisma.document.create({
        data: {
          jobOrderId: jobOrder.id,
          type: docType as any,
          name: docType.replace("_", " "),
          status: i < 3 ? "APPROVED" : "UPLOADED",
          uploadedById: admin.id,
        },
      });
    }
    console.log(`  ✓ Documents: ${docTypes.length} uploaded`);

    console.log(`  ✅ Transaction ${i + 1} complete!\n`);
  }

  // Create Chat Rooms for collaboration
  const generalRoom = await prisma.chatRoom.create({
    data: {
      type: "channel",
      name: "General",
      description: "Channel umum untuk semua tim",
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id, userName: admin.name, role: "owner" },
          ...(sales ? [{ userId: sales.id, userName: sales.name, role: "member" as const }] : []),
        ],
      },
      messages: {
        create: [
          { senderId: admin.id, senderName: admin.name, content: "Selamat datang di KayOcean FMS! 🎉", type: "system" },
          { senderId: admin.id, senderName: admin.name, content: "Semua data Juni sudah masuk. Silakan cek dashboard." },
        ],
      },
    },
  });
  console.log("✓ Chat room 'General' created with messages");

  console.log("\n🎉 ALL 5 TRANSACTIONS SEEDED SUCCESSFULLY!");
  console.log("=" .repeat(50));
  console.log("Summary:");
  console.log("  • 5 Customers");
  console.log("  • 5 Quotations (ACCEPTED)");
  console.log("  • 5 Sales Orders (CONFIRMED)");
  console.log("  • 5 Job Orders (1 CLOSED, 2 COMPLETED, 1 INVOICED, 1 IN_PROGRESS)");
  console.log("  • 5 Customs Clearances");
  console.log("  • 5 Truck Assignments");
  console.log("  • 4 Invoices AR (2 PAID, 2 SENT)");
  console.log("  • 18 Vendor Invoices AP");
  console.log("  • ~30 Documents");
  console.log("  • Revenue/Cost/Profit calculated per JO");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
