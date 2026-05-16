"use client";
import { useState } from "react";

const logs = [
  { date: "12 May 2025 09:00", text: "Invoice created from JO-2025-0112 by Sigit" },
  { date: "12 May 2025 09:30", text: "Line items imported from JO charges" },
  { date: "12 May 2025 10:00", text: "Invoice saved as Draft" },
];

export function InvActivityLog() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4", borderLeft: "4px solid #107E3E" }}>
      <button onClick={() => setOpen(!open)} className="w-full px-5 py-3 flex items-center justify-between text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
        <span>🕐 Activity Log</span><span>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: "#D1D2D4" }}>
          <div className="mt-4 space-y-3">
            {logs.map((l, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0" style={{ background: "#107E3E" }} />
                <div><p className="text-sm" style={{ color: "#32363A" }}>{l.text}</p><p className="text-xs" style={{ color: "#6A6D70" }}>{l.date}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
