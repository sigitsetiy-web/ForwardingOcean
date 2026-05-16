"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/use-current-user";
import { QuotationHeader } from "@/components/quotation/header-section";
import { CustomerSection } from "@/components/quotation/customer-section";
import { ShipmentSection } from "@/components/quotation/shipment-section";
import { RateTable } from "@/components/quotation/rate-table";
import { TermsSection } from "@/components/quotation/terms-section";
import { SignatureSection } from "@/components/quotation/signature-section";
import { FileText, Save, Send, CheckCircle, X, Eye } from "lucide-react";

export default function NewQuotationPage() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const [formData, setFormData] = useState({
    // Customer
    customerId: "",
    customerName: "",
    customerCode: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    npwp: "",
    currency: "IDR",
    // Shipment
    serviceTypes: [] as string[],
    incoterms: "",
    pol: "",
    pod: "",
    commodity: "",
    cargoType: "FCL",
    containerSizes: [] as string[],
    estWeight: "",
    weightUnit: "KG",
    estQty: "",
    dangerousGoods: false,
    insuranceRequired: false,
    // Terms
    paymentTerms: "",
    paymentMethod: "",
    kursReference: "",
    kursCustom: "",
    rateValidity: "30",
    exclusions: "",
    remarks: "",
    // Meta
    branchId: "",
    validUntil: "",
    preparedBy: "",
    preparedPosition: "",
  });

  const [rateItems, setRateItems] = useState([
    { description: "Ocean/Air Freight Charge", category: "Freight", uom: "Per Shipment", qty: 1, rate: 0, ppn: false, notes: "" },
    { description: "Origin Charges (THC, Doc Fee, B/L Fee)", category: "Origin", uom: "Per Shipment", qty: 1, rate: 0, ppn: true, notes: "" },
    { description: "Destination Charges (THC Dest, D/O Fee)", category: "Destination", uom: "Per Shipment", qty: 1, rate: 0, ppn: true, notes: "" },
    { description: "Custom Clearance Fee (PIB/PEB)", category: "Customs", uom: "Per Shipment", qty: 1, rate: 0, ppn: true, notes: "" },
    { description: "Handling Fee", category: "Handling", uom: "Per Shipment", qty: 1, rate: 0, ppn: true, notes: "" },
    { description: "Trucking / Drayage", category: "Trucking", uom: "Per Trip", qty: 1, rate: 0, ppn: true, notes: "" },
  ]);

  // Fetch customers from Accurate
  const { data: customersData } = useQuery({
    queryKey: ["ao-customers-qt"],
    queryFn: async () => {
      const res = await fetch("/api/accurate-online/customers?pageSize=100");
      return res.json();
    },
  });

  // Fetch branches
  const { data: branchesData } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const res = await fetch("/api/branches");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Gagal membuat quotation");
      return res.json();
    },
    onSuccess: () => router.push("/quotations"),
  });

  const handleSubmit = (status: "DRAFT" | "SENT") => {
    const items = rateItems
      .filter((item) => item.rate > 0)
      .map((item) => ({
        description: item.description,
        unit: item.uom,
        quantity: item.qty,
        unitPrice: item.rate,
        currency: formData.currency,
        amount: item.qty * item.rate,
        notes: item.notes,
      }));

    createMutation.mutate({
      customerId: formData.customerId,
      customerName: formData.customerName,
      customerCode: formData.customerCode,
      serviceType: formData.serviceTypes[0] || "SEA_IMPORT",
      origin: formData.pol,
      destination: formData.pod,
      validUntil: formData.validUntil,
      currency: formData.currency,
      notes: formData.remarks,
      branchId: formData.branchId || user?.branchId || branchesData?.data?.[0]?.id || "",
      createdById: user?.id || "",
      items,
    });
  };

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const subtotal = rateItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const ppnItems = rateItems.filter((item) => item.ppn && item.rate > 0);
  const ppnAmount = ppnItems.reduce((sum, item) => sum + item.qty * item.rate * 0.12, 0);
  const total = subtotal + ppnAmount;

  return (
    <div className="min-h-screen" style={{ background: "#F5F6F7" }}>
      {/* Breadcrumb */}
      <div className="px-6 py-3 text-sm" style={{ color: "#6A6D70" }}>
        <span className="hover:text-[#0070F2] cursor-pointer">Home</span>
        <span className="mx-2">›</span>
        <span className="hover:text-[#0070F2] cursor-pointer">Sales</span>
        <span className="mx-2">›</span>
        <span className="hover:text-[#0070F2] cursor-pointer">Quotation</span>
        <span className="mx-2">›</span>
        <span style={{ color: "#32363A" }} className="font-medium">New</span>
      </div>

      <div className="px-6 pb-24 max-w-[1440px] mx-auto space-y-5">
        {/* Document Header */}
        <QuotationHeader formData={formData} updateField={updateField} />

        {/* Customer Info */}
        <CustomerSection
          formData={formData}
          updateField={updateField}
          customers={customersData?.data || []}
        />

        {/* Shipment Details */}
        <ShipmentSection formData={formData} updateField={updateField} />

        {/* Rate Table */}
        <RateTable
          items={rateItems}
          setItems={setRateItems}
          currency={formData.currency}
          subtotal={subtotal}
          ppnAmount={ppnAmount}
          total={total}
        />

        {/* Terms & Conditions */}
        <TermsSection formData={formData} updateField={updateField} />

        {/* Signature */}
        <SignatureSection formData={formData} updateField={updateField} />

        {/* Activity Log */}
        <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
          <button className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium" style={{ color: "#6A6D70" }}>
            <span>Activity Log / History</span>
            <span>▾</span>
          </button>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50" style={{ borderColor: "#D1D2D4" }}>
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-gray-50" style={{ borderColor: "#D1D2D4", color: "#32363A" }}>
              <Eye className="h-4 w-4" />
              Preview PDF
            </button>
            <button
              onClick={() => handleSubmit("DRAFT")}
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-gray-50"
              style={{ borderColor: "#D1D2D4", color: "#32363A" }}
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSubmit("SENT")}
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white"
              style={{ background: "#0070F2" }}
            >
              <Send className="h-4 w-4" />
              Send to Customer
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white" style={{ background: "#107E3E" }}>
              <CheckCircle className="h-4 w-4" />
              Mark as Approved
            </button>
            <button
              onClick={() => router.push("/quotations")}
              className="flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium"
              style={{ borderColor: "#BB0000", color: "#BB0000" }}
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>

      {createMutation.isError && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg text-sm z-50">
          {createMutation.error.message}
        </div>
      )}
    </div>
  );
}
