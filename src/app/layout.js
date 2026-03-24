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
    default: 'AlertyAI - Your Intelligent Life Assistant',
    template: '%s | AlertyAI'
  },
  description: 'AlertyAI is a premium AI platform for voice-powered task management, smart reminders, and seamless team collaboration. Never forget, always achieve.',
  keywords: ['AI assistant', 'task management', 'voice capture', 'productivity', 'reminders', 'team collaboration', 'AlertyAI', 'smart planner'],
  authors: [{ name: 'AlertyAI Team' }],
  creator: 'AlertyAI',
  themeColor: '#0f172a',
  viewport: 'width=device-width, initial-scale=1',
  alternates: {
    canonical: 'https://alertyai.com/',
  },
  openGraph: {
    title: 'AlertyAI - Your Intelligent Life Assistant',
    description: 'Master your day with AlertyAI. AI-powered task management and seamless team collaboration.',
    url: 'https://alertyai.com',
    siteName: 'AlertyAI',
    images: [
      {
        url: 'https://alertyai.com/og-image.png',
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
    title: 'AlertyAI - Your Intelligent Life Assistant',
    description: 'Master your day with AlertyAI. AI-powered task management and seamless team collaboration.',
    images: ['/og-image.png'],
    creator: '@AlertyAI',
  },
  icons: {
    icon: '/logo.png',
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

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://alertyai.com/#website',
        url: 'https://alertyai.com',
        name: 'AlertyAI',
        description: 'AI-powered task management, voice capture, smart reminders, and team collaboration.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://alertyai.com/tasks?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://alertyai.com/#organization',
        name: 'AlertyAI',
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
          'AI smart reminders',
          'CSV schedule import',
          'Team collaboration',
          'Calendar view',
          'Dark mode',
        ],
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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

