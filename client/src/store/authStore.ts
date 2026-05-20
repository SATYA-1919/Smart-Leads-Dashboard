import { create } from 'zustand';
import { clearToken, setToken, getToken } from '@/api/client';
import { loginRequest, registerRequest, meRequest, type LoginPayload, type RegisterPayload } from '@/api/auth';
import type { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
  initialize: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  error: null,

  initialize: async () => {
    const token = getToken();
    if (!token) {
      set({ status: 'unauthenticated' });
      return;
    }
    set({ status: 'loading' });
    try {
      const user = await meRequest();
      set({ user, status: 'authenticated', error: null });
    } catch {
      clearToken();
      set({ user: null, status: 'unauthenticated' });
    }
  },

  login: async (payload) => {
    set({ status: 'loading', error: null });
    const { token, user } = await loginRequest(payload);
    setToken(token);
    set({ user, status: 'authenticated' });
  },

  register: async (payload) => {
    set({ status: 'loading', error: null });
    const { token, user } = await registerRequest(payload);
    setToken(token);
    set({ user, status: 'authenticated' });
  },

  logout: () => {
    clearToken();
    set({ user: null, status: 'unauthenticated' });
  },
}));
