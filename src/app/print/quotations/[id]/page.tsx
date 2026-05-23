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

export default async function PrintQuotationPage({
  params,
}: {
  params: { id: string };
}) {
  const quotation = await prisma.quotation.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      branch: true,
      items: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!quotation) notFound();

  const showWatermark = isDraftStatus(quotation.status);

  return (
    <>
      <PrintToolbarWrapper title={`Quotation ${quotation.number}`} />
      <div className="print-page print-doc">
        {showWatermark && <div className="print-watermark">DRAFT</div>}
        <div className="print-doc-body">
          <header className="print-doc-header">
            <div>
              <h1>SURAT PENAWARAN HARGA</h1>
              <p className="company">{COMPANY.name}</p>
              <p className="company">{COMPANY.tagline}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "14pt", fontWeight: 700, margin: 0 }}>
                {quotation.number}
              </p>
              <p style={{ fontSize: "9pt", color: "#6a6d70", margin: "4px 0 8px" }}>
                {formatDate(quotation.createdAt)}
              </p>
              <PrintStatusBadge type="quotation" status={quotation.status} />
            </div>
          </header>

          <section className="print-section">
            <h2>Data Pelanggan</h2>
            <div className="print-grid">
              <PrintRow label="Pelanggan" value={quotation.customer?.name} />
              <PrintRow label="Cabang" value={quotation.branch?.name} />
              <PrintRow label="Kode Pelanggan" value={quotation.customer?.code} />
              <PrintRow label="NPWP" value={quotation.customer?.npwp} />
              <PrintRow label="Telepon" value={quotation.customer?.phone} />
              <PrintRow label="Email" value={quotation.customer?.email} />
            </div>
          </section>

          <section className="print-section">
            <h2>Detail Layanan</h2>
            <div className="print-grid">
              <PrintRow label="Jenis Layanan" value={serviceLabel(quotation.serviceType)} />
              <PrintRow label="Mata Uang" value={quotation.currency} />
              <PrintRow label="Origin" value={quotation.origin} />
              <PrintRow label="Destination" value={quotation.destination} />
              <PrintRow label="Berlaku Sampai" value={formatDate(quotation.validUntil)} />
            </div>
          </section>

          <section className="print-section">
            <h2>Rincian Biaya</h2>
            <table className="print-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Deskripsi</th>
                  <th>Satuan</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Harga Satuan</th>
                  <th className="text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, i) => (
                  <tr key={item.id}>
                    <td>{i + 1}</td>
                    <td>{item.description}</td>
                    <td>{item.unit || "-"}</td>
                    <td className="text-right">{Number(item.quantity)}</td>
                    <td className="text-right">
                      {formatCurrency(Number(item.unitPrice), quotation.currency)}
                    </td>
                    <td className="text-right">
                      {formatCurrency(Number(item.amount), quotation.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} className="text-right">
                    TOTAL
                  </td>
                  <td className="text-right">
                    {formatCurrency(Number(quotation.totalAmount || 0), quotation.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>

          {quotation.notes && (
            <section className="print-section">
              <h2>Catatan</h2>
              <p style={{ fontSize: "10pt", whiteSpace: "pre-wrap" }}>{quotation.notes}</p>
            </section>
          )}

          <section className="print-section">
            <h2>Syarat & Ketentuan</h2>
            <ul style={{ fontSize: "9pt", paddingLeft: 18, margin: 0 }}>
              <li>Penawaran berlaku sampai tanggal yang tertera di atas.</li>
              <li>Harga belum termasuk pajak kecuali dinyatakan lain.</li>
              <li>Subject to space/equipment availability at time of booking.</li>
            </ul>
          </section>

          <div className="print-signatures">
            <div className="print-sign-box">
              <p>Disiapkan oleh,</p>
              <div className="print-sign-line">Sales / Marketing</div>
            </div>
            <div className="print-sign-box">
              <p>Disetujui oleh,</p>
              <div className="print-sign-line">Customer / Manager</div>
            </div>
          </div>

          <footer className="print-footer">
            Dicetak dari KayOcean FMS • {formatDate(new Date(), true)} • Status:{" "}
            {quotation.status}
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
