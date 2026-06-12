import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EconaLogo from '../components/EconaLogo.jsx'
import NavBar from '../components/NavBar.jsx'
import { useAuthStore } from '../store/authStore.js'
import { useAssessmentStore } from '../store/assessmentStore.js'
import { CONNECTED_MIND_URL } from '../lib/links.js'

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      aria-pressed={on}
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        background: on ? 'var(--flame)' : 'rgba(255,255,255,0.12)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
        transition: 'background 0.2s',
      }}
    >
      <div style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: 3,
        left: on ? 21 : 3,
        transition: 'left 0.2s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
      }} />
    </button>
  )
}

function SectionLabel({ title }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em',
      color: 'rgba(255,255,255,0.68)',
      marginBottom: 10,
      paddingLeft: 2,
    }}>
      {title}
    </div>
  )
}

function SettingsCard({ children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 28,
    }}>
      {children}
    </div>
  )
}

function Row({ label, sub, right, onClick, destructive, noBorder }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 18px',
        borderBottom: noBorder ? 'none' : '1px solid rgba(255,255,255,0.05)',
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'background 0.15s' : 'none',
        gap: 12,
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.background = 'transparent' }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          color: destructive ? '#E05252' : '#fff',
          fontFamily: 'var(--font-body)',
          marginBottom: sub ? 2 : 0,
        }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { history, resetAssessment, clearHistory, researchConsented, setResearchConsented } = useAssessmentStore()
  const [retestReminder, setRetestReminder] = useState(true)
  // Reflect the user's actual stored consent, not a hardcoded ON.
  const [researchOptIn, setResearchOptIn] = useState(researchConsented)
  const [deleteStep, setDeleteStep] = useState(0)
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false)

  const handleResearchToggle = (newValue) => {
    if (newValue === true && !researchConsented) {
      setIsConsentModalOpen(true)
    } else {
      // Turning OFF must persist the withdrawal — the IRB consent text promises
      // users can withdraw via this toggle.
      setResearchOptIn(newValue)
      if (newValue === false) setResearchConsented(false)
    }
  }

  const handleConsent = () => {
    setResearchConsented(true)
    setResearchOptIn(true)
    setIsConsentModalOpen(false)
  }

  const handleDeclineConsent = () => {
    setIsConsentModalOpen(false)
  }

  const handleDeleteAccount = () => {
    resetAssessment()
    clearHistory()
    logout()
    navigate('/')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      paddingBottom: 90,
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--ember), var(--flame), var(--spark))', zIndex: 200 }} />

      <div style={{
        padding: '36px 24px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <EconaLogo size="sm" />
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.68)',
        }}>
          Settings
        </div>
      </div>

      <div style={{ padding: '28px 24px', flex: 1 }}>

        {/* Account */}
        <SectionLabel title="Account" />
        <SettingsCard>
          <Row
            label={user?.email || 'Anonymous Session'}
            sub="Account email"
            right={
              <span style={{
                fontSize: 10,
                color: 'var(--teal-light)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 700,
                background: 'rgba(93,173,226,0.1)',
                border: '1px solid rgba(93,173,226,0.2)',
                padding: '3px 8px',
                borderRadius: 100,
              }}>
                Entrepreneur
              </span>
            }
          />
          <Row
            label={`${history.length} ${history.length === 1 ? 'assessment' : 'assessments'} completed`}
            noBorder
          />
        </SettingsCard>

        {/* Assessment */}
        <SectionLabel title="Assessment" />
        <SettingsCard>
          <Row
            label="Retesting reminder"
            sub="Remind me to recheck every 30 days"
            right={<Toggle on={retestReminder} onChange={setRetestReminder} />}
          />
          <Row
            label="Contribute to research"
            sub="Share anonymized scores with Econa's global dataset"
            right={<Toggle on={researchOptIn} onChange={handleResearchToggle} />}
            noBorder
          />
        </SettingsCard>

        {/* Privacy */}
        <SectionLabel title="Privacy & Data" />
        <SettingsCard>
          <Row
            label="Data storage"
            sub="Your results are saved to your account."
          />
          <Row
            label="Anonymity"
            sub="Econa does not link your scores to your identity. All results are private by design."
            noBorder
          />
        </SettingsCard>

        {/* About */}
        <SectionLabel title="About" />
        <SettingsCard>
          <Row
            label="Visit econa.net"
            sub="Global center of excellence for entrepreneur mental wellness"
            onClick={() => window.open('https://econa.net', '_blank', 'noopener,noreferrer')}
            right={<span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>→</span>}
          />
          <Row
            label="Connected Mind"
            sub="Clinical partner — evidence-based tools for high-performance environments"
            onClick={() => window.open(CONNECTED_MIND_URL, '_blank', 'noopener,noreferrer')}
            right={<span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>→</span>}
          />
          <Row
            label="EWC Version 1.0"
            sub="Freeman, Mazza, Johnson & Heinz (2026). Validated on 314 entrepreneurs. DOI 10.1108/IJEBR-02-2025-0147."
            noBorder
          />
        </SettingsCard>

        {/* Sign out */}
        <SectionLabel title="Session" />
        <SettingsCard>
          <Row
            label="Sign out"
            onClick={handleLogout}
            right={<span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>→</span>}
            noBorder
          />
        </SettingsCard>

        {/* Delete account */}
        <div style={{
          background: 'rgba(224,82,82,0.06)',
          border: '1px solid rgba(224,82,82,0.15)',
          borderRadius: 14,
          padding: '20px 18px',
          marginBottom: 24,
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: '#E05252',
            marginBottom: 8,
          }}>
            Delete account
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 16 }}>
            Permanently delete your account and all local assessment history. This cannot be undone.
          </p>

          {deleteStep === 0 && (
            <button
              onClick={() => setDeleteStep(1)}
              style={{
                background: 'none',
                border: '1px solid rgba(224,82,82,0.35)',
                color: '#E05252',
                borderRadius: 10,
                padding: '10px 18px',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
              }}
            >
              Delete my account
            </button>
          )}

          {deleteStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                fontSize: 12,
                color: '#E05252',
                fontWeight: 600,
                marginBottom: 4,
              }}>
                Are you sure? All history will be erased.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => setDeleteStep(0)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    background: '#E05252',
                    border: 'none',
                    color: '#fff',
                    borderRadius: 10,
                    padding: '10px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    flex: 1,
                  }}
                >
                  Yes, delete all
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.68)',
          textAlign: 'center',
          lineHeight: 1.8,
          paddingBottom: 8,
          letterSpacing: '0.04em',
        }}>
          Econa · Entrepreneur Wellbeing Check<br />
          Version 1.0 · © 2025 Econa
        </p>
      </div>

      <NavBar />

      {/* IRB Consent Modal */}
      {isConsentModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{
            background: 'var(--void)',
            borderRadius: 16,
            padding: '32px',
            maxWidth: 400,
            width: '100%',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: 'var(--flame)',
              marginBottom: 16,
              fontFamily: 'var(--font-display)',
            }}>
              Research participation
            </div>

            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.7,
              marginBottom: 12,
            }}>
              Econa is conducting ongoing research on entrepreneur mental health and wellbeing, in partnership with UC Berkeley and the Wharton School.
            </p>
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.7,
              marginBottom: 12,
            }}>
              By enabling this option, you consent to your anonymized assessment scores being included in Econa's research dataset. No personally identifiable information is shared. You may withdraw consent at any time by disabling this toggle in Settings.
            </p>
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.7,
              marginBottom: 28,
            }}>
              This research has been designed to meet standards for IRB (Institutional Review Board) compliance for human subjects research.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn btn-ghost"
                onClick={handleDeclineConsent}
                style={{ flex: 1 }}
              >
                No Thanks
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConsent}
                style={{ flex: 1 }}
              >
                I Consent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
