"use client";
import { useState } from "react";

const logs = [
  { date: "12 May 2025 09:00", text: "JO Created from SO-2025-0001 by Sigit" },
  { date: "12 May 2025 09:30", text: "Booking submitted to Evergreen Shipping" },
  { date: "12 May 2025 14:00", text: "Booking Confirmed: EVGL-2025-88712" },
  { date: "13 May 2025 08:00", text: "Documents received from customer (Packing List, CI)" },
  { date: "14 May 2025 09:00", text: "PIB submitted to Customs — KPPBC Tanjung Emas" },
  { date: "14 May 2025 15:00", text: "Jalur Hijau — SPPB Terbit" },
  { date: "15 May 2025 07:00", text: "Cargo Gate-In confirmed" },
  { date: "16 May 2025 00:00", text: "Vessel Departed — ETD confirmed" },
];

export function JOActivityLog() {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #0070F2" }}>
      <button onClick={() => setOpen(!open)} className="w-full px-5 py-3 flex items-center justify-between text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
        <span>🕐 Activity & Audit Trail</span><span>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: "#D1D2D4" }}>
          <div className="mt-4 space-y-3">
            {logs.map((l, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0" style={{ background: "#0070F2" }} />
                <div><p className="text-sm" style={{ color: "#32363A" }}>{l.text}</p><p className="text-xs" style={{ color: "#6A6D70" }}>{l.date}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
