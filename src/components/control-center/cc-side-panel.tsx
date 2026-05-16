"use client";
import { X, ExternalLink } from "lucide-react";

interface Props { joId: string; onClose: () => void; }

export function CCSidePanel({ joId, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-[480px] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-5 py-3 flex items-center justify-between z-10" style={{ borderColor: "#D1D2D4" }}>
          <div>
            <h2 className="text-sm font-bold" style={{ color: "#003B62" }}>⚙️ JO-2025-0112</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white" style={{ background: "#E9730C" }}>CUSTOMS</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white" style={{ background: "#BB0000" }}>CRITICAL</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs px-2 py-1 rounded border flex items-center gap-1" style={{ borderColor: "#0070F2", color: "#0070F2" }}>Open Full <ExternalLink className="h-3 w-3" /></button>
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="h-5 w-5" style={{ color: "#6A6D70" }} /></button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Overview */}
          <Section title="Overview">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Info label="Customer" value="PT Sritex (SRIL)" />
              <Info label="Route" value="🇨🇳 Shanghai → 🇮🇩 Tanjung Emas" />
              <Info label="Carrier" value="Evergreen Shipping" />
              <Info label="Vessel" value="Ever Given / 0112W" />
              <Info label="Container" value="EGHU1234567 (40'HC)" />
              <Info label="ETD / ETA" value="01 May / 15 May" />
              <Info label="Officer" value="Sigit Hartono" />
              <Info label="Commodity" value="Grey Fabric" />
            </div>
          </Section>

          {/* Milestone */}
          <Section title="Status Milestones">
            <div className="flex flex-wrap gap-1">
              {["✅ Created", "✅ Booking", "✅ Cargo Ready", "🔄 Customs", "⏳ Departed", "⏳ Arrived", "⏳ Closed"].map((m) => (
                <span key={m} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: m.startsWith("✅") ? "#E6F4EA" : m.startsWith("🔄") ? "#FFF3E0" : "#F5F6F7", color: m.startsWith("✅") ? "#107E3E" : m.startsWith("🔄") ? "#E9730C" : "#6A6D70" }}>{m}</span>
              ))}
            </div>
          </Section>

          {/* Alerts */}
          <Section title="Alerts">
            <div className="space-y-1.5">
              <p className="text-[10px] px-2 py-1 rounded" style={{ background: "#FFF5F5", color: "#BB0000" }}>🔴 Customs Hold — Jalur Merah sejak 12 May</p>
              <p className="text-[10px] px-2 py-1 rounded" style={{ background: "#FFF3E0", color: "#E9730C" }}>🟡 2 dokumen belum diterima</p>
              <p className="text-[10px] px-2 py-1 rounded" style={{ background: "#FFF3E0", color: "#E9730C" }}>🟡 AP EMKL belum dibayar (due: 20 May)</p>
            </div>
          </Section>

          {/* Financial */}
          <Section title="Financial Summary">
            <div className="p-3 rounded-lg" style={{ background: "#F5F6F7" }}>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><p style={{ color: "#6A6D70" }}>Revenue</p><p className="font-bold font-mono">Rp 45.400.000</p></div>
                <div><p style={{ color: "#6A6D70" }}>Cost</p><p className="font-bold font-mono">Rp 38.000.000</p></div>
                <div><p style={{ color: "#6A6D70" }}>Profit</p><p className="font-bold font-mono" style={{ color: "#107E3E" }}>Rp 7.400.000</p></div>
                <div><p style={{ color: "#6A6D70" }}>Margin</p><p className="font-bold" style={{ color: "#107E3E" }}>16.3%</p></div>
                <div><p style={{ color: "#6A6D70" }}>AR Outstanding</p><p className="font-bold font-mono" style={{ color: "#E9730C" }}>Rp 10.400.000</p></div>
                <div><p style={{ color: "#6A6D70" }}>AP Outstanding</p><p className="font-bold font-mono" style={{ color: "#BB0000" }}>Rp 7.300.000</p></div>
              </div>
            </div>
          </Section>

          {/* Documents */}
          <Section title="Document Chain">
            <div className="space-y-1.5 text-xs">
              {[
                { icon: "📄", code: "QT-2025-0047", label: "Quotation", status: "✅ Approved" },
                { icon: "📋", code: "SO-2025-0089", label: "Sales Order", status: "✅ Confirmed" },
                { icon: "⚙️", code: "JO-2025-0112", label: "Job Order", status: "🔄 Active" },
                { icon: "🧾", code: "INV-0120", label: "Invoice PT Sritex", status: "✅ Paid" },
                { icon: "🧾", code: "INV-0121", label: "Invoice Shanghai", status: "⏳ Draft" },
                { icon: "📥", code: "AP-001", label: "Evergreen", status: "✅ Paid" },
                { icon: "📥", code: "AP-002", label: "EMKL Maju", status: "⏳ Pending" },
              ].map((d) => (
                <div key={d.code} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-blue-50 cursor-pointer" style={{ background: "#FAFBFC" }}>
                  <span>{d.icon} <span className="font-mono font-medium">{d.code}</span> <span style={{ color: "#6A6D70" }}>— {d.label}</span></span>
                  <span className="text-[9px]">{d.status}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {["Update Status", "Add Note", "Create Invoice", "Create AP"].map((a) => (
              <button key={a} className="px-3 py-1.5 rounded text-xs font-medium border" style={{ borderColor: "#0070F2", color: "#0070F2" }}>{a}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (<div><h3 className="text-xs font-bold uppercase mb-2" style={{ color: "#003B62" }}>{title}</h3>{children}</div>);
}

function Info({ label, value }: { label: string; value: string }) {
  return (<div><p className="text-[10px]" style={{ color: "#6A6D70" }}>{label}</p><p className="font-medium" style={{ color: "#32363A" }}>{value}</p></div>);
}
