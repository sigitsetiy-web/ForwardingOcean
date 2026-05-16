"use client";

import { useState } from "react";
import { Search, Pin, Users, Link2, Paperclip, Smile, Send, AtSign, Hash } from "lucide-react";
import type { ChatRoom } from "@/app/(dashboard)/chat/page";

interface Props { chat: ChatRoom; onToggleContext: () => void; }

interface Message {
  id: string;
  sender: string;
  avatar: string;
  time: string;
  content: string;
  type: "text" | "jo-update" | "document" | "alert" | "milestone" | "system";
  isOwn?: boolean;
  reactions?: string[];
  joData?: Record<string, string>;
  files?: { name: string; size: string }[];
}

const messages: Message[] = [
  { id: "sys1", sender: "System", avatar: "🤖", time: "", content: "Thread JO-0112 dibuat oleh Sigit Hartono", type: "system" },
  { id: "sys2", sender: "System", avatar: "🤖", time: "", content: "SO-0089 dikonfirmasi → JO-0112 dibuat", type: "system" },
  { id: "m1", sender: "Titi Rahayu", avatar: "TR", time: "09:15", content: "Pak Sigit, dokumen dari PT Sritex sudah masuk. Packing list & Commercial Invoice sudah diterima.", type: "text", reactions: ["👍 2"] },
  { id: "m2", sender: "Sigit H.", avatar: "SH", time: "09:20", content: "Oke Titi, sudah koordinasi dengan EMKL? Cut-off PIB besok jam 15:00", type: "text", isOwn: true, reactions: ["👍 1"] },
  { id: "m3", sender: "Zahid Maulana", avatar: "ZM", time: "10:30", content: "Update status JO:", type: "jo-update", joData: { from: "Booking Confirmed", to: "Customs In Process", by: "Zahid Maulana", note: "PIB sudah didaftarkan di KPPBC Tanjung Emas" }, reactions: ["👍 3", "✅ 2"] },
  { id: "m4", sender: "Titi Rahayu", avatar: "TR", time: "11:00", content: "Ini dokumen dari customer:", type: "document", files: [{ name: "Packing_List_Sritex_May25.pdf", size: "245 KB" }, { name: "Commercial_Invoice_SHG.pdf", size: "189 KB" }], reactions: ["👍 2"] },
  { id: "m5", sender: "System Alert", avatar: "🤖", time: "12:00", content: "", type: "alert", joData: { title: "CUT-OFF WARNING", jo: "JO-2025-0112 · PT Sritex", si: "BESOK 13 May 09:00", vgm: "BESOK 13 May 12:00", action: "Sigit, Zahid" } },
  { id: "m6", sender: "Asna Pratiwi", avatar: "AP", time: "13:30", content: "Sudah Pak, EMKL Maju Jaya confirm siap daftar PIB jam 10:00 besok", type: "text" },
  { id: "m7", sender: "System", avatar: "🤖", time: "15:00", content: "", type: "milestone", joData: { title: "SPPB Terbit — Jalur Hijau", number: "000123/WBC/2025", note: "Kargo siap dikeluarkan dari pabean", by: "Zahid Maulana" } },
];

