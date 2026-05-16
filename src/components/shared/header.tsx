"use client";

import { Bell, LogOut, User, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function Header() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  // Fetch notifications + pending approvals
  const { data: notifData } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      // Fetch both notifications and pending approvals count
      const [notifRes, approvalRes] = await Promise.all([
        fetch(`/api/notifications?userId=${user?.id}&limit=10`),
        fetch(`/api/approvals?status=PENDING`),
      ]);
      const notif = await notifRes.json();
      const approvals = await approvalRes.json();
      
      // Merge approval reminders into notifications
      const approvalNotifs = (approvals.data || []).map((a: Record<string, unknown>) => ({
        id: `approval-${a.id}`,
        title: "⏳ Approval Menunggu",
        message: `${a.entityType} ${(a.quotation as Record<string, unknown>)?.number || (a.jobOrder as Record<string, unknown>)?.number || ""} membutuhkan persetujuan Anda`,
        isRead: false,
        createdAt: a.createdAt,
      }));

      const allNotifs = [...approvalNotifs, ...(notif.data || [])];
      const unreadCount = (notif.unreadCount || 0) + approvalNotifs.length;

      return { data: allNotifs, unreadCount };
    },
    enabled: !!user?.id,
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, markAll: true }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifData?.unreadCount ?? 0;
  const notifications = notifData?.data ?? [];

  const handleLogout = async () => {
    localStorage.removeItem("fms_user");
    window.location.href = "/login";
  };

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 shadow-sm">
      {/* Breadcrumb area */}
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-[hsl(210,70%,28%)]">
          Forwarding Management System
        </h1>
      </div>

      {/* Center - Brand */}
      <div className="hidden md:flex items-center">
        <span className="text-sm font-medium" style={{ color: "#6A6D70" }}>Wasilah Digital Sistem</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Chat */}
        <a href="/chat" className="relative p-2 rounded-md hover:bg-gray-100">
          <MessageCircle className="h-5 w-5" style={{ color: "#6A6D70" }} />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            5
          </Badge>
        </a>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="font-medium text-sm">Notifikasi</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => markAllReadMutation.mutate()}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Tandai semua dibaca
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                Tidak ada notifikasi
              </div>
            ) : (
              <>
                {notifications.slice(0, 5).map((notif: Record<string, unknown>) => (
                  <DropdownMenuItem
                    key={notif.id as string}
                    className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                    onClick={() => {
                      if ((notif.id as string).startsWith("approval-")) {
                        window.location.href = "/approvals";
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="font-medium text-sm flex-1">
                        {notif.title as string}
                      </span>
                      {!notif.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {notif.message as string}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notif.createdAt as string).toLocaleString("id-ID")}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-xs text-primary cursor-pointer" onClick={() => { window.location.href = "/approvals"; }}>
                  Lihat semua approval →
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {user && (
                <span className="text-sm font-medium hidden md:inline">
                  {user.name}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
