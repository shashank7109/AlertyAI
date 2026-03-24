/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export const metadata = {
  title: 'Team Collaboration - AlertyAI',
  description: 'Collaborate seamlessly with your team. Assign tasks, track progress, and communicate — all in one AI-powered workspace.',
  alternates: { canonical: 'https://alertyai.com/teams' },
  openGraph: {
    title: 'Team Collaboration - AlertyAI',
    description: 'AI-powered team workspace. Assign tasks, coordinate projects, and achieve more together.',
    url: 'https://alertyai.com/teams',
    siteName: 'AlertyAI',
    images: [{ url: 'https://alertyai.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function TeamsLayout({ children }) {
  return children
}
