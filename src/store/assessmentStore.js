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
    demographics: null,      // object { q1..q10 } — set by Demographics screen
    econometrics: null,      // object { sector, growth_a, growth_b, q4..q17 } — set by Econometrics screen
    perceivedNeed: null,     // 1|2|3|4 — set by PerceivedNeedForCare screen
    researchConsented: false, // true once user has accepted the IRB consent modal

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
        [labId]: state.labProgress[labId]
          ? { ...state.labProgress[labId], started: true }
          : { started: true, assessmentDone: false, sectionsSeen: [] }
      }
    })),
    markLabSection: (labId, section) => set(state => {
      const prev = state.labProgress[labId] || { started: false, assessmentDone: false, sectionsSeen: [] }
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
    // Resets only the EWC check itself. FounderScreen intake (demographics,
    // econometrics, perceivedNeed) is collected once and survives retakes —
    // use resetAll to wipe everything (e.g. on sign-out).
    resetAssessment: () => set({
      answers: {}, currentQuestion: 0, completed: false,
      score: null, band: null, itemScores: [], domainScores: null,
    }),
    resetAll: () => set({
      answers: {}, currentQuestion: 0, completed: false,
      score: null, band: null, itemScores: [], domainScores: null,
      demographics: null, econometrics: null, perceivedNeed: null,
    }),
    setDemographics: (data) => set({ demographics: data }),
    setEconometrics: (data) => set({ econometrics: data }),
    setPerceivedNeed: (val) => set({ perceivedNeed: val }),
    setResearchConsented: (val) => set({ researchConsented: val }),
    clearHistory: () => set({ history: [] }),
  }),
  {
    name: 'econa-assessment',
    version: 1,
    // Establishes the migration hook. Returning the persisted state unchanged is safe:
    // Zustand merges it over the current defaults, so fields added after a user's data
    // was written (labProgress, demographics, etc.) hydrate with their defaults rather
    // than undefined. Bump version + extend this when a future shape change needs cleanup.
    migrate: (persisted) => persisted,
  }
))
