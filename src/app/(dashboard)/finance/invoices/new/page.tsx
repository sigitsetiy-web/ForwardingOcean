"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Save, Send, CheckCircle, X, Printer, Mail, Paperclip, CreditCard, RotateCcw } from "lucide-react";
import { InvHeaderBanner } from "@/components/invoice/inv-header-banner";
import { InvMultiPartyTabs } from "@/components/invoice/inv-multi-party-tabs";
import { InvBillingParty } from "@/components/invoice/inv-billing-party";
import { InvShipmentRef } from "@/components/invoice/inv-shipment-ref";
import { InvLineItems } from "@/components/invoice/inv-line-items";
import { InvPaymentTerms } from "@/components/invoice/inv-payment-terms";
import { InvTaxSection } from "@/components/invoice/inv-tax-section";
import { InvDelivery } from "@/components/invoice/inv-delivery";
import { InvPaymentTracking } from "@/components/invoice/inv-payment-tracking";
import { InvJOSummary } from "@/components/invoice/inv-jo-summary";
import { InvActivityLog } from "@/components/invoice/inv-activity-log";

export default function NewInvoicePage() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    refJO: "JO-2025-0112", refSO: "SO-2025-0089", refQT: "QT-2025-0047",
    invoiceNumber: "INV-2025-0121", invoiceDate: "2025-05-12", dueDate: "2025-06-11",
    status: "DRAFT", invoiceType: "COMMERCIAL", billingPartyType: "OVERSEAS",
    currency: "USD", exchangeRate: "16000", rateRef: "bi_tengah", rateDate: "2025-05-12",
    // Billing Party
    partyType: "overseas_agent", companyName: "Shanghai Cargo Agent Co., Ltd",
    customerCode: "V.00015", contactPerson: "Mr. Wang Wei", phone: "+86 21 5888 9999",
    email: "wang.wei@shcargo.cn", financeEmail: "finance@shcargo.cn", picFinance: "Ms. Li",
    billingAddress: "Room 2201, Tower B, Pudong Financial Center\nNo. 1088 Pudong South Road\nShanghai 200120, China",
    country: "China", npwp: "", taxStatus: "overseas", fakturRequired: false, fakturNumber: "",
    poReference: "PO-SHC-2025-0089", specialInstructions: "",
    // Payment
    paymentTerms: "NET30", paymentMethod: ["tt"], bankName: "Bank of China",
    accountName: "PT Key Ocean Forwarding", accountNumber: "088-123-456-789",
    swiftCode: "BKCHCNBJ", remittanceInstruction: "Please include Invoice No. INV-2025-0121 in payment reference",
    // Delivery
    deliveryMethod: ["email"], sendToEmail: "finance@shcargo.cn", ccEmail: "wang.wei@shcargo.cn",
  });

  const [lineItems] = useState([
    { description: "Origin Handling & Coordination Fee", category: "Handling", uom: "Per Shipment", qty: 1, rate: 150, ppn: false, notes: "Shanghai origin" },
    { description: "Documentation Fee (B/L, Manifest)", category: "Origin Charges", uom: "Per Shipment", qty: 1, rate: 75, ppn: false, notes: "" },
    { description: "Container Inspection & Seal", category: "Origin Charges", uom: "Per Container", qty: 2, rate: 50, ppn: false, notes: "2x40'HC" },
    { description: "Cargo Coordination & Communication", category: "Handling", uom: "Per Shipment", qty: 1, rate: 75, ppn: false, notes: "" },
  ]);

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveInvoice = async () => {
    try {
      // Need a job order ID to link the invoice
      const joRes = await fetch("/api/job-orders?pageSize=1");
      const joData = await joRes.json();
      const jobOrderId = joData.data?.[0]?.id;

      if (!jobOrderId) { alert("Belum ada Job Order. Buat JO terlebih dahulu."); return; }

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobOrderId,
          customerId: undefined,
          invoiceType: formData.invoiceType,
          billingPartyType: formData.billingPartyType,
          billingCompany: formData.companyName,
          billingAddress: formData.billingAddress,
          billingContact: formData.contactPerson,
          billingEmail: formData.email,
          billingCountry: formData.country,
          taxStatus: formData.taxStatus,
          currency: formData.currency,
          exchangeRate: formData.exchangeRate ? parseFloat(formData.exchangeRate) : undefined,
          paymentTerms: formData.paymentTerms,
          bankName: formData.bankName,
          bankAccount: formData.accountNumber,
          swiftCode: formData.swiftCode,
          dueDate: formData.dueDate,
          createdById: user?.id,
          lineItems: lineItems.map(item => ({
            description: item.description,
            category: item.category,
            uom: item.uom,
            quantity: item.qty,
            unitPrice: item.rate,
            amount: item.qty * item.rate,
            ppn: item.ppn,
            ppnAmount: item.ppn ? item.qty * item.rate * 0.12 : 0,
            notes: item.notes,
          })),
        }),
      });

      if (res.ok) {
        alert("Invoice berhasil disimpan!");
        router.push("/finance");
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menyimpan invoice");
      }
    } catch (e) {
      alert("Error: " + (e instanceof Error ? e.message : "Unknown"));
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F6F7" }}>
      {/* Breadcrumb */}
      <div className="px-6 py-3 flex items-center justify-between text-sm">
        <div style={{ color: "#6A6D70" }}>
          <span className="hover:text-[#0070F2] cursor-pointer">Home</span><span className="mx-2">›</span>
          <span className="hover:text-[#0070F2] cursor-pointer">Billing</span><span className="mx-2">›</span>
          <span className="hover:text-[#0070F2] cursor-pointer">Customer Invoice</span><span className="mx-2">›</span>
          <span style={{ color: "#32363A" }} className="font-medium">New</span>
        </div>
        <div className="text-xs" style={{ color: "#6A6D70" }}>Last saved: 12 May 2025 | Created by: {user?.name || "Sigit"}</div>
      </div>

      <div className="px-6 pb-24 max-w-[1440px] mx-auto space-y-5">
        <InvMultiPartyTabs activeTab={activeTab} setActiveTab={setActiveTab} refJO={formData.refJO} />
        <InvHeaderBanner formData={formData} updateField={updateField} />
        <InvBillingParty formData={formData} updateField={updateField} />
        <InvShipmentRef formData={formData} />
        <InvLineItems items={lineItems} currency={formData.currency} />
        <InvPaymentTerms formData={formData} updateField={updateField} />
        <InvTaxSection formData={formData} />
        <InvDelivery formData={formData} updateField={updateField} />
        <InvPaymentTracking formData={formData} />
        <InvJOSummary />
        <InvActivityLog />
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50" style={{ borderColor: "#D1D2D4" }}>
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <Btn icon={<Printer className="h-4 w-4" />} label="Print Invoice" v="ghost" />
            <Btn icon={<Mail className="h-4 w-4" />} label="Send / Resend" v="ghost" />
            <Btn icon={<Paperclip className="h-4 w-4" />} label="Attach Docs" v="ghost" />
            <Btn icon={<RotateCcw className="h-4 w-4" />} label="Create Credit Note" v="ghost" />
          </div>
          <div className="flex gap-2">
            <Btn icon={<Save className="h-4 w-4" />} label="Save Draft" v="ghost" onClick={handleSaveInvoice} />
            <Btn icon={<Send className="h-4 w-4" />} label="Submit for Approval" v="outline" onClick={handleSaveInvoice} />
            <Btn icon={<Mail className="h-4 w-4" />} label="Mark as Sent" v="primary" />
            <Btn icon={<CreditCard className="h-4 w-4" />} label="Record Payment" v="success" />
            <Btn icon={<X className="h-4 w-4" />} label="Cancel" v="danger" onClick={() => router.push("/finance")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Btn({ icon, label, v, onClick }: { icon: React.ReactNode; label: string; v: "primary"|"outline"|"ghost"|"danger"|"success"; onClick?: () => void }) {
  const s: Record<string, React.CSSProperties> = {
    primary: { background: "#0070F2", color: "#fff", border: "1px solid #0070F2" },
    success: { background: "#107E3E", color: "#fff", border: "1px solid #107E3E" },
    outline: { background: "transparent", color: "#0070F2", border: "1px solid #0070F2" },
    ghost: { background: "transparent", color: "#32363A", border: "1px solid #D1D2D4" },
    danger: { background: "transparent", color: "#BB0000", border: "1px solid #BB0000" },
  };
  return <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90" style={s[v]}>{icon}{label}</button>;
}
