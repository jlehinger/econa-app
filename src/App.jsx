import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from './screens/Splash.jsx'
import Auth from './screens/Auth.jsx'
import Verify from './screens/Verify.jsx'
import Demographics from './screens/Demographics.jsx'
import Econometrics from './screens/Econometrics.jsx'
import PerceivedNeedForCare from './screens/PerceivedNeedForCare.jsx'
import EWCIntro from './screens/EWCIntro.jsx'
import EWCQuestion from './screens/EWCQuestion.jsx'
import Results from './screens/Results.jsx'
import Resources from './screens/Resources.jsx'
import Dashboard from './screens/Dashboard.jsx'
import History from './screens/History.jsx'
import ResultDetail from './screens/ResultDetail.jsx'
import Settings from './screens/Settings.jsx'
import NotFound from './screens/NotFound.jsx'
import CMTriage from './screens/CMTriage.jsx'
import VillageWelcome from './screens/VillageWelcome.jsx'
import LabsList from './screens/LabsList.jsx'
import LabDetail from './screens/LabDetail.jsx'
import { useAuthStore } from './store/authStore.js'

function PrivateRoute({ children }) {
  // HANDOFF NOTE: gates on session presence only. The `verified` and `isQualified`
  // flags in authStore are set but NOT enforced here (the current auth is a local
  // stub). When real auth lands, gate on real session validity (e.g. a verified JWT)
  // — and note `/verify` performs founder qualification, not email verification.
  const { user } = useAuthStore()
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/verify" element={<PrivateRoute><Verify /></PrivateRoute>} />
      <Route path="/demographics" element={<PrivateRoute><Demographics /></PrivateRoute>} />
      <Route path="/econometrics" element={<PrivateRoute><Econometrics /></PrivateRoute>} />
      <Route path="/ewc/perceived-need" element={<PrivateRoute><PerceivedNeedForCare /></PrivateRoute>} />
      <Route path="/ewc/intro" element={<PrivateRoute><EWCIntro /></PrivateRoute>} />
      <Route path="/ewc/q/:questionIndex" element={<PrivateRoute><EWCQuestion /></PrivateRoute>} />
      <Route path="/ewc/results" element={<PrivateRoute><Results /></PrivateRoute>} />
      <Route path="/ewc/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      <Route path="/history/:index" element={<PrivateRoute><ResultDetail /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/triage" element={<PrivateRoute><CMTriage /></PrivateRoute>} />
      <Route path="/village" element={<PrivateRoute><VillageWelcome /></PrivateRoute>} />
      <Route path="/labs" element={<PrivateRoute><LabsList /></PrivateRoute>} />
      <Route path="/labs/:labId" element={<PrivateRoute><LabDetail /></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
