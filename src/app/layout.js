/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
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
  metadataBase: new URL('https://smaranai.com'), // Replace with your production domain
  title: {
    default: 'AlertyAI - Your Intelligent Life Assistant',
    template: '%s | AlertyAI'
  },
  description: 'SmaranAI (AlertyAI) is a premium AI platform for voice-powered task management, smart reminders, and seamless team collaboration.',
  keywords: ['AI assistant', 'task management', 'voice capture', 'productivity', 'reminders', 'team collaboration', 'SmaranAI', 'AlertyAI'],
  authors: [{ name: 'SmaranAI Team' }],
  creator: 'SmaranAI',
  themeColor: '#0f172a',
  viewport: 'width=device-width, initial-scale=1',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AlertyAI - Your Intelligent Life Assistant',
    description: 'Master your day with AlertyAI. AI-powered task management and seamless team collaboration.',
    url: 'https://smaranai.com',
    siteName: 'AlertyAI',
    images: [
      {
        url: '/og-image.png',
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
    creator: '@SmaranAI', // Update with actual handle
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
  return (
    <html lang="en" suppressHydrationWarning>
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

