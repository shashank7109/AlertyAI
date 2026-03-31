/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

import { Ubuntu, Montserrat } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ConsentProvider } from '@/context/ConsentContext.jsx'
import CookieBanner from '@/components/seo/CookieBanner.jsx'
import AnalyticsLoader from '@/components/seo/AnalyticsLoader.jsx'
import JsonLd from '@/components/seo/JsonLd.jsx'
import { Toaster } from 'react-hot-toast'
import { getGoogleSiteVerification } from '@/lib/seo/site'

const ubuntu = Ubuntu({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
})

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const googleVerification = getGoogleSiteVerification()

export const metadata = {
  metadataBase: new URL('https://alertyai.com'),
  applicationName: 'AlertyAI',
  title: {
    default: 'AlertyAI — Turn Your Thoughts Into Tasks Instantly',
    template: '%s | AlertyAI'
  },
  description: 'AlertyAI uses AI to convert raw thoughts into structured tasks and actionable plans. Smart reminders, team collaboration, zero friction. Free on Android.',
  keywords: [
    'ai task manager', 'ai productivity app', 'thought to task ai',
    'ai to-do list app', 'smart task planner', 'ai reminder app',
    'task management app android', 'alertyai', 'convert thoughts to tasks',
    'ai planning app', 'task organiser ai', 'productivity app free'
  ],
  authors: [{ name: 'Shashank Bindal', url: 'https://alertyai.com' }],
  creator: 'Shashank Bindal',
  publisher: 'AlertyAI',
  category: 'productivity',
  classification: 'Business/Productivity',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alertyai.com',
    siteName: 'AlertyAI',
    title: 'AlertyAI — Turn Your Thoughts Into Tasks Instantly',
    description: 'AI that converts your thoughts into structured tasks and plans. Smart reminders, team features. Free on Android.',
    images: [{
      url: 'https://alertyai.com/alerty-icon.png',
      width: 1200,
      height: 630,
      alt: 'AlertyAI — AI Task Manager App'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlertyAI — AI-Powered Task Manager',
    description: 'Turn thoughts into tasks instantly. Free on Android.',
    images: ['https://alertyai.com/alerty-icon.png'],
    creator: '@alertyai'
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: 'https://alertyai.com',
    languages: { 'en-US': 'https://alertyai.com' }
  },
  ...(googleVerification
    ? {
        verification: {
          google: googleVerification,
        },
      }
    : {}),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/alerty-alerty-favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    apple: [{ url: '/alerty-icon.png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/alerty-icon.png', color: '#6366f1' }]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AlertyAI'
  },
  other: {
    'google-play-app': 'app-id=com.alertyai.app'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://play.google.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${ubuntu.variable} ${montserrat.variable} font-sans antialiased text-on-surface`}>
        <ConsentProvider>
          <ThemeProvider>
            <CookieBanner />
            <JsonLd />
            {children}
            <AnalyticsLoader />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </ThemeProvider>
        </ConsentProvider>
        
        {/* Default Google Consent State */}
        <script id="consent-default" dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            wait_for_update: 500
          });
        `}} />
      </body>
    </html>
  )
}
