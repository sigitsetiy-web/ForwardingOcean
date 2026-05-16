"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import type { ChatRoom } from "@/app/(dashboard)/chat/page";

interface Props { chat: ChatRoom; onClose: () => void; }

export function ChatContextPanel({ chat, onClose }: Props) {
  const [tab, setTab] = useState("info");
  const tabs = chat.type === "jo-thread" ? ["JO Info", "Members", "Files", "Pinned", "Log"] : ["Members", "Files", "Pinned"];

  return (
    <div className="w-[320px] flex-shrink-0 bg-white border-l flex flex-col h-full overflow-hidden" style={{ borderColor: "#D1D2D4" }}>
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b" style={{ borderColor: "#D1D2D4" }}>
        <p className="text-sm font-bold" style={{ color: "#003B62" }}>📋 Context Panel</p>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="h-4 w-4" style={{ color: "#6A6D70" }} /></button>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto" style={{ borderColor: "#D1D2D4" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t.toLowerCase().split(" ")[0])}
            className={`px-3 py-2 text-[10px] font-medium whitespace-nowrap border-b-2 ${tab === t.toLowerCase().split(" ")[0] ? "" : "border-transparent"}`}
            style={tab === t.toLowerCase().split(" ")[0] ? { borderColor: "#0070F2", color: "#0070F2" } : { color: "#6A6D70" }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === "jo" && chat.type === "jo-thread" && <JOInfoTab />}
        {tab === "members" && <MembersTab />}
        {tab === "files" && <FilesTab />}
        {tab === "pinned" && <PinnedTab />}
        {tab === "log" && <LogTab />}
      </div>
    </div>
  );
}

