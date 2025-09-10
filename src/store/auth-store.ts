import { create } from "zustand";
import { api } from "@/api/axios";

type User = {
  id: string;
  name: string;
  username: string;
  iat: number;
  exp: number;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setAuthenticated: (value: boolean, user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setAuthenticated: (value: boolean, user: User | null) =>
    set({
      isAuthenticated: value,
      user,
      isLoading: false,
    }),

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/auth/me");
      set({
        isAuthenticated: true,
        user: response.data.user as User,
        isLoading: false,
      });
    } catch {
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ isAuthenticated: false, user: null });
    }
  },
}));
