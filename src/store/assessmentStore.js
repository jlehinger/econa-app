import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase.js'

export const useAssessmentStore = create(persist(
  (set) => ({
    answers: {},           // { [questionIndex]: score }
    currentQuestion: 0,
    completed: false,
    score: null,
    band: null,            // 'distress' | 'strain' | 'stability' | 'vitality'
    history: [],           // array of { date, score, band }

    setAnswer: (index, value) => set(state => ({
      answers: { ...state.answers, [index]: value }
    })),
    setCurrentQuestion: (q) => set({ currentQuestion: q }),
    setResult: (score, band) => set({ score, band, completed: true }),
    addToHistory: (entry) => {
      set(state => ({ history: [entry, ...state.history] }))
      if (supabase) {
        supabase.auth.getSession().then(({ data }) => {
          if (!data?.session) return
          supabase.from('ewc_scores').insert({
            user_id: data.session.user.id,
            score: entry.score,
            band: entry.band,
            domains: entry.domains,
            taken_at: entry.date,
          }).then(({ error }) => { if (error) console.error('ewc_scores insert:', error) })
        })
      }
    },
    resetAssessment: () => set({
      answers: {}, currentQuestion: 0, completed: false, score: null, band: null
    }),
    clearHistory: () => set({ history: [] }),
  }),
  { name: 'econa-assessment' }
))
