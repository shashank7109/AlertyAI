/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export const metadata = {
  title: 'Calendar - AlertyAI',
  description: 'Visualize your schedule with AlertyAI Calendar. See all tasks, reminders, and deadlines in a clean, intuitive calendar view.',
  alternates: { canonical: 'https://alertyai.com/calendar' },
  openGraph: {
    title: 'Calendar - AlertyAI',
    description: 'A bird\'s-eye view of your schedule. All tasks and reminders beautifully organized in one calendar.',
    url: 'https://alertyai.com/calendar',
    siteName: 'AlertyAI',
    images: [{ url: 'https://alertyai.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function CalendarLayout({ children }) {
  return children
}
