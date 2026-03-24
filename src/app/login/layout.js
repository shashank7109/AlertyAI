/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export const metadata = {
  title: 'Login - AlertyAI',
  description: 'Sign in to AlertyAI and get back to being productive. Your tasks, reminders, and AI assistant are waiting.',
  alternates: { canonical: 'https://alertyai.com/login' },
  robots: { index: true, follow: false },
  openGraph: {
    title: 'Login - AlertyAI',
    description: 'Sign in to AlertyAI.',
    url: 'https://alertyai.com/login',
    siteName: 'AlertyAI',
  },
}

export default function LoginLayout({ children }) {
  return children
}
