# Supabase Integration — Saved for AWS Migration

Prepared 2026-04-24. Not wired in — Christian is targeting AWS (Cognito + RDS).
Drop these files in when ready. The SQL schema below is the spec to hand him.

---

## SQL Schema

```sql
create table ewc_scores (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  score       int not null,
  band        text not null,
  domains     jsonb,
  taken_at    timestamptz not null,
  created_at  timestamptz default now()
);

alter table ewc_scores enable row level security;
create policy "own scores" on ewc_scores
  for all using (auth.uid() = user_id);
```

---

## `src/lib/supabase.js` (new file)

```js
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Null when env vars absent — all callers must guard with `if (supabase)`
export const supabase = url && key ? createClient(url, key) : null
```

---

## `src/store/authStore.js`

```js
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
    partialize: (state) => ({ user: state.user, verified: state.verified }),
  }
))
```

---

## `src/store/assessmentStore.js`

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase.js'

export const useAssessmentStore = create(persist(
  (set) => ({
    answers: {},
    currentQuestion: 0,
    completed: false,
    score: null,
    band: null,
    history: [],

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
```

---

## `src/App.jsx`

```jsx
import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from './screens/Splash.jsx'
import Auth from './screens/Auth.jsx'
import Verify from './screens/Verify.jsx'
import EWCIntro from './screens/EWCIntro.jsx'
import EWCQuestion from './screens/EWCQuestion.jsx'
import Results from './screens/Results.jsx'
import Resources from './screens/Resources.jsx'
import Dashboard from './screens/Dashboard.jsx'
import History from './screens/History.jsx'
import ResultDetail from './screens/ResultDetail.jsx'
import Settings from './screens/Settings.jsx'
import NotFound from './screens/NotFound.jsx'
import { useAuthStore } from './store/authStore.js'
import { supabase } from './lib/supabase.js'

function PrivateRoute({ children }) {
  const { user, authReady } = useAuthStore()
  if (!authReady) return null
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const { setUser, setAuthReady } = useAuthStore()

  useEffect(() => {
    if (!supabase) { setAuthReady(); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user)
      setAuthReady()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/verify" element={<PrivateRoute><Verify /></PrivateRoute>} />
      <Route path="/ewc/intro" element={<PrivateRoute><EWCIntro /></PrivateRoute>} />
      <Route path="/ewc/q/:questionIndex" element={<PrivateRoute><EWCQuestion /></PrivateRoute>} />
      <Route path="/ewc/results" element={<PrivateRoute><Results /></PrivateRoute>} />
      <Route path="/ewc/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      <Route path="/history/:index" element={<PrivateRoute><ResultDetail /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

---

## `src/screens/Auth.jsx` (Supabase version with error handling + confirmation screen)

See git history: commit `fcbc4d2`

---

## Vercel env vars needed (when ready)

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Add to Production + Preview in the econa-app Vercel project settings, then redeploy.
