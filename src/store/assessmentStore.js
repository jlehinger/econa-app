import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAssessmentStore = create(persist(
  (set) => ({
    answers: {},
    currentQuestion: 0,
    completed: false,
    score: null,
    band: null,
    itemScores: [],          // [s0, s1, s2, s3, s4, s5, s6]
    domainScores: null,      // { wellbeing, occupational, emotional }
    history: [],
    labProgress: {},         // { [labId]: { started, assessmentDone, sectionsSeen: [] } }

    setAnswer: (index, value) => set(state => ({
      answers: { ...state.answers, [index]: value }
    })),
    setCurrentQuestion: (q) => set({ currentQuestion: q }),
    setResult: (score, band, itemScores, domainScores) =>
      set({ score, band, completed: true, itemScores, domainScores }),
    addToHistory: (entry) => set(state => ({
      history: [entry, ...state.history]
    })),
    startLab: (labId) => set(state => ({
      labProgress: {
        ...state.labProgress,
        [labId]: { started: true, assessmentDone: false, sectionsSeen: [], ...state.labProgress[labId] }
      }
    })),
    markLabSection: (labId, section) => set(state => {
      const prev = state.labProgress[labId] || { started: true, assessmentDone: false, sectionsSeen: [] }
      return {
        labProgress: {
          ...state.labProgress,
          [labId]: {
            ...prev,
            sectionsSeen: prev.sectionsSeen.includes(section)
              ? prev.sectionsSeen
              : [...prev.sectionsSeen, section]
          }
        }
      }
    }),
    resetAssessment: () => set({
      answers: {}, currentQuestion: 0, completed: false,
      score: null, band: null, itemScores: [], domainScores: null
    }),
    clearHistory: () => set({ history: [] }),
  }),
  { name: 'econa-assessment' }
))
