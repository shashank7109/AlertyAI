/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export const metadata = {
  title: 'Reminders - AlertyAI',
  description: 'Never miss a deadline. Set smart AI-powered reminders that adapt to your schedule and lifestyle with AlertyAI.',
  alternates: { canonical: 'https://alertyai.com/reminders' },
  openGraph: {
    title: 'Reminders - AlertyAI',
    description: 'Smart AI-powered reminders. Never miss an important event, deadline, or task again.',
    url: 'https://alertyai.com/reminders',
    siteName: 'AlertyAI',
    images: [{ url: 'https://alertyai.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function RemindersLayout({ children }) {
  return children
}
