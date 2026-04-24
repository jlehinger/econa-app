import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAssessmentStore = create(persist(
  (set) => ({
    answers: {},           // { [questionIndex]: score }
    currentQuestion: 0,
    completed: false,
    score: null,
    band: null,            // 'distress' | 'strain' | 'stability' | 'vitality'
    history: [],           // array of { date, score, band, domains }

    setAnswer: (index, value) => set(state => ({
      answers: { ...state.answers, [index]: value }
    })),
    setCurrentQuestion: (q) => set({ currentQuestion: q }),
    setResult: (score, band) => set({ score, band, completed: true }),
    addToHistory: (entry) => set(state => ({
      history: [entry, ...state.history]
    })),
    resetAssessment: () => set({
      answers: {}, currentQuestion: 0, completed: false, score: null, band: null
    }),
    clearHistory: () => set({ history: [] }),
  }),
  { name: 'econa-assessment' }
))
