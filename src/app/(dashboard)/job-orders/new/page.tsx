"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Save, Send, CheckCircle, X, Printer, Mail, Paperclip, ChevronDown } from "lucide-react";
import { JOHeaderBanner } from "@/components/job-order/jo-header-banner";
import { JOCustomerSection } from "@/components/job-order/jo-customer-section";
import { JOShipmentSection } from "@/components/job-order/jo-shipment-section";
import { JOBookingSection } from "@/components/job-order/jo-booking-section";
import { JOCustomsSection } from "@/components/job-order/jo-customs-section";
import { JODocumentSection } from "@/components/job-order/jo-document-section";
import { JOTruckingSection } from "@/components/job-order/jo-trucking-section";
import { JOCostSection } from "@/components/job-order/jo-cost-section";
import { JOBillingSection } from "@/components/job-order/jo-billing-section";
import { JOActivityLog } from "@/components/job-order/jo-activity-log";

export default function NewJobOrderPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [statusDropdown, setStatusDropdown] = useState(false);

  const [formData, setFormData] = useState({
    refSO: "SO-2025-0001", refQT: "QT-2025-0047", status: "OPEN", priority: "Normal", direction: "IMPORT",
    // Customer
    customerName: "PT Sritex (SRIL)", customerCode: "C.00003", contactPerson: "Ibu Ratna", phone: "08123456789", email: "ratna@sritex.co.id", notifyParty: "",
    shipperName: "Shanghai Textile Trading Co., Ltd", shipperAddress: "No. 88 Pudong Road, Shanghai 200120, China",
    consigneeName: "PT Sri Rejeki Isman Tbk (Sritex)", consigneeAddress: "Jl. KH Samanhudi No. 88, Sukoharjo, Jawa Tengah 57521", consigneeNpwp: "01.546.275.8-532.000", endBuyer: "",
    // Shipment
    serviceTypes: ["Sea Freight", "Custom Clearance", "Trucking"], shipmentMode: "FCL", incoterms: "CIF",
    countryOrigin: "China 🇨🇳", countryDest: "Indonesia 🇮🇩", pol: "CNSHA - Shanghai", pod: "IDSMG - Tanjung Emas, Semarang", placeOfDelivery: "Sukoharjo, Jawa Tengah", transitPort: "", routingNotes: "",
    carrier: "Evergreen Shipping", vesselName: "EVER GIVEN", voyageNo: "1234-E", motherVessel: "", feederVessel: "",
    etd: "2025-05-20T08:00", atd: "", eta: "2025-06-03T06:00", ata: "", freeTimeDest: "7", freeTimeOrigin: "5",
    commodity: "Grey Fabric / Kain Mentah - 100% Cotton Greige Fabric", hsCode: "5208.11.00",
    packagingType: "Pallet", totalPackages: "120", dangerousGoods: false, reeferCargo: false, marksNumbers: "SRITEX/SMG\nPO: 2025-0089\nC/NO: 1-120",
    // Booking
    bookingRef: "EVGL-2025-88712", bookingDate: "2025-05-12", bookingConfirmDate: "2025-05-13", bookingValidity: "2025-05-18",
    spaceType: "Direct", cutoffSI: "2025-05-17T16:00", cutoffVGM: "2025-05-18T12:00", cutoffGateIn: "2025-05-18T23:59", cutoffCustoms: "2025-05-17T12:00",
    bookingAgent: "PT Samudera Indonesia", emklContact: "Pak Hadi - 081234567890", depoLocation: "Depo Evergreen - Marunda, Jakarta",
    stuffingLocation: "Gudang Sritex - Sukoharjo", stuffingDate: "2025-05-16T08:00", stuffingOfficer: "Rudi Hartono",
    gateInDate: "", cyLocation: "JICT - Tanjung Priok", cargoReadyDate: "2025-05-15", bookingNotes: "2x40HC, direct service no transshipment",
    // Customs
    customsTab: "import",
    importirName: "PT Sri Rejeki Isman Tbk", importirNpwp: "01.546.275.8-532.000", apiNumber: "API-U/09.01.0001",
    pibNumber: "", pibDate: "", noPendaftaran: "", tglPendaftaran: "", sppbNumber: "", sppbDate: "",
    kantorPabean: "KPPBC Tanjung Emas Semarang", jalurPabean: "hijau",
    nilaiCIF: "125000", beaMasuk: "62500000", ppnImpor: "20625000", pphImpor: "15625000", cukai: "0", pnbp: "500000",
    statusClearance: "Belum Daftar",
  });

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const statusOptions = [
    "Mark as Booking Confirmed", "Mark as Cargo Ready", "Mark as Customs Submitted",
    "Mark as SPPB Terbit / Customs Cleared", "Mark as Gate-In", "Mark as Departed",
    "Mark as Arrived", "Mark as Delivered", "Close JO",
  ];

  const [saving, setSaving] = useState(false);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      // Get first branch for now
      const branchRes = await fetch("/api/branches");
      const branchData = await branchRes.json();
      const branchId = branchData.data?.[0]?.id;

      // Get or create customer
      const custRes = await fetch("/api/customers?pageSize=1");
      const custData = await custRes.json();
      const customerId = custData.data?.[0]?.id;

      if (!branchId || !customerId) {
        alert("Data cabang atau pelanggan belum tersedia");
        return;
      }

      const res = await fetch("/api/job-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          serviceType: "SEA_IMPORT",
          branchId,
          shipper: formData.shipperName,
          consignee: formData.consigneeName,
          pol: formData.pol,
          pod: formData.pod,
          commodity: formData.commodity,
          hsCode: formData.hsCode,
          incoterms: formData.incoterms,
          vesselName: formData.vesselName,
          voyageNo: formData.voyageNo,
          etd: formData.etd || undefined,
          eta: formData.eta || undefined,
          createdById: user?.id || "",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/job-orders/${data.data.id}`);
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menyimpan Job Order");
      }
    } catch (e) {
      alert("Error: " + (e instanceof Error ? e.message : "Unknown"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F6F7" }}>
      {/* Breadcrumb */}
      <div className="px-6 py-3 flex items-center justify-between text-sm">
        <div style={{ color: "#6A6D70" }}>
          <span className="hover:text-[#0070F2] cursor-pointer">Home</span><span className="mx-2">›</span>
          <span className="hover:text-[#0070F2] cursor-pointer">Operations</span><span className="mx-2">›</span>
          <span className="hover:text-[#0070F2] cursor-pointer">Job Order</span><span className="mx-2">›</span>
          <span style={{ color: "#32363A" }} className="font-medium">New</span>
        </div>
        <div className="text-xs" style={{ color: "#6A6D70" }}>Last saved: 16 May 2025 | Operator: {user?.name || "Traffic Officer"}</div>
      </div>

      <div className="px-6 pb-24 max-w-[1440px] mx-auto space-y-5">
        <JOHeaderBanner formData={formData} updateField={updateField} />
        <JOCustomerSection formData={formData} updateField={updateField} />
        <JOShipmentSection formData={formData} updateField={updateField} />
        <JOBookingSection formData={formData} updateField={updateField} />
        <JOCustomsSection formData={formData} updateField={updateField} />
        <JODocumentSection />
        <JOTruckingSection />
        <JOCostSection />
        <JOBillingSection />
        <JOActivityLog />
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50" style={{ borderColor: "#D1D2D4" }}>
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <Btn icon={<Printer className="h-4 w-4" />} label="Print JO" v="ghost" />
            <Btn icon={<Mail className="h-4 w-4" />} label="Send Arrival Notice" v="ghost" />
            <Btn icon={<Paperclip className="h-4 w-4" />} label="Attach File" v="ghost" />
          </div>
          <div className="flex gap-2">
            <Btn icon={<Save className="h-4 w-4" />} label="Save Draft" v="ghost" onClick={handleSaveDraft} />
            <Btn icon={<Send className="h-4 w-4" />} label="Submit JO" v="outline" onClick={handleSaveDraft} />
            {/* Update Status Dropdown */}
            <div className="relative">
              <button onClick={() => setStatusDropdown(!statusDropdown)} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white" style={{ background: "#0070F2" }}>
                Update Status <ChevronDown className="h-4 w-4" />
              </button>
              {statusDropdown && (
                <div className="absolute bottom-full mb-1 right-0 w-64 bg-white rounded-lg border shadow-xl py-1 z-50" style={{ borderColor: "#D1D2D4" }}>
                  {statusOptions.map((opt) => (
                    <button key={opt} onClick={() => setStatusDropdown(false)} className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50" style={{ color: "#32363A" }}>{opt}</button>
                  ))}
                </div>
              )}
            </div>
            <Btn icon={<CheckCircle className="h-4 w-4" />} label="Close JO" v="primary" />
            <Btn icon={<X className="h-4 w-4" />} label="Cancel" v="danger" onClick={() => router.push("/job-orders")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Btn({ icon, label, v, onClick }: { icon: React.ReactNode; label: string; v: "primary"|"outline"|"ghost"|"danger"; onClick?: () => void }) {
  const s: Record<string, React.CSSProperties> = {
    primary: { background: "#0070F2", color: "#fff", border: "1px solid #0070F2" },
    outline: { background: "transparent", color: "#0070F2", border: "1px solid #0070F2" },
    ghost: { background: "transparent", color: "#32363A", border: "1px solid #D1D2D4" },
    danger: { background: "transparent", color: "#BB0000", border: "1px solid #BB0000" },
  };
  return <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90" style={s[v]}>{icon}{label}</button>;
}
