"use client";

interface Props {
  formData: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
}

const serviceOptions = ["Sea Freight", "Air Freight", "Custom Clearance", "Trucking", "Warehousing", "Door-to-Door"];
const containerOptions = ["20'", "40'", "40'HC", "45'"];

export function ShipmentSection({ formData, updateField }: Props) {
  const serviceTypes = (formData.serviceTypes as string[]) || [];
  const containerSizes = (formData.containerSizes as string[]) || [];

  const toggleService = (service: string) => {
    const updated = serviceTypes.includes(service)
      ? serviceTypes.filter((s) => s !== service)
      : [...serviceTypes, service];
    updateField("serviceTypes", updated);
  };

  const toggleContainer = (size: string) => {
    const updated = containerSizes.includes(size)
      ? containerSizes.filter((s) => s !== size)
      : [...containerSizes, size];
    updateField("containerSizes", updated);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "#D1D2D4" }}>
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
          Shipment & Service Scope
        </h3>
      </div>
      <div className="p-5 space-y-4">
        {/* Service Type Chips */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: "#32363A" }}>
            Service Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {serviceOptions.map((service) => (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  serviceTypes.includes(service) ? "text-white" : "hover:bg-gray-50"
                }`}
                style={
                  serviceTypes.includes(service)
                    ? { background: "#0070F2", borderColor: "#0070F2" }
                    : { borderColor: "#D1D2D4", color: "#32363A" }
                }
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FieldGroup label="Incoterms">
            <select
              value={formData.incoterms as string}
              onChange={(e) => updateField("incoterms", e.target.value)}
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            >
              <option value="">-- Select --</option>
              {["EXW", "FOB", "CIF", "CFR", "DAP", "DDP"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup label="Port of Loading">
            <input
              value={formData.pol as string}
              onChange={(e) => updateField("pol", e.target.value)}
              placeholder="🚢 e.g., IDSMG - Semarang"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>

          <FieldGroup label="Port of Discharge">
            <input
              value={formData.pod as string}
              onChange={(e) => updateField("pod", e.target.value)}
              placeholder="🚢 e.g., CNSHA - Shanghai"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>

          <FieldGroup label="Commodity / Goods Description" className="md:col-span-3">
            <textarea
              rows={2}
              value={formData.commodity as string}
              onChange={(e) => updateField("commodity", e.target.value)}
              placeholder="Deskripsi barang yang akan dikirim"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none resize-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>

          {/* Cargo Type */}
          <FieldGroup label="Cargo Type">
            <div className="flex gap-3">
              {["FCL", "LCL", "Bulk"].map((type) => (
                <label key={type} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="cargoType"
                    checked={formData.cargoType === type}
                    onChange={() => updateField("cargoType", type)}
                    className="accent-[#0070F2]"
                  />
                  {type}
                </label>
              ))}
            </div>
          </FieldGroup>

          {/* Container Size */}
          <FieldGroup label="Container Size">
            <div className="flex gap-2">
              {containerOptions.map((size) => (
                <label key={size} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={containerSizes.includes(size)}
                    onChange={() => toggleContainer(size)}
                    className="accent-[#0070F2] rounded"
                  />
                  {size}
                </label>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup label="Est. Weight">
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.estWeight as string}
                onChange={(e) => updateField("estWeight", e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
                style={{ borderColor: "#D1D2D4" }}
              />
              <select
                value={formData.weightUnit as string}
                onChange={(e) => updateField("weightUnit", e.target.value)}
                className="px-2 py-2 rounded border text-sm"
                style={{ borderColor: "#D1D2D4" }}
              >
                <option value="KG">KG</option>
                <option value="CBM">CBM</option>
                <option value="TON">TON</option>
              </select>
            </div>
          </FieldGroup>

          <FieldGroup label="Est. Quantity">
            <input
              type="number"
              value={formData.estQty as string}
              onChange={(e) => updateField("estQty", e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
          </FieldGroup>

          {/* Toggles */}
          <FieldGroup label="Dangerous Goods?">
            <ToggleSwitch
              checked={formData.dangerousGoods as boolean}
              onChange={(v) => updateField("dangerousGoods", v)}
            />
          </FieldGroup>

          <FieldGroup label="Insurance Required?">
            <ToggleSwitch
              checked={formData.insuranceRequired as boolean}
              onChange={(v) => updateField("insuranceRequired", v)}
            />
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}

function FieldGroup({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium mb-1" style={{ color: "#32363A" }}>{label}</label>
      {children}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "" : "bg-gray-300"}`}
      style={checked ? { background: "#0070F2" } : undefined}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}
