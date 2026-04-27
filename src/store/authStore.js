import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    verified: false,
    isQualified: false,          // passed founder/co-founder/CEO gate
    villageStatus: null,         // null | 'active' | 'expired'
    villageJoinDate: null,       // ISO date string

    setUser: (user) => set({ user }),
    logout: () => set({ user: null, verified: false, isQualified: false }),
    setVerified: (v) => set({ verified: v }),
    setQualified: () => set({ isQualified: true }),
    joinVillage: () => set({ villageStatus: 'active', villageJoinDate: new Date().toISOString() }),
  }),
  { name: 'econa-auth' }
))
