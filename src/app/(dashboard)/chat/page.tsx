"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ChatSidebar, ChatRoom } from "@/components/chat/chat-sidebar";
import { Search, Pin, Users, Send, X, Info } from "lucide-react";

export default function ChatPage() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-join general on first load
  useEffect(() => {
    if (user && !activeChat) {
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
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.data) setActiveChat(data.data);
        })
        .catch(() => {});
    }
  }, [user]);

  // Fetch messages for active room
  const { data: messagesData } = useQuery({
    queryKey: ["chat-messages", activeChat?.id],
    queryFn: async () => {
      if (!activeChat?.id) return { data: [] };
      const res = await fetch("/api/chat/messages?roomId=" + activeChat.id + "&limit=100");
      return res.json();
    },
    enabled: !!activeChat?.id,
    refetchInterval: 3000,
  });

  // Fetch room members
  const { data: membersData } = useQuery({
    queryKey: ["chat-members", activeChat?.id],
    queryFn: async () => {
      if (!activeChat?.id) return { data: [] };
      // Room data includes members
      const res = await fetch("/api/chat/rooms?userId=" + user?.id);
      const rooms = await res.json();
      const room = rooms?.data?.find((r: ChatRoom) => r.id === activeChat.id);
      return { members: room?.members || [] };
    },
    enabled: !!activeChat?.id && showMembers,
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: activeChat?.id,
          senderId: user?.id,
          senderName: user?.name,
          content,
          type: "text",
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", activeChat?.id] });
      setInput("");
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.data?.length]);

  const handleSend = () => {
    if (!input.trim() || !activeChat?.id) return;
    sendMutation.mutate(input.trim());
  };

  const messages = messagesData?.data || [];
  const members = membersData?.members || activeChat?.members || [];

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-6 overflow-hidden" style={{ background: "#F0F2F5" }}>
      {/* Left Sidebar */}
      <ChatSidebar activeChat={activeChat} onSelectChat={setActiveChat} />

      {/* Center Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="h-14 px-4 flex items-center justify-between bg-white border-b" style={{ borderColor: "#D1D2D4" }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {activeChat.type === "jo-thread" ? "⚙️" : activeChat.type === "dm" ? "💬" : "👥"}
                </span>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: "#32363A" }}>{activeChat.name}</p>
                  <p className="text-[10px]" style={{ color: "#6A6D70" }}>
                    {members.length > 0 ? members.length + " anggota" : activeChat.description || ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded hover:bg-gray-100" style={{ color: "#6A6D70" }}>
                  <Search className="h-4 w-4" />
                </button>
                <button
                  className={`p-2 rounded hover:bg-gray-100 ${showMembers ? "bg-blue-50" : ""}`}
                  style={{ color: showMembers ? "#0070F2" : "#6A6D70" }}
                  onClick={() => setShowMembers(!showMembers)}
                >
                  <Users className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-12 w-12 rounded-full bg-[#E8F0FE] flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">💬</span>
                    </div>
                    <p className="text-[13px] font-medium" style={{ color: "#32363A" }}>
                      Mulai percakapan di {activeChat.name}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: "#6A6D70" }}>
                      Pesan akan tersimpan dan bisa diakses seluruh anggota
                    </p>
                  </div>
                ) : (
                  messages.map((msg: Record<string, unknown>, idx: number) => {
                    const isOwn = msg.senderId === user?.id;
                    const isSystem = msg.type === "system";
                    const prevMsg = idx > 0 ? messages[idx - 1] : null;
                    const showAvatar = !isOwn && (!prevMsg || prevMsg.senderId !== msg.senderId);

                    if (isSystem) {
                      return (
                        <div key={msg.id as string} className="flex justify-center">
                          <span className="text-[10px] px-3 py-1 rounded-full" style={{ background: "#E8F0FE", color: "#0070F2" }}>
                            {msg.content as string}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id as string} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[65%] ${isOwn ? "" : "pl-8 relative"}`}>
                          {showAvatar && !isOwn && (
                            <div className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#0070F2] flex items-center justify-center text-[9px] font-bold text-white">
                              {(msg.senderName as string)?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                            </div>
                          )}
                          {showAvatar && !isOwn && (
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[11px] font-semibold" style={{ color: "#32363A" }}>{msg.senderName as string}</span>
                              <span className="text-[10px]" style={{ color: "#6A6D70" }}>
                                {new Date(msg.createdAt as string).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          )}
                          <div
                            className="rounded-lg px-3 py-2"
                            style={{
                              background: isOwn ? "#0070F2" : "#FFFFFF",
                              border: isOwn ? "none" : "1px solid #E5E7EB",
                            }}
                          >
                            <p className={`text-[13px] whitespace-pre-wrap ${isOwn ? "text-white" : ""}`} style={isOwn ? {} : { color: "#32363A" }}>
                              {msg.content as string}
                            </p>
                          </div>
                          {isOwn && (
                            <p className="text-[10px] text-right mt-0.5" style={{ color: "#6A6D70" }}>
                              {new Date(msg.createdAt as string).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Members Panel */}
              {showMembers && (
                <div className="w-[240px] bg-white border-l overflow-y-auto p-4" style={{ borderColor: "#D1D2D4" }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-bold uppercase" style={{ color: "#6A6D70" }}>
                      Anggota ({members.length})
                    </p>
                    <button onClick={() => setShowMembers(false)} className="p-1 rounded hover:bg-gray-100">
                      <X className="h-3.5 w-3.5" style={{ color: "#6A6D70" }} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {members.map((m: Record<string, unknown>) => (
                      <div key={m.userId as string} className="flex items-center gap-2 py-1.5">
                        <div className="h-7 w-7 rounded-full bg-[#0070F2] flex items-center justify-center text-[9px] font-bold text-white">
                          {(m.userName as string)?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium truncate" style={{ color: "#32363A" }}>{m.userName as string}</p>
                          <p className="text-[10px]" style={{ color: "#6A6D70" }}>{(m.role as string) || "member"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t px-4 py-3" style={{ borderColor: "#D1D2D4" }}>
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder={"Tulis pesan... (Enter untuk kirim)"}
                  className="flex-1 px-3 py-2.5 rounded-lg border text-[13px] resize-none focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none"
                  style={{ borderColor: "#D1D2D4", maxHeight: "100px" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sendMutation.isPending}
                  className="flex items-center justify-center h-10 w-10 rounded-lg text-white disabled:opacity-40 transition-opacity"
                  style={{ background: "#0070F2" }}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No chat selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-[#E8F0FE] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-[15px] font-medium" style={{ color: "#32363A" }}>KayOcean Chat</p>
              <p className="text-[13px] mt-1" style={{ color: "#6A6D70" }}>
                Pilih percakapan di sidebar untuk mulai
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
