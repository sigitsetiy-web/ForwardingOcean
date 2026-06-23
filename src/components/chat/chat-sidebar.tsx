"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Edit, Plus, Hash, MessageCircle, Link2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

export interface ChatRoom {
  id: string;
  type: string;
  name: string;
  description?: string;
  jobOrderId?: string;
  members?: { userId: string; userName: string; role?: string }[];
  messages?: { content: string; senderName: string; createdAt: string }[];
  _count?: { messages: number };
  updatedAt?: string;
}

interface Props {
  activeChat: ChatRoom | null;
  onSelectChat: (chat: ChatRoom) => void;
}

export function ChatSidebar({ activeChat, onSelectChat }: Props) {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  // Fetch rooms from DB
  const { data: roomsData } = useQuery({
    queryKey: ["chat-rooms", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/chat/rooms?userId=" + user?.id);
      return res.json();
    },
    enabled: !!user?.id,
    refetchInterval: 10000,
  });

  // Create new room
  const createRoom = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "channel",
          name: "# " + name.toLowerCase().replace(/\s+/g, "-"),
          description: name,
          createdById: user?.id,
          members: [{ userId: user?.id, userName: user?.name }],
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      if (data?.data) onSelectChat(data.data);
      setShowNewRoom(false);
      setNewRoomName("");
    },
  });

  const rooms: ChatRoom[] = roomsData?.data || [];

  // Separate room types
  const channels = rooms.filter((r) => r.type === "channel");
  const joThreads = rooms.filter((r) => r.type === "jo-thread");
  const dms = rooms.filter((r) => r.type === "dm");

  // Filter by search
  const filterRoom = (r: ChatRoom) =>
    !search || r.name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="w-[260px] flex-shrink-0 flex flex-col h-full overflow-hidden" style={{ background: "#003B62" }}>
      {/* User */}
      <div className="p-3 flex items-center gap-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="h-8 w-8 rounded-full bg-[#0070F2] flex items-center justify-center text-white text-[10px] font-bold">
          {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-white truncate">{user?.name || "User"}</p>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: "#107E3E" }} />
            <span className="text-[10px] text-white/50">Online</span>
          </div>
        </div>
        <button onClick={() => setShowNewRoom(!showNewRoom)} className="p-1.5 rounded hover:bg-white/10">
          <Plus className="h-4 w-4 text-white/60" />
        </button>
      </div>

      {/* New Room Form */}
      {showNewRoom && (
        <div className="px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Nama channel baru..."
            className="w-full px-2 py-1.5 rounded text-xs bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none"
            onKeyDown={(e) => { if (e.key === "Enter" && newRoomName.trim()) createRoom.mutate(newRoomName.trim()); }}
          />
          <div className="flex gap-1 mt-1.5">
            <button onClick={() => { if (newRoomName.trim()) createRoom.mutate(newRoomName.trim()); }}
              className="flex-1 text-[10px] py-1 rounded bg-[#0070F2] text-white font-medium">Buat</button>
            <button onClick={() => setShowNewRoom(false)}
              className="flex-1 text-[10px] py-1 rounded bg-white/10 text-white/60">Batal</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari percakapan..."
            className="w-full pl-8 pr-3 py-1.5 rounded text-xs bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" />
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-3">
        {/* Channels */}
        {channels.filter(filterRoom).length > 0 && (
          <RoomSection
            title="CHANNELS"
            icon={<Hash className="h-3 w-3" />}
            rooms={channels.filter(filterRoom)}
            activeId={activeChat?.id}
            onSelect={onSelectChat}
          />
        )}

        {/* JO Threads */}
        {joThreads.filter(filterRoom).length > 0 && (
          <RoomSection
            title="JOB ORDER THREADS"
            icon={<Link2 className="h-3 w-3" />}
            rooms={joThreads.filter(filterRoom)}
            activeId={activeChat?.id}
            onSelect={onSelectChat}
          />
        )}

        {/* Direct Messages */}
        {dms.filter(filterRoom).length > 0 && (
          <RoomSection
            title="DIRECT MESSAGES"
            icon={<MessageCircle className="h-3 w-3" />}
            rooms={dms.filter(filterRoom)}
            activeId={activeChat?.id}
            onSelect={onSelectChat}
          />
        )}

        {/* Empty state */}
        {rooms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[11px] text-white/40">Belum ada percakapan</p>
            <p className="text-[10px] text-white/30 mt-1">Klik + untuk membuat channel baru</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RoomSection({ title, icon, rooms, activeId, onSelect }: {
  title: string;
  icon: React.ReactNode;
  rooms: ChatRoom[];
  activeId?: string;
  onSelect: (room: ChatRoom) => void;
}) {
  return (
    <div>
      <div className="px-2 py-1 flex items-center gap-1.5">
        <span className="text-white/30">{icon}</span>
        <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">{title}</p>
      </div>
      {rooms.map((room) => {
        const lastMsg = room.messages?.[0];
        const isActive = activeId === room.id;
        return (
          <button
            key={room.id}
            onClick={() => onSelect(room)}
            className={`w-full flex items-center gap-2 px-2 py-2 rounded text-left transition-all ${isActive ? "bg-white/15" : "hover:bg-white/5"}`}
          >
            <RoomIcon type={room.type} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white/90 truncate font-medium">{room.name}</p>
              {lastMsg && (
                <p className="text-[10px] text-white/40 truncate">
                  {lastMsg.senderName?.split(" ")[0]}: {lastMsg.content?.slice(0, 30)}
                </p>
              )}
            </div>
            {room._count && room._count.messages > 0 && !isActive && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold text-white bg-[#0070F2]">
                {room._count.messages > 99 ? "99+" : room._count.messages}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function RoomIcon({ type }: { type: string }) {
  if (type === "jo-thread") return <span className="text-[11px]">⚙️</span>;
  if (type === "dm") return <span className="text-[11px]">💬</span>;
  return <span className="text-[11px]">👥</span>;
}
