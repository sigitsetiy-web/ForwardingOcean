"use client";

import { create } from "zustand";
import { CurrentUser } from "@/types";

interface UserStore {
  user: CurrentUser | null;
  isLoading: boolean;
  setUser: (user: CurrentUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isLoading: false }),
}));

/**
 * Hook to get current authenticated user with role and branch info
 */
export function useCurrentUser() {
  const { user, isLoading } = useUserStore();
  return { user, isLoading };
}
