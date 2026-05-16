"use client";

import { useEffect } from "react";
import { useUserStore } from "@/hooks/use-current-user";

// Demo mode: set to true to bypass Supabase auth and use mock user
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder") ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("[YOUR") ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith("eyJ");

const MOCK_USER = {
  id: "demo-user-001",
  email: "owner@fms.co.id",
  name: "Admin Demo",
  role: "OWNER" as const,
  branchId: null,
  supabaseUserId: "demo-supabase-001",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    if (DEMO_MODE) {
      // In demo mode, immediately set mock user
      setUser(MOCK_USER);
      return;
    }

    // Production mode: use Supabase auth
    const initAuth = async () => {
      try {
        const { createBrowserSupabaseClient } = await import("@/lib/supabase/client");
        const supabase = createBrowserSupabaseClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }

        // Listen for auth state changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            const response = await fetch("/api/auth/me");
            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null);
          }
        });
      } catch {
        setUser(null);
      }
    };

    initAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
