import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase.js'

export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    verified: false,
    authReady: false,

    setUser: (user) => set({ user }),
    setVerified: (v) => set({ verified: v }),
    setAuthReady: () => set({ authReady: true }),

    signUp: async (email, password) => {
      if (!supabase) {
        set({ user: { id: crypto.randomUUID(), email } })
        return { error: null, needsConfirmation: false }
      }
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) return { error, needsConfirmation: false }
      // Supabase returns a user with identities=[] when email already exists (no error exposed)
      const needsConfirmation = !data.session
      if (data.user && data.session) set({ user: data.user })
      return { error: null, needsConfirmation }
    },

    signIn: async (email, password) => {
      if (!supabase) {
        set({ user: { id: crypto.randomUUID(), email } })
        return { error: null }
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error }
      set({ user: data.user })
      return { error: null }
    },

    logout: async () => {
      if (supabase) await supabase.auth.signOut()
      set({ user: null, verified: false })
    },
  }),
  {
    name: 'econa-auth',
    // authReady is transient — never persist it so it always starts false on load
    partialize: (state) => ({ user: state.user, verified: state.verified }),
  }
))
