"use client";

interface Props { onSelectJO: (id: string) => void; }

const jos = [
  { id: "jo-0112", number: "JO-0112", customer: "PT Sritex", officer: "Sigit", priority: "critical", milestones: [{ label: "BKG", day: 5, done: true }, { label: "STUFF", day: 8, done: true }, { label: "PIB", day: 10, done: true }, { label: "MERAH⚠️", day: 12, done: false, delayed: true }, { label: "ETA", day: 15, done: false }, { label: "DEL", day: 17, done: false }] },
  { id: "jo-0108", number: "JO-0108", customer: "PT XYZ", officer: "Titi", priority: "urgent", milestones: [{ label: "BKG", day: 8, done: true }, { label: "STUFF", day: 9, done: true }, { label: "PIB", day: 10, done: true }, { label: "SPPB✅", day: 12, done: true }, { label: "TRK", day: 13, done: false }, { label: "DEL", day: 14, done: false }] },
  { id: "jo-0105", number: "JO-0105", customer: "CV Sentosa", officer: "Asna", priority: "normal", milestones: [{ label: "BKG", day: 3, done: true }, { label: "ETD🚢", day: 10, done: true }, { label: "ETA", day: 20, done: false }, { label: "DEL", day: 22, done: false }] },
  { id: "jo-0101", number: "JO-0101", customer: "PT Garuda", officer: "Ima", priority: "critical", milestones: [{ label: "BKG", day: 3, done: true }, { label: "ETD", day: 7, done: true }, { label: "MERAH⚠️", day: 8, done: false, delayed: true }] },
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const today = 16;
const priorityColors: Record<string, string> = { critical: "#BB0000", urgent: "#E9730C", normal: "#107E3E" };

export function CCTimelineView({ onSelectJO }: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden" style={{ borderColor: "#D1D2D4" }}>
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between border-b" style={{ borderColor: "#D1D2D4", background: "#F5F6F7" }}>
        <div className="flex gap-2">
          {["Day", "Week", "Month"].map((z) => (
            <button key={z} className={`px-3 py-1 rounded text-xs font-medium ${z === "Day" ? "text-white" : ""}`}
              style={z === "Day" ? { background: "#0070F2" } : { color: "#6A6D70" }}>{z}</button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: "#6A6D70" }}>
          <span>May 2025</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1"><span className="h-2 w-6 rounded bg-[#0070F2]" />Completed</span>
            <span className="flex items-center gap-1"><span className="h-2 w-6 rounded bg-[#E9730C]" />In Progress</span>
            <span className="flex items-center gap-1"><span className="h-2 w-6 rounded bg-gray-300" />Planned</span>
            <span className="flex items-center gap-1"><span className="h-2 w-6 rounded bg-[#BB0000]" />Delayed</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Panel */}
        <div className="w-48 flex-shrink-0 border-r" style={{ borderColor: "#D1D2D4" }}>
          <div className="h-8 border-b px-3 flex items-center text-[10px] font-bold" style={{ borderColor: "#D1D2D4", color: "#6A6D70" }}>JO / Customer</div>
          {jos.map((jo) => (
            <div key={jo.id} onClick={() => onSelectJO(jo.id)}
              className="h-14 px-3 flex items-center border-b cursor-pointer hover:bg-blue-50" style={{ borderColor: "#D1D2D4" }}>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: priorityColors[jo.priority] }} />
                  <span className="text-xs font-bold font-mono" style={{ color: "#32363A" }}>{jo.number}</span>
                </div>
                <p className="text-[10px] ml-3.5" style={{ color: "#6A6D70" }}>{jo.customer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Gantt Area */}
        <div className="flex-1 overflow-x-auto">
          {/* Day headers */}
          <div className="flex h-8 border-b" style={{ borderColor: "#D1D2D4" }}>
            {days.map((d) => (
              <div key={d} className={`w-8 flex-shrink-0 flex items-center justify-center text-[9px] font-medium ${d === today ? "text-white" : ""}`}
                style={d === today ? { background: "#BB0000" } : { color: "#6A6D70" }}>{d}</div>
            ))}
          </div>
          {/* Rows */}
          {jos.map((jo) => (
            <div key={jo.id} className="flex h-14 border-b relative" style={{ borderColor: "#D1D2D4" }}>
              {/* Today line */}
              <div className="absolute top-0 bottom-0 w-px" style={{ left: `${(today - 1) * 32 + 16}px`, background: "#BB0000", zIndex: 5 }} />
              {/* Milestones */}
              {jo.milestones.map((m, i) => {
                const left = (m.day - 1) * 32;
                const nextM = jo.milestones[i + 1];
                const width = nextM ? (nextM.day - m.day) * 32 : 32;
                return (
                  <div key={i} className="absolute top-4 h-6 flex items-center" style={{ left: `${left}px` }}>
                    {/* Bar */}
                    <div className="h-4 rounded-sm flex items-center px-1" style={{
                      width: `${width}px`,
                      background: m.delayed ? "#BB0000" : m.done ? "#0070F2" : "#E0E0E0",
                      opacity: m.delayed ? 0.8 : 1,
                    }}>
                      <span className="text-[8px] font-medium text-white truncate">{m.label}</span>
                    </div>
                    {/* Diamond milestone marker */}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rotate-45" style={{ background: m.done ? "#0070F2" : m.delayed ? "#BB0000" : "#D1D2D4" }} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
