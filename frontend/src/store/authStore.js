import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "@api/auth.api";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { user, accessToken, refreshToken } = response.data;

          // Store in localStorage for persistence
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("user", JSON.stringify(user));

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          return response;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Clear everything
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      // Get current user
      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.getCurrentUser();
          set({
            user: response.data,
            isLoading: false,
          });
          return response;
        } catch (error) {
          set({ isLoading: false });
          // If token is invalid, logout
          if (error.response?.status === 401) {
            get().logout();
          }
          throw error;
        }
      },

      // Check if token is valid
      isTokenValid: () => {
        const { accessToken } = get();
        if (!accessToken) return false;

        try {
          const decoded = jwtDecode(accessToken);
          return decoded.exp * 1000 > Date.now();
        } catch {
          return false;
        }
      },

      // Initialize auth from storage
      initAuth: () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const user = localStorage.getItem("user");

        if (accessToken && refreshToken && user) {
          set({
            accessToken,
            refreshToken,
            user: JSON.parse(user),
            isAuthenticated: true,
          });
        }
      },
      // ✅ Add this method
      updateUser: (userData) => {
        set({ user: userData });
        localStorage.setItem("user", JSON.stringify(userData));
      },

      // ✅ Add this method to refresh user data
      refreshUserData: async () => {
        try {
          const response = await authAPI.getCurrentUser();
          const updatedUser = response.data;
          set({ user: updatedUser });
          localStorage.setItem("user", JSON.stringify(updatedUser));
          return updatedUser;
        } catch (error) {
          console.error("Failed to refresh user data:", error);
          throw error;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
