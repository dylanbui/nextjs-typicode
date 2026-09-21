'use client';

import { create } from 'zustand';
import type { SessionData } from '@repo/shared';

interface AuthUIState {
  user: SessionData | null;
  currentUser: SessionData | null;
  isInitialized: boolean;
  isLoading: boolean;
  timeLeft: number;
  setUser: (user: SessionData | null) => void;
  setCurrentUser: (user: SessionData | null) => void;
  setLoading: (loading: boolean) => void;
  setTimeLeft: (seconds: number) => void;
  decrementTimer: () => void;
}

export const useAuthStore = create<AuthUIState>((set) => ({
  user: null,
  currentUser: null,
  isInitialized: false,
  isLoading: false,
  timeLeft: 1800, // 30 phút mặc định
  setUser: (user) => set({ user, currentUser: user, isInitialized: true }),
  setCurrentUser: (user) => set({ user, currentUser: user, isInitialized: true }),
  setLoading: (loading) => set({ isLoading: loading }),
  setTimeLeft: (seconds) => set({ timeLeft: seconds }),
  decrementTimer: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
}));
