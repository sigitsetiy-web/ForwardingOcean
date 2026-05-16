"use client";

import { useState } from "react";
import { Search, Edit } from "lucide-react";
import type { ChatRoom } from "@/app/(dashboard)/chat/page";

interface Props { activeChat: ChatRoom; onSelectChat: (chat: ChatRoom) => void; }

const pinnedChats: ChatRoom[] = [
  { id: "jo-0112", type: "jo-thread", name: "JO-0112 · PT Sritex", subtitle: "Customs In Process", unread: 3, urgent: true, joId: "JO-2025-0112", joStatus: "CUSTOMS", members: ["Sigit", "Titi", "Zahid", "Asna"] },
  { id: "jo-0101", type: "jo-thread", name: "JO-0101 · PT Garuda", subtitle: "Customs Hold", unread: 1, urgent: true, joId: "JO-2025-0101", joStatus: "HOLD" },
];

const dmChats: ChatRoom[] = [
  { id: "dm-titi", type: "dm", name: "Titi Rahayu", subtitle: "Online", unread: 2 },
  { id: "dm-zahid", type: "dm", name: "Zahid Maulana", subtitle: "Online" },
  { id: "dm-asna", type: "dm", name: "Asna Pratiwi", subtitle: "Away", unread: 1 },
  { id: "dm-ima", type: "dm", name: "Ima Safitri", subtitle: "Offline" },
];

const channels: ChatRoom[] = [
  { id: "ch-general", type: "channel", name: "# general", unread: 5 },
  { id: "ch-ops-import", type: "channel", name: "# operasional-import" },
  { id: "ch-ops-export", type: "channel", name: "# operasional-export", unread: 2 },
  { id: "ch-customs", type: "channel", name: "# customs-clearance" },
  { id: "ch-trucking", type: "channel", name: "# trucking-armada" },
  { id: "ch-billing", type: "channel", name: "# keuangan-billing", unread: 3 },
  { id: "ch-sales", type: "channel", name: "# sales-marketing" },
  { id: "ch-mgmt", type: "channel", name: "# manajemen 🔒" },
];

const joThreads: ChatRoom[] = [
  { id: "jo-0112", type: "jo-thread", name: "JO-0112 · PT Sritex", unread: 5, urgent: true, joId: "JO-2025-0112", joStatus: "CUSTOMS" },
  { id: "jo-0108", type: "jo-thread", name: "JO-0108 · PT XYZ", unread: 2, joId: "JO-2025-0108" },
  { id: "jo-0101", type: "jo-thread", name: "JO-0101 · PT Garuda", unread: 1, urgent: true, joId: "JO-2025-0101" },
  { id: "jo-0098", type: "jo-thread", name: "JO-0098 · CV Fajar", joId: "JO-2025-0098" },
];

const statusColors: Record<string, string> = { Online: "#107E3E", Away: "#E9730C", Offline: "#D1D2D4" };

export function ChatSidebar({ activeChat, onSelectChat }: Props) {
  const [search, setSearch] = useState("");

  return (
    <div className="w-[260px] flex-shrink-0 flex flex-col h-full overflow-hidden" style={{ background: "#003B62" }}>
      {/* User */}
      <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="h-9 w-9 rounded-full bg-[#0070F2] flex items-center justify-center text-white text-xs font-bold">SH</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">Sigit H.</p>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "#107E3E" }} /><span className="text-[10px] text-white/50">Online</span></div>
        </div>
        <button className="p-1.5 rounded hover:bg-white/10"><Edit className="h-4 w-4 text-white/60" /></button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari percakapan..."
            className="w-full pl-8 pr-3 py-1.5 rounded text-xs bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" />
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">
        <Section title="📌 PINNED" items={pinnedChats} activeId={activeChat.id} onSelect={onSelectChat} />
        <Section title="💬 DIRECT MESSAGES" items={dmChats} activeId={activeChat.id} onSelect={onSelectChat} showStatus />
        <Section title="👥 CHANNELS" items={channels} activeId={activeChat.id} onSelect={onSelectChat} />
        <Section title="🔗 JOB ORDER THREADS" items={joThreads} activeId={activeChat.id} onSelect={onSelectChat} />
      </div>
    </div>
  );
}

function Section({ title, items, activeId, onSelect, showStatus }: { title: string; items: ChatRoom[]; activeId: string; onSelect: (c: ChatRoom) => void; showStatus?: boolean }) {
  return (
    <div>
      <p className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white/40">{title}</p>
      {items.map((item) => (
        <button key={item.id} onClick={() => onSelect(item)}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all ${activeId === item.id ? "bg-white/15" : "hover:bg-white/5"}`}>
          {showStatus && <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: statusColors[item.subtitle || "Offline"] }} />}
          {item.type === "jo-thread" && <span className="text-[10px]">⚙</span>}
          <span className="flex-1 text-xs text-white/80 truncate">{item.name}</span>
          {item.unread && item.unread > 0 && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold text-white ${item.urgent ? "bg-red-500" : "bg-[#0070F2]"}`}>{item.unread}</span>
          )}
        </button>
      ))}
    </div>
  );
}
