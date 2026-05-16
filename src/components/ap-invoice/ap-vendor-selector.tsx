"use client";
import { Building2, Truck, Info } from "lucide-react";

interface Props { onSelect: (type: "external" | "internal") => void; }

export function APVendorSelector({ onSelect }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F6F7" }}>
      <div className="max-w-3xl w-full mx-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: "#003B62" }}>⚙️ Jenis Biaya — Pilih Sumber Pengeluaran</h1>
          <p className="text-sm mt-2" style={{ color: "#6A6D70" }}>Pilihan ini menentukan alur pencatatan biaya pada sistem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* External Vendor */}
          <button onClick={() => onSelect("external")} className="bg-white rounded-xl border-2 p-6 text-left hover:shadow-lg transition-all group" style={{ borderColor: "#D1D2D4" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0070F2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#D1D2D4"; }}>
            <div className="h-14 w-14 rounded-xl flex items-center justify-center mb-4" style={{ background: "#E8F4FD" }}>
              <Building2 className="h-7 w-7" style={{ color: "#0070F2" }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "#003B62" }}>🏢 VENDOR EKSTERNAL</h3>
            <p className="text-sm mb-3" style={{ color: "#6A6D70" }}>Biaya dari pihak ketiga — Shipping Line, EMKL, Trucking Vendor, Depo, Surveyor, dll</p>
            <div className="text-xs space-y-1" style={{ color: "#6A6D70" }}>
              <p><b>Flow:</b> JO → Vendor PO → AP Invoice → Payment</p>
              <p><b>Result:</b> Menciptakan Hutang Usaha (AP) ke Vendor</p>
            </div>
            <div className="mt-4 px-4 py-2 rounded-lg text-center text-sm font-medium" style={{ background: "#0070F2", color: "#fff" }}>SELECT — External Vendor</div>
          </button>

          {/* Internal Fleet */}
          <button onClick={() => onSelect("internal")} className="bg-white rounded-xl border-2 p-6 text-left hover:shadow-lg transition-all" style={{ borderColor: "#D1D2D4" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#E9730C"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#D1D2D4"; }}>
            <div className="h-14 w-14 rounded-xl flex items-center justify-center mb-4" style={{ background: "#FFF3E0" }}>
              <Truck className="h-7 w-7" style={{ color: "#E9730C" }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "#003B62" }}>🚛 ARMADA SENDIRI / INTERNAL</h3>
            <p className="text-sm mb-3" style={{ color: "#6A6D70" }}>Biaya operasional armada milik perusahaan — Driver, BBM, Tol, Maintenance</p>
            <div className="text-xs space-y-1" style={{ color: "#6A6D70" }}>
              <p><b>Flow:</b> JO → Internal Cost Entry → Fleet Module</p>
              <p><b>Result:</b> Biaya Internal — tidak ada AP, langsung ke Cost Center</p>
            </div>
            <div className="mt-4 px-4 py-2 rounded-lg text-center text-sm font-medium" style={{ background: "#E9730C", color: "#fff" }}>SELECT — Internal Fleet</div>
          </button>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-xs" style={{ background: "#FFF3E0", color: "#E9730C" }}>
          <Info className="h-4 w-4 shrink-0" />
          Pemilihan ini tidak dapat diubah setelah disimpan. Pastikan pilihan sesuai sebelum melanjutkan.
        </div>
      </div>
    </div>
  );
}
