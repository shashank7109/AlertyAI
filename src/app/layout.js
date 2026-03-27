/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */


import { Ubuntu, Montserrat } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast'

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

export const metadata = {
  metadataBase: new URL('https://alertyai.com'),
  title: {
    default: 'AlertyAI (Alerty AI) - AI Planning for Teams',
    template: '%s | AlertyAI'
  },
  description: 'AlertyAI (also searched as Alerty AI) is an AI-first planning product for founders and teams: capture fast, prioritize clearly, and execute with confidence.',
  keywords: ['AI planning', 'startup productivity', 'team execution', 'voice capture', 'task management', 'AlertyAI', 'Alerty AI', 'alertyai docs', 'alerty ai how to use'],
  authors: [{ name: 'AlertyAI Team' }],
  creator: 'AlertyAI',
  alternates: {
    canonical: 'https://alertyai.com/',
  },
  openGraph: {
    title: 'AlertyAI (Alerty AI) - AI Planning for Teams',
    description: 'Plan faster and execute better with AlertyAI. Built for startup teams and modern workflows.',
    url: 'https://alertyai.com',
    siteName: 'AlertyAI',
    images: [
      {
        url: 'https://alertyai.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'AlertyAI Social Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlertyAI (Alerty AI) - AI Planning for Teams',
    description: 'Plan faster and execute better with AlertyAI. Built for startup teams and modern workflows.',
    images: ['https://alertyai.com/logo.png'],
    creator: '@AlertyAI',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'add-your-google-verification-code', // User to update later
    yandex: 'add-your-yandex-verification-code',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://alertyai.com/#website',
        url: 'https://alertyai.com',
        name: 'AlertyAI',
        alternateName: ['Alerty AI', 'alertyai'],
        description: 'AI-first planning and execution workspace for teams.',
      },
      {
        '@type': 'Organization',
        '@id': 'https://alertyai.com/#organization',
        name: 'AlertyAI',
        alternateName: 'Alerty AI',
        url: 'https://alertyai.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://alertyai.com/logo.png',
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://play.google.com/store/apps/details?id=com.alertyai.app',
        ],
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://alertyai.com/#webapp',
        name: 'AlertyAI',
        url: 'https://alertyai.com',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Android, Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: 'AI-powered task management with voice capture, smart reminders, CSV schedule import, and team collaboration.',
        featureList: [
          'Voice-powered task capture',
          'AI prioritization',
          'Team execution tracking',
          'Smart reminders',
          'Mobile-first workflow',
        ],
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="https://alertyai.com/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${ubuntu.variable} ${montserrat.variable} font-sans antialiased text-on-surface`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

