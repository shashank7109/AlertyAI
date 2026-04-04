'use client'

import { useConsent } from '@/context/ConsentContext.jsx'
import { GoogleAnalytics } from '@next/third-parties/google'
import { useEffect, useState } from 'react'

export default function AnalyticsLoader() {
  const { consent } = useConsent()
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (consent === 'accepted') {
      window.dataLayer = window.dataLayer || []
      function gtag(){window.dataLayer.push(arguments)}
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied'
      })
      setShouldLoad(true)
    }
  }, [consent])

  if (!shouldLoad) return null

  // Failsafe string if env is not loaded instantly
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-QWT4WLKHFH'

  return <GoogleAnalytics gaId={gaId} />
}
