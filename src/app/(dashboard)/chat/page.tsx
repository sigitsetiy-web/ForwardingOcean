"use client";

import { useState } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { ChatContextPanel } from "@/components/chat/chat-context-panel";

export type ChatType = "jo-thread" | "dm" | "channel";
export interface ChatRoom {
  id: string;
  type: ChatType;
  name: string;
  subtitle?: string;
  unread?: number;
  urgent?: boolean;
  joId?: string;
  joStatus?: string;
  members?: string[];
}

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<ChatRoom>({
    id: "jo-0112",
    type: "jo-thread",
    name: "JO-0112 · PT Sritex",
    subtitle: "Import Shanghai → Semarang",
    joId: "JO-2025-0112",
    joStatus: "CUSTOMS IN PROCESS",
    members: ["Sigit H.", "Titi R.", "Zahid M.", "Asna P."],
  });
  const [showContext, setShowContext] = useState(true);

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-6 overflow-hidden" style={{ background: "#F0F2F5" }}>
      {/* Left Sidebar */}
      <ChatSidebar activeChat={activeChat} onSelectChat={setActiveChat} />

      {/* Center Chat Area */}
      <ChatArea chat={activeChat} onToggleContext={() => setShowContext(!showContext)} />

      {/* Right Context Panel */}
      {showContext && <ChatContextPanel chat={activeChat} onClose={() => setShowContext(false)} />}
    </div>
  );
}
