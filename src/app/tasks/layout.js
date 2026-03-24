/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export const metadata = {
  title: 'Tasks - AlertyAI',
  description: 'Manage and organize your tasks with AI-powered insights. Create, prioritize, and track tasks effortlessly with AlertyAI.',
  alternates: { canonical: 'https://alertyai.com/tasks' },
  openGraph: {
    title: 'Tasks - AlertyAI',
    description: 'AI-powered task management. Create, prioritize, and complete tasks with smart AI suggestions.',
    url: 'https://alertyai.com/tasks',
    siteName: 'AlertyAI',
    images: [{ url: 'https://alertyai.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function TasksLayout({ children }) {
  return children
}
