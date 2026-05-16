"use client";

import { useEffect } from "react";
import { useUserStore } from "@/hooks/use-current-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    // Check localStorage for persisted user session
    try {
      const stored = localStorage.getItem("fms_user");
      if (stored) {
        const user = JSON.parse(stored);
        setUser(user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [setUser, setLoading]);

  return <>{children}</>;
}
