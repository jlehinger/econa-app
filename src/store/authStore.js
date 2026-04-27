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
    setQualified: (v = true) => set({ isQualified: v }),
    joinVillage: () => set((state) => ({
      villageStatus: 'active',
      villageJoinDate: state.villageJoinDate ?? new Date().toISOString(),
    })),
  }),
  { name: 'econa-auth', version: 1 }
))

// Use this selector wherever village access is checked — guards against user: null + villageStatus: 'active'
export const selectIsVillageMember = (s) => !!s.user && s.villageStatus === 'active'