export function ChatArea({ chat, onToggleContext }: Props) {
  const [input, setInput] = useState("");

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between bg-white border-b" style={{ borderColor: "#D1D2D4" }}>
        <div className="flex items-center gap-3">
          <span className="text-lg">{chat.type === "jo-thread" ? "🔗" : chat.type === "dm" ? "💬" : "👥"}</span>
          <div>
            <p className="text-sm font-bold" style={{ color: "#32363A" }}>{chat.type === "jo-thread" ? `⚙ ${chat.name} · Import Shanghai` : chat.name}</p>
            {chat.members && <p className="text-[10px]" style={{ color: "#6A6D70" }}>{chat.members.join(", ")}</p>}
          </div>
          {chat.joStatus && <span className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white" style={{ background: "#E9730C" }}>🔄 {chat.joStatus}</span>}
        </div>
        <div className="flex items-center gap-1">
          <Btn icon={<Search className="h-4 w-4" />} /><Btn icon={<Pin className="h-4 w-4" />} /><Btn icon={<Users className="h-4 w-4" />} />
          <Btn icon={<Link2 className="h-4 w-4" />} onClick={onToggleContext} />
        </div>
      </div>

      {/* JO Context Banner */}
      {chat.type === "jo-thread" && (
        <div className="px-4 py-2 text-[10px] flex items-center gap-3 flex-wrap" style={{ background: "#E8F0FE", borderLeft: "4px solid #0070F2" }}>
          <span className="font-medium" style={{ color: "#0070F2" }}>🔗 Thread terhubung ke:</span>
          {["⚙ JO-0112", "PT Sritex", "Shanghai → Tanjung Emas", "🚢 Evergreen", "ETD: 01 May", "ETA: 15 May"].map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-white" style={{ color: "#32363A" }}>{t}</span>
          ))}
          <span className="px-1.5 py-0.5 rounded text-white" style={{ background: "#BB0000" }}>🔴 Jalur Merah</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Date separator */}
        <div className="flex items-center gap-3 py-2"><div className="flex-1 h-px" style={{ background: "#D1D2D4" }} /><span className="text-[10px] font-medium" style={{ color: "#6A6D70" }}>Senin, 12 Mei 2025</span><div className="flex-1 h-px" style={{ background: "#D1D2D4" }} /></div>

        {messages.map((msg) => {
          if (msg.type === "system") return <SystemMsg key={msg.id} text={msg.content} />;
          if (msg.type === "alert") return <AlertMsg key={msg.id} data={msg.joData!} />;
          if (msg.type === "milestone") return <MilestoneMsg key={msg.id} data={msg.joData!} />;
          return <ChatBubble key={msg.id} msg={msg} />;
        })}

        {/* Typing indicator */}
        <div className="flex items-center gap-2 px-2"><span className="text-xs italic" style={{ color: "#6A6D70" }}>Titi sedang mengetik...</span><span className="flex gap-0.5">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}</span></div>
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3" style={{ borderColor: "#D1D2D4" }}>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <div className="flex gap-1 mb-1.5">
              {["B", "I", "U"].map((f) => <button key={f} className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-gray-100" style={{ color: "#6A6D70" }}>{f}</button>)}
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2}
              placeholder={`💬 Pesan ke ${chat.name}...`}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none" style={{ borderColor: "#D1D2D4" }} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-1">
            <InputBtn icon={<Paperclip className="h-3.5 w-3.5" />} label="Attach" />
            <InputBtn icon={<Link2 className="h-3.5 w-3.5" />} label="Link JO" />
            <InputBtn icon={<AtSign className="h-3.5 w-3.5" />} label="Mention" />
            <InputBtn icon={<Hash className="h-3.5 w-3.5" />} label="Tag JO" />
            <InputBtn icon={<Smile className="h-3.5 w-3.5" />} label="Emoji" />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "#0070F2" }}>
            <Send className="h-4 w-4" />Send
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Message }) {
  const isOwn = msg.isOwn;
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && <div className="flex items-center gap-2 mb-0.5"><div className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#0070F2" }}>{msg.avatar}</div><span className="text-xs font-medium" style={{ color: "#32363A" }}>{msg.sender}</span><span className="text-[10px]" style={{ color: "#6A6D70" }}>{msg.time}</span></div>}
        <div className={`rounded-lg px-3 py-2 ${isOwn ? "ml-8" : "ml-8"}`} style={{ background: isOwn ? "#E8F0FE" : "#FFFFFF", border: isOwn ? "none" : "1px solid #D1D2D4" }}>
          {isOwn && <div className="flex items-center gap-2 mb-0.5 justify-end"><span className="text-[10px]" style={{ color: "#6A6D70" }}>{msg.time}</span><span className="text-xs font-medium" style={{ color: "#32363A" }}>{msg.sender}</span></div>}
          <p className="text-sm" style={{ color: "#32363A" }}>{msg.content}</p>
          {/* JO Update card */}
          {msg.type === "jo-update" && msg.joData && (
            <div className="mt-2 p-2.5 rounded border text-xs" style={{ borderColor: "#0070F2", background: "#F5F8FF" }}>
              <p className="font-bold" style={{ color: "#0070F2" }}>🔗 JO-2025-0112 STATUS UPDATE</p>
              <p className="mt-1">From: <b>{msg.joData.from}</b> → To: <b>{msg.joData.to}</b></p>
              <p>Note: {msg.joData.note}</p>
              <button className="mt-1 text-[10px] font-medium" style={{ color: "#0070F2" }}>View JO →</button>
            </div>
          )}
          {/* Document cards */}
          {msg.type === "document" && msg.files && (
            <div className="mt-2 space-y-1.5">
              {msg.files.map((f) => (
                <div key={f.name} className="flex items-center gap-2 p-2 rounded border" style={{ borderColor: "#D1D2D4", background: "#FAFBFC" }}>
                  <span className="text-lg">📄</span>
                  <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate" style={{ color: "#32363A" }}>{f.name}</p><p className="text-[10px]" style={{ color: "#6A6D70" }}>{f.size} · PDF</p></div>
                  <button className="text-[10px] px-2 py-0.5 rounded" style={{ color: "#0070F2" }}>Preview</button>
                  <button className="text-[10px] px-2 py-0.5 rounded" style={{ color: "#0070F2" }}>Save to JO</button>
                </div>
              ))}
            </div>
          )}
          {isOwn && <p className="text-[10px] text-right mt-0.5" style={{ color: "#6A6D70" }}>✓✓</p>}
        </div>
        {msg.reactions && <div className="flex gap-1 mt-0.5 ml-8">{msg.reactions.map((r) => <span key={r} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100">{r}</span>)}</div>}
      </div>
    </div>
  );
}

function SystemMsg({ text }: { text: string }) {
  return <p className="text-center text-[10px] py-1" style={{ color: "#6A6D70" }}>🔗 {text}</p>;
}

function AlertMsg({ data }: { data: Record<string, string> }) {
  return (
    <div className="mx-auto max-w-md p-3 rounded-lg border" style={{ borderColor: "#E9730C", background: "#FFF8F0" }}>
      <p className="text-xs font-bold" style={{ color: "#E9730C" }}>⚠️ {data.title}</p>
      <p className="text-xs mt-1">{data.jo}</p>
      <p className="text-xs">SI Cut-off: <b>{data.si}</b></p>
      <p className="text-xs">VGM Cut-off: <b>{data.vgm}</b></p>
      <p className="text-[10px] mt-1" style={{ color: "#6A6D70" }}>Action needed by: {data.action}</p>
      <div className="flex gap-2 mt-2">
        <button className="text-[10px] px-2 py-1 rounded text-white" style={{ background: "#0070F2" }}>View JO</button>
        <button className="text-[10px] px-2 py-1 rounded border" style={{ borderColor: "#D1D2D4" }}>Snooze 1hr</button>
      </div>
    </div>
  );
}

function MilestoneMsg({ data }: { data: Record<string, string> }) {
  return (
    <div className="mx-auto max-w-md p-3 rounded-lg border" style={{ borderColor: "#107E3E", background: "#F0FFF4" }}>
      <p className="text-xs font-bold" style={{ color: "#107E3E" }}>✅ MILESTONE ACHIEVED</p>
      <p className="text-xs mt-1 font-medium">🛃 {data.title}</p>
      <p className="text-xs">Nomor: {data.number}</p>
      <p className="text-xs">{data.note}</p>
      <p className="text-[10px] mt-1" style={{ color: "#6A6D70" }}>By: {data.by}</p>
      <div className="flex gap-2 mt-2">
        <button className="text-[10px] px-2 py-1 rounded text-white" style={{ background: "#0070F2" }}>View JO</button>
        <button className="text-[10px] px-2 py-1 rounded text-white" style={{ background: "#107E3E" }}>Create Trucking</button>
      </div>
    </div>
  );
}

function Btn({ icon, onClick }: { icon: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} className="p-2 rounded hover:bg-gray-100" style={{ color: "#6A6D70" }}>{icon}</button>;
}

function InputBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-[10px]" style={{ color: "#6A6D70" }} title={label}>{icon}</button>;
}
