import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
  hydrated: boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      hydrated: false,

      setToken: (token: string | null) => {
        set({ token, isAuthenticated: !!token });
      },

      logout: () => {
        set({ token: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("auth-storage");
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);
