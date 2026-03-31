'use client'

import { useConsent } from '@/context/ConsentContext.jsx'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const { consent, accept, reject } = useConsent()
  const [mounted, setMounted] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || consent !== 'pending') return null

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 shadow-2xl transition-transform" 
        role="region" aria-label="Cookie consent" aria-live="polite"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start md:items-center text-sm text-zinc-600 dark:text-zinc-300 gap-3">
            <svg className="w-6 h-6 shrink-0 mt-0.5 md:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p>
              We use cookies to understand how you use AlertyAI and improve your experience.
              <Link href="/privacy" className="underline ml-1 hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</Link>
            </p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2 shrink-0">
            <button onClick={() => setShowPreferences(true)} className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              Manage
            </button>
            <button onClick={reject} className="flex-1 md:flex-none px-4 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              Reject
            </button>
            <button onClick={accept} className="flex-1 md:flex-none px-4 py-2 text-sm font-medium bg-primary text-on-primary hover:opacity-90 rounded-lg transition-colors">
              Accept All
            </button>
          </div>
        </div>
      </div>

      {showPreferences && (
        <div className="fixed inset-0 bg-black/40 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 shadow-2xl" role="dialog" aria-modal="true">
            <h2 className="text-xl font-heading font-bold mb-4 text-on-surface">Cookie Preferences</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="font-medium text-sm text-on-surface">Essential cookies</h3>
                  <p className="text-xs text-text-secondary">Required for the site to work</p>
                </div>
                <div className="bg-primary w-10 h-5 rounded-full relative opacity-50 cursor-not-allowed">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-on-primary rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="font-medium text-sm text-on-surface">Analytics cookies</h3>
                  <p className="text-xs text-text-secondary">Help us understand usage</p>
                </div>
                <div className="bg-primary w-10 h-5 rounded-full relative opacity-50 cursor-not-allowed">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-on-primary rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowPreferences(false)} 
                className="px-4 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
               >
                Cancel
              </button>
              <button 
                onClick={() => { accept(); setShowPreferences(false) }} 
                className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg hover:opacity-90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
