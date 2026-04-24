import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    verified: false,  // entrepreneur verification passed
    setUser: (user) => set({ user }),
    setVerified: (v) => set({ verified: v }),
    logout: () => set({ user: null, verified: false }),
  }),
  { name: 'econa-auth' }
))
