"use client";
import { useState } from "react";

interface Props { refQuotation: string; }

export function SOActivityLog({ refQuotation }: Props) {
  const [open, setOpen] = useState(false);
  const logs = [
    { date: "12 May 2025 09:15", text: "SO Created by Sigit Setiyanto" },
    { date: "12 May 2025 09:20", text: `Converted from Quotation ${refQuotation}` },
    { date: "12 May 2025 10:30", text: "Sent for approval to Budi Santoso" },
    { date: "12 May 2025 11:00", text: "Approved by Budi Santoso" },
    { date: "12 May 2025 11:05", text: "SO Confirmed, Status: CONFIRMED" },
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: "#D1D2D4" }}>
      <button onClick={() => setOpen(!open)} className="w-full px-5 py-3 flex items-center justify-between text-sm font-bold uppercase tracking-wide" style={{ color: "#003B62" }}>
        <span>🕐 Activity & Audit Trail</span>
        <span>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: "#D1D2D4" }}>
          <div className="mt-4 space-y-3">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0" style={{ background: "#0070F2" }} />
                <div>
                  <p className="text-sm" style={{ color: "#32363A" }}>{log.text}</p>
                  <p className="text-xs" style={{ color: "#6A6D70" }}>{log.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs font-medium" style={{ color: "#0070F2" }}>Show full history</button>
        </div>
      )}
    </div>
  );
}
