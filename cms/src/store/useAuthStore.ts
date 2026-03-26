import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  roles: string[];
  avatarUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  setUser: (user: AuthUser | null, token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      setUser: (user, token) => {
        set({ user, token });
        if (token) {
          localStorage.setItem('cms-token', token);
        } else {
          localStorage.removeItem('cms-token');
        }
      },
      setLoading: (loading) => set({ loading }),
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('cms-token');
      },
    }),
    {
      name: 'cms-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
