"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getModuleByPath,
  getViewFromPath,
  type WorkspaceModule,
} from "@/lib/workspace-modules";

export interface WorkspaceTab {
  id: string;
  label: string;
  listHref: string;
  newHref?: string;
}

interface WorkspaceTabsContextValue {
  tabs: WorkspaceTab[];
  activeTabId: string | null;
  activeView: "list" | "new";
  activeModule: WorkspaceModule | null;
  openTab: (module: WorkspaceModule, view?: "list" | "new") => void;
  closeTab: (id: string) => void;
  switchTab: (id: string) => void;
  switchView: (view: "list" | "new") => void;
}

const WorkspaceTabsContext = createContext<WorkspaceTabsContextValue | null>(null);

const TABS_KEY = "fms_workspace_tabs";
const ACTIVE_KEY = "fms_workspace_active";

function moduleToTab(module: WorkspaceModule): WorkspaceTab {
  return {
    id: module.id,
    label: module.label,
    listHref: module.listHref,
    newHref: module.newHref,
  };
}

export function WorkspaceTabsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [tabs, setTabs] = useState<WorkspaceTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const activeModule = activeTabId ? getModuleByPath(activeTabId) : null;
  const activeView =
    activeModule && pathname
      ? getViewFromPath(pathname, activeModule)
      : "list";

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(TABS_KEY);
      const savedActive = sessionStorage.getItem(ACTIVE_KEY);
      if (saved) setTabs(JSON.parse(saved));
      if (savedActive) setActiveTabId(savedActive);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(TABS_KEY, JSON.stringify(tabs));
    if (activeTabId) sessionStorage.setItem(ACTIVE_KEY, activeTabId);
  }, [tabs, activeTabId, hydrated]);

  const openTab = useCallback(
    (module: WorkspaceModule, view: "list" | "new" = "list") => {
      const tab = moduleToTab(module);
      setTabs((prev) => {
        if (prev.some((t) => t.id === tab.id)) return prev;
        return [...prev, tab];
      });
      setActiveTabId(tab.id);
      const target = view === "new" && module.newHref ? module.newHref : module.listHref;
      router.push(target);
    },
    [router]
  );

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const next = prev.filter((t) => t.id !== id);
        setActiveTabId((currentActive) => {
          if (currentActive !== id) return currentActive;
          const fallback = next[next.length - 1];
          if (fallback) {
            router.push(fallback.listHref);
            return fallback.id;
          }
          router.push("/dashboard");
          return null;
        });
        return next;
      });
    },
    [router]
  );

  const switchTab = useCallback(
    (id: string) => {
      const tab = tabs.find((t) => t.id === id);
      if (!tab) return;
      setActiveTabId(id);
      router.push(tab.listHref);
    },
    [tabs, router]
  );

  const switchView = useCallback(
    (view: "list" | "new") => {
      if (!activeTabId) return;
      const tab = tabs.find((t) => t.id === activeTabId);
      if (!tab) return;
      const target = view === "new" && tab.newHref ? tab.newHref : tab.listHref;
      router.push(target);
    },
    [activeTabId, tabs, router]
  );

  // Sinkronkan tab dari URL saat navigasi langsung
  useEffect(() => {
    if (!pathname || !hydrated) return;
    const module = getModuleByPath(pathname);
    if (!module) return;

    const tab = moduleToTab(module);
    setTabs((prev) => {
      if (prev.some((t) => t.id === tab.id)) return prev;
      return [...prev, tab];
    });
    setActiveTabId(tab.id);
  }, [pathname, hydrated]);

  return (
    <WorkspaceTabsContext.Provider
      value={{
        tabs,
        activeTabId,
        activeView,
        activeModule,
        openTab,
        closeTab,
        switchTab,
        switchView,
      }}
    >
      {children}
    </WorkspaceTabsContext.Provider>
  );
}

export function useWorkspaceTabs() {
  const ctx = useContext(WorkspaceTabsContext);
  if (!ctx) {
    throw new Error("useWorkspaceTabs must be used within WorkspaceTabsProvider");
  }
  return ctx;
}
