'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ConsentContext = createContext(null)

export function ConsentProvider({ children }) {
  const [consent, setConsentState] = useState('pending')

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )alertyai_consent=([^;]+)'))
    if (match) {
      setConsentState(match[2])
    }
  }, [])

  const accept = () => {
    document.cookie = 'alertyai_consent=accepted; max-age=31536000; path=/; SameSite=Lax; Secure'
    setConsentState('accepted')
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'consent_update', analytics_storage: 'granted' })
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied' })
      }
    }
  }

  const reject = () => {
    document.cookie = 'alertyai_consent=rejected; max-age=31536000; path=/; SameSite=Lax; Secure'
    setConsentState('rejected')
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' })
    }
  }

  const reset = () => {
    document.cookie = 'alertyai_consent=; max-age=0; path=/; SameSite=Lax; Secure'
    setConsentState('pending')
  }

  return (
    <ConsentContext.Provider value={{ consent, accept, reject, reset }}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const context = useContext(ConsentContext)
  if (!context) throw new Error('useConsent must be used within ConsentProvider')
  return context
}
