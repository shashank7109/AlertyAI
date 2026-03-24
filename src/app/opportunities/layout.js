/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export const metadata = {
  title: 'Opportunities - AlertyAI',
  description: 'Discover scholarships, internships, and career opportunities curated by AI. Never miss a chance to grow with AlertyAI.',
  alternates: { canonical: 'https://alertyai.com/opportunities' },
  openGraph: {
    title: 'Opportunities - AlertyAI',
    description: 'AI-curated scholarships, internships, and jobs. Never miss your next big opportunity.',
    url: 'https://alertyai.com/opportunities',
    siteName: 'AlertyAI',
    images: [{ url: 'https://alertyai.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function OpportunitiesLayout({ children }) {
  return children
}