function JOInfoTab() {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg border" style={{ borderColor: "#D1D2D4" }}>
        <p className="text-xs font-bold" style={{ color: "#003B62" }}>⚙ JO-2025-0112</p>
        <p className="text-sm font-medium mt-1">PT Sritex (SRIL)</p>
        <span className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white inline-block mt-1" style={{ background: "#BB0000" }}>🔴 CRITICAL — Customs Hold</span>
        <div className="mt-3 space-y-1 text-xs" style={{ color: "#6A6D70" }}>
          <p>🇨🇳 Shanghai → 🇮🇩 Tanjung Emas</p>
          <p>🚢 Evergreen · EGHU1234567 (40&apos;HC)</p>
          <p>ETD: 01 May · ETA: 15 May</p>
          <p>👤 Officer: Sigit Hartono</p>
        </div>
        <div className="mt-3 flex gap-0.5">{["✅", "✅", "✅", "🔄", "⏳", "⏳", "⏳", "⏳"].map((s, i) => <span key={i} className="text-xs">{s}</span>)}</div>
        <button className="mt-3 flex items-center gap-1 text-[10px] font-medium" style={{ color: "#0070F2" }}>Open Full JO <ExternalLink className="h-3 w-3" /></button>
      </div>

      {/* Alerts */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase" style={{ color: "#6A6D70" }}>Alerts</p>
        <p className="text-[10px] px-2 py-1 rounded" style={{ background: "#FFF5F5", color: "#BB0000" }}>🔴 Jalur Merah — hari ke-4</p>
        <p className="text-[10px] px-2 py-1 rounded" style={{ background: "#FFF3E0", color: "#E9730C" }}>🟡 2 dokumen pending</p>
        <p className="text-[10px] px-2 py-1 rounded" style={{ background: "#FFF3E0", color: "#E9730C" }}>🟡 AP EMKL belum approve</p>
      </div>

      {/* Doc Links */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase" style={{ color: "#6A6D70" }}>Documents</p>
        <div className="flex flex-wrap gap-1">
          {["📄 QT-0047", "📋 SO-0089", "🧾 INV ×3", "📥 AP ×3", "🚛 Trucking"].map((d) => (
            <span key={d} className="text-[9px] px-2 py-0.5 rounded cursor-pointer hover:bg-blue-50" style={{ background: "#E8F0FE", color: "#0070F2" }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Deadlines */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase" style={{ color: "#6A6D70" }}>Deadlines</p>
        <div className="space-y-1 text-[10px]">
          <p className="px-2 py-1 rounded" style={{ background: "#FFF5F5" }}>⏰ SI Cut-off: <b>LEWAT 🔴</b></p>
          <p className="px-2 py-1 rounded" style={{ background: "#FFF5F5" }}>⏰ VGM Cut-off: <b>LEWAT 🔴</b></p>
          <p className="px-2 py-1 rounded" style={{ background: "#FFF3E0" }}>📅 ETA: <b>15 May 🟡</b></p>
          <p className="px-2 py-1 rounded" style={{ background: "#F0FFF4" }}>📅 Free Time: <b>3 hari 🟢</b></p>
        </div>
      </div>
    </div>
  );
}

function MembersTab() {
  const members = [
    { name: "Sigit Hartono", role: "Traffic Manager", status: "Online", color: "#107E3E" },
    { name: "Titi Rahayu", role: "Admin Ops", status: "Online", color: "#107E3E" },
    { name: "Zahid Maulana", role: "Traffic Officer", status: "Online", color: "#107E3E" },
    { name: "Asna Pratiwi", role: "Billing", status: "Away", color: "#E9730C" },
    { name: "Ima Safitri", role: "Finance", status: "Offline", color: "#D1D2D4" },
  ];
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase" style={{ color: "#6A6D70" }}>Participants ({members.length})</p>
      {members.map((m) => (
        <div key={m.name} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50">
          <div className="relative"><div className="h-7 w-7 rounded-full bg-[#0070F2] flex items-center justify-center text-[9px] font-bold text-white">{m.name.split(" ").map((n) => n[0]).join("")}</div><span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ background: m.color }} /></div>
          <div className="flex-1"><p className="text-xs font-medium" style={{ color: "#32363A" }}>{m.name}</p><p className="text-[10px]" style={{ color: "#6A6D70" }}>{m.role}</p></div>
        </div>
      ))}
      <button className="w-full text-[10px] font-medium py-1.5 rounded border border-dashed" style={{ borderColor: "#0070F2", color: "#0070F2" }}>+ Invite Member</button>
    </div>
  );
}

function FilesTab() {
  const files = [
    { name: "Packing_List_Sritex.pdf", by: "Titi", date: "12 May" },
    { name: "Commercial_Invoice.pdf", by: "Titi", date: "12 May" },
    { name: "Rate_Confirm_Evergreen.pdf", by: "Sigit", date: "10 May" },
    { name: "PIB_Draft.xlsx", by: "Zahid", date: "13 May" },
  ];
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase" style={{ color: "#6A6D70" }}>Shared Files ({files.length})</p>
      {files.map((f) => (
        <div key={f.name} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 border" style={{ borderColor: "#D1D2D4" }}>
          <span>📄</span>
          <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate" style={{ color: "#32363A" }}>{f.name}</p><p className="text-[10px]" style={{ color: "#6A6D70" }}>{f.by} · {f.date}</p></div>
        </div>
      ))}
    </div>
  );
}

function PinnedTab() {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase" style={{ color: "#6A6D70" }}>Pinned Messages</p>
      <div className="p-2 rounded border" style={{ borderColor: "#D1D2D4" }}>
        <p className="text-xs">📌 {`"Rate Evergreen: $850/FCL 20' valid s/d 30 May"`}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "#6A6D70" }}>— Sigit, 10 May</p>
      </div>
      <div className="p-2 rounded border" style={{ borderColor: "#D1D2D4" }}>
        <p className="text-xs">📌 {`"NPWP Sritex: 01.234.567.8-513.000"`}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "#6A6D70" }}>— Titi, 08 May</p>
      </div>
    </div>
  );
}

function LogTab() {
  const logs = [
    { time: "12 May 09:15", text: "Titi: Dokumen Sritex masuk (PLI + CI)" },
    { time: "12 May 10:30", text: "Zahid: Status → Customs In Process" },
    { time: "13 May 08:00", text: "Sigit: PIB sudah didaftarkan" },
    { time: "13 May 15:00", text: "System: Cut-off warning sent" },
  ];
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase" style={{ color: "#6A6D70" }}>🔗 Saved to JO Activity Log</p>
      {logs.map((l, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="mt-1 h-2 w-2 rounded-full shrink-0" style={{ background: "#0070F2" }} />
          <div><p className="text-xs" style={{ color: "#32363A" }}>{l.text}</p><p className="text-[10px]" style={{ color: "#6A6D70" }}>{l.time}</p></div>
        </div>
      ))}
      <div className="p-2 rounded text-[10px]" style={{ background: "#E8F0FE", color: "#0070F2" }}>
        ℹ Semua pesan yang di-tag ke JO-0112 tersimpan otomatis di Activity Log JO.
      </div>
    </div>
  );
}
