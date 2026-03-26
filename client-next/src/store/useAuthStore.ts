import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCartStore } from './useCartStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  roles: string[];
  photoURL?: string;     // kept for firebase compat
  avatarUrl?: string;    // from UserProfileDto
  dateOfBirth?: string;
  gender?: string;
  emailConfirmed?: boolean;
  createdAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  setUser: (user: AuthUser | null, token: string | null) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
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

          // ── Single source of truth for the Axios interceptor ──────────────
          // Always keep localStorage['token'] in sync so every API call
          // gets the Authorization header, regardless of login method.
          if (typeof window !== 'undefined') {
              if (token) {
                  localStorage.setItem('token', token);
              } else {
                  localStorage.removeItem('token');
              }
          }

          if (user && token) {
              setTimeout(() => {
                  useCartStore.getState().syncWithServer();
              }, 100);
          }
      },
      updateUser: (partial) => {
          set((state) => ({
              user: state.user ? { ...state.user, ...partial } : null,
          }));
      },
      setLoading: (loading) => set({ loading }),
      logout: () => {
          // 1. Sign out from Firebase (clears cached tokens / IndexedDB)
          signOut(auth).catch(() => {});

          // 2. Clear ALL persisted data FIRST — before set() triggers persist middleware
          if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              localStorage.removeItem('auth-storage');
              localStorage.removeItem('cart-storage');
              // Clear any Firebase localStorage keys
              Object.keys(localStorage).forEach(key => {
                  if (key.startsWith('firebase:')) {
                      localStorage.removeItem(key);
                  }
              });
              sessionStorage.clear();
          }

          // 3. Then clear in-memory state
          useCartStore.setState({ items: [], isCartOpen: false });
          set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage', // unique key for localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
