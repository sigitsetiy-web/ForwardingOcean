"use client";

import { Search } from "lucide-react";

interface Props {
  formData: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
  customers: Record<string, unknown>[];
}

export function CustomerSection({ formData, updateField, customers }: Props) {
  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const customer = customers.find((c) => String(c.id) === id);
    if (customer) {
      updateField("customerId", String(customer.id));
      updateField("customerName", customer.name);
      updateField("customerCode", customer.customerNo || "");
      updateField("email", customer.email || "");
      updateField("phone", customer.mobilePhone || "");
      updateField("address", customer.billStreet || "");
      updateField("npwp", customer.npwpNo || "");
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
          Bill To / Customer Information
        </h3>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          <FieldGroup label="Customer Name" required>
            <div className="relative">
              <select
                value={formData.customerId as string}
                onChange={handleCustomerSelect}
                className="w-full px-3 py-2 pr-8 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none appearance-none"
                style={{ borderColor: "#D1D2D4" }}
              >
                <option value="">-- Pilih Pelanggan --</option>
                {customers.map((c) => (
                  <option key={String(c.id)} value={String(c.id)}>
                    {c.name as string}
                  </option>
                ))}
              </select>
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6A6D70" }} />
            </div>
          </FieldGroup>
          <FieldGroup label="Contact Person">
            <input
              value={formData.contactPerson as string}
              onChange={(e) => updateField("contactPerson", e.target.value)}
              placeholder="Nama kontak"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>
          <FieldGroup label="Phone / WhatsApp">
            <input
              value={formData.phone as string}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>
          <FieldGroup label="Email">
            <input
              type="email"
              value={formData.email as string}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="email@company.com"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <FieldGroup label="Customer Code">
            <input
              readOnly
              value={formData.customerCode as string}
              className="w-full px-3 py-2 rounded border text-sm bg-gray-50"
              style={{ borderColor: "#D1D2D4", color: "#6A6D70" }}
            />
            <p className="text-xs mt-1" style={{ color: "#6A6D70" }}>Auto-filled from customer master</p>
          </FieldGroup>
          <FieldGroup label="Address">
            <textarea
              rows={3}
              value={formData.address as string}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Alamat lengkap pelanggan"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none resize-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>
          <FieldGroup label="NPWP">
            <input
              value={formData.npwp as string}
              onChange={(e) => updateField("npwp", e.target.value)}
              placeholder="XX.XXX.XXX.X-XXX.XXX"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>
          <FieldGroup label="Currency">
            <div className="flex gap-2">
              {["IDR", "USD"].map((cur) => (
                <button
                  key={cur}
                  onClick={() => updateField("currency", cur)}
                  className={`px-4 py-2 rounded border text-sm font-medium transition-all ${
                    formData.currency === cur
                      ? "text-white"
                      : "hover:bg-gray-50"
                  }`}
                  style={
                    formData.currency === cur
                      ? { background: "#0070F2", borderColor: "#0070F2" }
                      : { borderColor: "#D1D2D4", color: "#32363A" }
                  }
                >
                  {cur}
                </button>
              ))}
            </div>
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}

function FieldGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
