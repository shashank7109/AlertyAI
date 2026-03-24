/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export const metadata = {
  title: 'FAQs - AlertyAI',
  description: 'Frequently asked questions about AlertyAI. Find answers about features, pricing, privacy, and how to get the most out of your AI assistant.',
  alternates: { canonical: 'https://alertyai.com/faqs' },
  openGraph: {
    title: 'FAQs - AlertyAI',
    description: 'Got questions? We have answers. Everything you need to know about AlertyAI.',
    url: 'https://alertyai.com/faqs',
    siteName: 'AlertyAI',
    images: [{ url: 'https://alertyai.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function FAQsLayout({ children }) {
  return children
}
