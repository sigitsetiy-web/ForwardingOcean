"use client";
import { Ship, Plane, Link2 } from "lucide-react";

interface Props { formData: Record<string, unknown>; updateField: (f: string, v: unknown) => void; }

const milestones = ["JO Created", "Booking", "Cargo Ready", "Customs", "Departed", "Arrived", "Delivered", "Closed"];
const statusColors: Record<string, string> = { OPEN: "#0070F2", "IN PROGRESS": "#E9730C", "CUSTOMS HOLD": "#BB0000", "DEPARTED": "#0D8A72", ARRIVED: "#7B2D8B", DELIVERED: "#107E3E", CLOSED: "#6A6D70", CANCELLED: "#BB0000" };

export function JOHeaderBanner({ formData, updateField }: Props) {
  const status = formData.status as string;
  const direction = formData.direction as string;
  const currentStep = 1; // JO Created

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: "#003B62", borderLeft: "4px solid #0070F2" }}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Left */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-white/10">
              {direction === "IMPORT" || direction === "EXPORT" ? <Ship className="h-6 w-6 text-white" /> : <Plane className="h-6 w-6 text-white" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">JOB ORDER</h1>
              <p className="text-white/70 font-mono text-sm mt-0.5">JO-2025-XXXX</p>
              <div className="flex items-center gap-3 mt-2">
                <div><label className="text-[10px] text-white/50">JO Date</label><input type="date" defaultValue="2025-05-12" className="block mt-0.5 px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-white" /></div>
                <div><label className="text-[10px] text-white/50">Status</label><div className="mt-0.5 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: statusColors[status] || "#0070F2" }}>{status}</div></div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="text-right space-y-1.5">
            <div className="flex items-center gap-2 justify-end text-xs text-white/60">
              <Link2 className="h-3 w-3" />Ref SO: <a href="#" className="font-mono text-white underline">{formData.refSO as string}</a>
            </div>
            <div className="flex items-center gap-2 justify-end text-xs text-white/60">
              <Link2 className="h-3 w-3" />Ref QT: <a href="#" className="font-mono text-white underline">{formData.refQT as string}</a>
            </div>
            <p className="text-xs text-white/70">{formData.customerName as string}</p>
            <div className="flex gap-2 justify-end mt-2">
              {["Normal", "Urgent", "Critical"].map((p) => (
                <button key={p} onClick={() => updateField("priority", p)} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${formData.priority === p ? "bg-white text-[#003B62]" : "border-white/30 text-white/70"}`}>{p}</button>
              ))}
            </div>
            <div className="mt-2 px-3 py-1 rounded text-xs font-bold inline-block" style={{ background: direction === "IMPORT" ? "#0070F2" : direction === "EXPORT" ? "#107E3E" : "#E9730C", color: "#fff" }}>{direction}</div>
          </div>
        </div>
      </div>

      {/* Milestone Strip */}
      <div className="px-6 py-3 flex items-center gap-1 overflow-x-auto" style={{ background: "rgba(0,0,0,0.2)" }}>
        {milestones.map((m, i) => (
          <div key={m} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${i < currentStep ? "bg-[#107E3E] text-white" : i === currentStep ? "bg-white text-[#003B62]" : "bg-white/10 text-white/50"}`}>
              <span className="h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: i < currentStep ? "#fff" : "transparent", color: i < currentStep ? "#107E3E" : "inherit" }}>{i + 1}</span>
              {m}
            </div>
            {i < milestones.length - 1 && <div className="w-4 h-px mx-0.5" style={{ background: i < currentStep ? "#107E3E" : "rgba(255,255,255,0.2)" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
