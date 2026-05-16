"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatContextPanel } from "@/components/chat/chat-context-panel";
import { Search, Pin, Users, Link2, Paperclip, Smile, Send, AtSign, Hash } from "lucide-react";

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
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState<ChatRoom>({
    id: "general",
    type: "channel",
    name: "# general",
    members: ["Sigit H.", "Titi R.", "Zahid M.", "Asna P.", "Ima S."],
  });
  const [showContext, setShowContext] = useState(true);
  const [input, setInput] = useState("");

  // Ensure default room exists
  useEffect(() => {
    if (user) {
      fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "channel",
          name: "# general",
          description: "Channel umum untuk semua tim",
          createdById: user.id,
          members: [{ userId: user.id, userName: user.name }],
        }),
      }).catch(() => {});
    }
  }, [user]);

  // Fetch messages
  const { data: messagesData } = useQuery({
    queryKey: ["chat-messages", activeChat.id],
    queryFn: async () => {
      const res = await fetch(`/api/chat/messages?roomId=${activeChat.id}&limit=50`);
      return res.json();
    },
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });

  // Send message
  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: activeChat.id,
          senderId: user?.id || "demo-user-001",
          senderName: user?.name || "Admin Demo",
          content,
          type: "text",
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", activeChat.id] });
      setInput("");
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    sendMutation.mutate(input.trim());
  };

  const messages = messagesData?.data || [];

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-6 overflow-hidden" style={{ background: "#F0F2F5" }}>
      {/* Left Sidebar */}
      <ChatSidebar activeChat={activeChat} onSelectChat={setActiveChat} />

      {/* Center Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between bg-white border-b" style={{ borderColor: "#D1D2D4" }}>
          <div className="flex items-center gap-3">
            <span className="text-lg">{activeChat.type === "jo-thread" ? "🔗" : activeChat.type === "dm" ? "💬" : "👥"}</span>
            <div>
              <p className="text-sm font-bold" style={{ color: "#32363A" }}>{activeChat.name}</p>
              {activeChat.members && <p className="text-[10px]" style={{ color: "#6A6D70" }}>{activeChat.members.join(", ")}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded hover:bg-gray-100" style={{ color: "#6A6D70" }}><Search className="h-4 w-4" /></button>
            <button className="p-2 rounded hover:bg-gray-100" style={{ color: "#6A6D70" }}><Pin className="h-4 w-4" /></button>
            <button className="p-2 rounded hover:bg-gray-100" style={{ color: "#6A6D70" }} onClick={() => setShowContext(!showContext)}><Users className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: "#6A6D70" }}>Belum ada pesan. Mulai percakapan!</p>
            </div>
          ) : (
            messages.map((msg: Record<string, unknown>) => {
              const isOwn = msg.senderId === (user?.id || "demo-user-001");
              return (
                <div key={msg.id as string} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[70%]">
                    {!isOwn && (
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#0070F2" }}>
                          {(msg.senderName as string).split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-xs font-medium" style={{ color: "#32363A" }}>{msg.senderName as string}</span>
                        <span className="text-[10px]" style={{ color: "#6A6D70" }}>{new Date(msg.createdAt as string).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    )}
                    <div className={`rounded-lg px-3 py-2 ${isOwn ? "ml-8" : "ml-8"}`} style={{ background: isOwn ? "#E8F0FE" : "#FFFFFF", border: isOwn ? "none" : "1px solid #D1D2D4" }}>
                      {isOwn && (
                        <div className="flex items-center gap-2 mb-0.5 justify-end">
                          <span className="text-[10px]" style={{ color: "#6A6D70" }}>{new Date(msg.createdAt as string).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap" style={{ color: "#32363A" }}>{msg.content as string}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="bg-white border-t px-4 py-3" style={{ borderColor: "#D1D2D4" }}>
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              rows={2}
              placeholder={`💬 Pesan ke ${activeChat.name}... (Enter untuk kirim)`}
              className="flex-1 px-3 py-2 rounded-lg border text-sm resize-none focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none"
              style={{ borderColor: "#D1D2D4" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sendMutation.isPending}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
              style={{ background: "#0070F2" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Context Panel */}
      {showContext && <ChatContextPanel chat={activeChat} onClose={() => setShowContext(false)} />}
    </div>
  );
}
