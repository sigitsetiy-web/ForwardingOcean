import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PrintToolbarWrapper } from "@/components/print/print-toolbar-wrapper";
import { PrintStatusBadge } from "@/components/print/status-badge";
import {
  COMPANY,
  formatCurrency,
  formatDate,
  isDraftStatus,
  serviceLabel,
} from "@/lib/print-utils";

export const dynamic = "force-dynamic";

const MILESTONE_LABELS: Record<string, string> = {
  ORDER_CONFIRMED: "Order Confirmed",
  DOCUMENT_RECEIVED: "Document Received",
  CUSTOMS_STARTED: "Customs Started",
  CUSTOMS_DONE: "Customs Done",
  CARGO_RELEASED: "Cargo Released",
  DELIVERY_TO_CONSIGNEE: "Delivery to Consignee",
  POD_RECEIVED: "POD Received",
  INVOICE_ISSUED: "Invoice Issued",
  PAYMENT_RECEIVED: "Payment Received",
  JOB_CLOSED: "Job Closed",
};

export default async function PrintJobOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const jo = await prisma.jobOrder.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      branch: true,
      milestones: { orderBy: { createdAt: "asc" } },
      revenues: { orderBy: { createdAt: "asc" } },
      costs: { orderBy: { createdAt: "asc" } },
      documents: { orderBy: { createdAt: "desc" }, take: 20 },
      assignments: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!jo) notFound();

  const showWatermark = isDraftStatus(jo.status);
  const showFinancials = ["INVOICED", "CLOSED", "COMPLETED"].includes(jo.status);

  return (
    <>
      <PrintToolbarWrapper title={`Job Order ${jo.number}`} />
      <div className="print-page print-doc">
        {showWatermark && <div className="print-watermark">DRAFT</div>}
        <div className="print-doc-body">
          <header className="print-doc-header">
            <div>
              <h1>JOB ORDER</h1>
              <p className="company">{COMPANY.name}</p>
              <p className="company">{COMPANY.tagline}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "14pt", fontWeight: 700, margin: 0 }}>
                {jo.number}
              </p>
              <p style={{ fontSize: "9pt", color: "#6a6d70", margin: "4px 0 8px" }}>
                {formatDate(jo.createdAt)}
              </p>
              <PrintStatusBadge type="job-order" status={jo.status} />
            </div>
          </header>

          <section className="print-section">
            <h2>Informasi Umum</h2>
            <div className="print-grid">
              <PrintRow label="Pelanggan" value={jo.customer?.name} />
              <PrintRow label="Cabang" value={jo.branch?.name} />
              <PrintRow label="Jenis Layanan" value={serviceLabel(jo.serviceType)} />
              <PrintRow label="Shipper" value={jo.shipper} />
              <PrintRow label="Consignee" value={jo.consignee} />
              <PrintRow label="Incoterms" value={jo.incoterms} />
            </div>
          </section>

          <section className="print-section">
            <h2>Rute & Jadwal</h2>
            <div className="print-grid">
              <PrintRow label="Port of Loading" value={jo.pol} />
              <PrintRow label="Port of Discharge" value={jo.pod} />
              <PrintRow label="Vessel" value={jo.vesselName} />
              <PrintRow label="Voyage No" value={jo.voyageNo} />
              <PrintRow label="Flight No" value={jo.flightNo} />
              <PrintRow label="ETD" value={formatDate(jo.etd)} />
              <PrintRow label="ETA" value={formatDate(jo.eta)} />
            </div>
          </section>

          <section className="print-section">
            <h2>Detail Kargo</h2>
            <div className="print-grid">
              <PrintRow label="Komoditas" value={jo.commodity} />
              <PrintRow label="HS Code" value={jo.hsCode} />
              <PrintRow label="Jumlah" value={jo.quantity?.toString()} />
              <PrintRow
                label="Berat Kotor"
                value={jo.grossWeight ? `${jo.grossWeight} kg` : undefined}
              />
              <PrintRow label="Volume" value={jo.cbm ? `${jo.cbm} CBM` : undefined} />
              <PrintRow
                label="Kontainer"
                value={
                  jo.containerType
                    ? `${jo.containerQty || 1}x ${jo.containerType}`
                    : undefined
                }
              />
            </div>
          </section>

          {jo.milestones.length > 0 && (
            <section className="print-section">
              <h2>Progress Milestone</h2>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {jo.milestones.map((m) => (
                    <tr key={m.id}>
                      <td>{MILESTONE_LABELS[m.type] || m.type}</td>
                      <td>{m.status}</td>
                      <td>{m.actualDate ? formatDate(m.actualDate) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {jo.documents.length > 0 && (
            <section className="print-section">
              <h2>Daftar Dokumen</h2>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Tipe</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jo.documents.map((d) => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td>{d.type}</td>
                      <td>{d.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {showFinancials && (
            <section className="print-section">
              <h2>Ringkasan Keuangan</h2>
              <div className="print-grid">
                <PrintRow
                  label="Total Revenue"
                  value={formatCurrency(Number(jo.totalRevenue || 0))}
                />
                <PrintRow
                  label="Total Cost"
                  value={formatCurrency(Number(jo.totalCost || 0))}
                />
                <PrintRow
                  label="Gross Profit"
                  value={formatCurrency(Number(jo.grossProfit || 0))}
                />
              </div>
              {jo.revenues.length > 0 && (
                <>
                  <h2 style={{ marginTop: 12 }}>Pendapatan</h2>
                  <table className="print-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th className="text-right">Jumlah (IDR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jo.revenues.map((r) => (
                        <tr key={r.id}>
                          <td>{r.item}</td>
                          <td className="text-right">
                            {formatCurrency(Number(r.amountIdr))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </section>
          )}

          {jo.assignments.length > 0 && (
            <section className="print-section">
              <h2>Trucking</h2>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>No. Kendaraan</th>
                    <th>Driver</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jo.assignments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.plateNumber || "-"}</td>
                      <td>{a.driverName || "-"}</td>
                      <td>{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <div className="print-signatures">
            <div className="print-sign-box">
              <p>Operations,</p>
              <div className="print-sign-line">CSO / Operasional</div>
            </div>
            <div className="print-sign-box">
              <p>Customer Acknowledgement,</p>
              <div className="print-sign-line">Customer</div>
            </div>
          </div>

          <footer className="print-footer">
            Dicetak dari KayOcean FMS • {formatDate(new Date(), true)} • Status:{" "}
            {jo.status.replace(/_/g, " ")}
          </footer>
        </div>
      </div>
    </>
  );
}

function PrintRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="print-row">
      <span className="label">{label}</span>
      <span className="value">{value || "-"}</span>
    </div>
  );
}
