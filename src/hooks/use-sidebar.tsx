"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface SidebarContextValue {
  isOpen: boolean;
  isPinned: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  togglePin: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const PINNED_KEY = "fms_sidebar_pinned";

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isPinned, setIsPinned] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const pinned = localStorage.getItem(PINNED_KEY) === "true";
    setIsPinned(pinned);
    setIsOpen(pinned);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PINNED_KEY, String(isPinned));
  }, [isPinned, hydrated]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    if (!isPinned) setIsOpen(false);
  }, [isPinned]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) setIsPinned(false);
      return next;
    });
  }, []);

  const togglePin = useCallback(() => {
    setIsPinned((prev) => {
      const next = !prev;
      setIsOpen(next ? true : false);
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isOpen, isPinned, open, close, toggle, togglePin }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
}
