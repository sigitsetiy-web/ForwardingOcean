"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";
import { WorkspaceTabBar } from "@/components/shared/workspace-tab-bar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { WorkspaceTabsProvider } from "@/hooks/use-workspace-tabs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: "#F5F6F7" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto" style={{ borderColor: "#0070F2" }}></div>
          <p className="text-sm mt-3" style={{ color: "#6A6D70" }}>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
        <Header />
        <WorkspaceTabBar />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "#F5F6F7" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <WorkspaceTabsProvider>
        <DashboardShell>{children}</DashboardShell>
      </WorkspaceTabsProvider>
    </SidebarProvider>
  );
}
