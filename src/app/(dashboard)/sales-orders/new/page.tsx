"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Save, Send, CheckCircle, X, Printer, Mail, Paperclip } from "lucide-react";
import { SOHeaderBanner } from "@/components/sales-order/so-header-banner";
import { SOCustomerSection } from "@/components/sales-order/so-customer-section";
import { SOShipmentSection } from "@/components/sales-order/so-shipment-section";
import { SORateTable } from "@/components/sales-order/so-rate-table";
import { SOPaymentSection } from "@/components/sales-order/so-payment-section";
import { SOAssignmentSection } from "@/components/sales-order/so-assignment-section";
import { SODocumentChecklist } from "@/components/sales-order/so-document-checklist";
import { SOTermsSection } from "@/components/sales-order/so-terms-section";
import { SOSignatureSection } from "@/components/sales-order/so-signature-section";
import { SOActivityLog } from "@/components/sales-order/so-activity-log";
import { SORelatedDocs } from "@/components/sales-order/so-related-docs";

export default function NewSalesOrderPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [formData, setFormData] = useState({
    // Reference
    refQuotation: "QT-2025-0047",
    refQuotationDate: "2025-05-01",
    priority: "Normal",
    status: "DRAFT",
    // Customer
    customerId: "50",
    customerName: "Design Pergola",
    customerCode: "C.00002",
    contactPerson: "Budi Santoso",
    phone: "08123456789",
    email: "budi@designpergola.co.id",
    billingAddress: "Jl. Industri No. 10, Kawasan Industri Candi\nSemarang, Jawa Tengah 50182",
    npwp: "01.234.567.8-901.000",
    taxType: "PKP",
    currency: "IDR",
    exchangeRate: "",
    kursRef: "bi_tengah",
    // Shipment
    serviceTypes: ["Sea Freight", "Custom Clearance", "Trucking"],
    incoterms: "CIF",
    direction: "Import",
    pol: "CNSHA - Shanghai, China",
    pod: "IDSMG - Semarang, Indonesia",
    transitPort: "",
    etd: "2025-05-20",
    eta: "2025-06-03",
    commodity: "Electronic Parts - PCB Assembly & Components",
    hsCode: "8534.00.90",
    cargoType: "FCL",
    containerSizes: ["40'HC"],
    numUnits: "2",
    estWeight: "12500",
    weightUnit: "KG",
    estVolume: "45.5",
    volumeUnit: "CBM",
    dangerousGoods: false,
    unNumber: "",
    imdgClass: "",
    insuranceRequired: true,
    insuredValue: "500000000",
    coverageType: "All Risk",
    specialHandling: "",
    // Payment
    paymentTerms: "NET30",
    dpPercentage: "",
    paymentMethod: ["transfer"],
    bankAccount: "",
    billingTrigger: "After DO Released",
    poNumber: "PO-DP-2025-0089",
    poDate: "2025-05-10",
    billingAttention: "Finance Dept - Ibu Sari",
    // Assignment
    salesPerson: "Sigit Setiyanto",
    accountManager: "",
    trafficOfficer: "",
    branch: "Semarang",
    division: "Import",
    costCenter: "",
    projectCode: "",
    shippingLine: "COSCO Shipping",
    emklPartner: "PT. Samudera Indonesia",
    truckingVendor: "PT. Jaya Trucking",
    internalNotes: "Customer VIP - prioritaskan handling",
    customerRequirements: "Barang harus sampai sebelum 5 Juni 2025",
    // Terms
    exclusions: "Bea Masuk, PDRI, PNBP, Biaya Detention/Demurrage, Biaya Survey, Biaya Fumigasi, dan biaya lain yang tidak tercantum dalam penawaran",
    amendmentClause: "Setiap perubahan scope pekerjaan harus dikonfirmasi tertulis oleh kedua pihak",
    disputeResolution: "musyawarah",
  });

  const [rateItems] = useState([
    { description: "Ocean Freight Charge (CNSHA → IDSMG)", category: "Freight", uom: "Per Container", qty: 2, rate: 25000000, ppn: false, notes: "40'HC x 2 units" },
    { description: "Origin Charges — THC", category: "Origin", uom: "Per Container", qty: 2, rate: 3500000, ppn: true, notes: "" },
    { description: "Origin Charges — Doc Fee / B/L Fee", category: "Origin", uom: "Per Shipment", qty: 1, rate: 1500000, ppn: true, notes: "" },
    { description: "Destination Charges — THC", category: "Destination", uom: "Per Container", qty: 2, rate: 4200000, ppn: true, notes: "" },
    { description: "Destination Charges — D/O Fee", category: "Destination", uom: "Per Shipment", qty: 1, rate: 750000, ppn: true, notes: "" },
    { description: "Custom Clearance Fee (PIB)", category: "Customs", uom: "Per Shipment", qty: 1, rate: 5000000, ppn: true, notes: "Include PNBP" },
    { description: "Handling Fee", category: "Handling", uom: "Per Shipment", qty: 1, rate: 2000000, ppn: true, notes: "" },
    { description: "Trucking / Drayage (Port → Warehouse)", category: "Trucking", uom: "Per Trip", qty: 2, rate: 4500000, ppn: true, notes: "Semarang area" },
    { description: "Insurance Premium", category: "Insurance", uom: "Lumpsum", qty: 1, rate: 2500000, ppn: false, notes: "All Risk" },
    { description: "Surcharge (BAF + CAF)", category: "Surcharge", uom: "Per Container", qty: 2, rate: 1200000, ppn: false, notes: "" },
  ]);

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F6F7" }}>
      {/* Breadcrumb */}
      <div className="px-6 py-3 flex items-center justify-between text-sm">
        <div style={{ color: "#6A6D70" }}>
          <span className="hover:text-[#0070F2] cursor-pointer">Home</span>
          <span className="mx-2">›</span>
          <span className="hover:text-[#0070F2] cursor-pointer">Sales</span>
          <span className="mx-2">›</span>
          <span className="hover:text-[#0070F2] cursor-pointer">Sales Order</span>
          <span className="mx-2">›</span>
          <span style={{ color: "#32363A" }} className="font-medium">New</span>
        </div>
        <div className="text-xs" style={{ color: "#6A6D70" }}>
          Last saved: 16 May 2025 | Saved by: {user?.name || "Sigit"}
        </div>
      </div>

      <div className="px-6 pb-24 max-w-[1440px] mx-auto space-y-5">
        <SOHeaderBanner formData={formData} updateField={updateField} />
        <SOCustomerSection formData={formData} updateField={updateField} />
        <SOShipmentSection formData={formData} updateField={updateField} />
        <SORateTable items={rateItems} currency={formData.currency} />
        <SOPaymentSection formData={formData} updateField={updateField} />
        <SOAssignmentSection formData={formData} updateField={updateField} />
        <SODocumentChecklist />
        <SOTermsSection formData={formData} updateField={updateField} />
        <SOSignatureSection user={user} />
        <SOActivityLog refQuotation={formData.refQuotation} />
        <SORelatedDocs refQuotation={formData.refQuotation} />
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50" style={{ borderColor: "#D1D2D4" }}>
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <ActionBtn icon={<Printer className="h-4 w-4" />} label="Print SO" variant="ghost" />
            <ActionBtn icon={<Mail className="h-4 w-4" />} label="Email to Customer" variant="ghost" />
            <ActionBtn icon={<Paperclip className="h-4 w-4" />} label="Attach File" variant="ghost" />
          </div>
          <div className="flex gap-2">
            <ActionBtn icon={<Save className="h-4 w-4" />} label="Save Draft" variant="ghost" />
            <ActionBtn icon={<Send className="h-4 w-4" />} label="Submit for Approval" variant="outline" />
            <ActionBtn icon={<CheckCircle className="h-4 w-4" />} label="Confirm SO" variant="primary" />
            <ActionBtn icon={<X className="h-4 w-4" />} label="Cancel SO" variant="danger" onClick={() => router.push("/sales-orders")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, variant, onClick }: { icon: React.ReactNode; label: string; variant: "primary" | "outline" | "ghost" | "danger"; onClick?: () => void }) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "#0070F2", color: "#fff", border: "1px solid #0070F2" },
    outline: { background: "transparent", color: "#0070F2", border: "1px solid #0070F2" },
    ghost: { background: "transparent", color: "#32363A", border: "1px solid #D1D2D4" },
    danger: { background: "transparent", color: "#BB0000", border: "1px solid #BB0000" },
  };
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity" style={styles[variant]}>
      {icon}{label}
    </button>
  );
}
