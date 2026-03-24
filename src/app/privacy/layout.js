/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export const metadata = {
  title: 'Privacy Policy - AlertyAI',
  description: 'Read the AlertyAI Privacy Policy. Learn how we handle your data, protect your privacy, and keep your information secure.',
  alternates: { canonical: 'https://alertyai.com/privacy' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Privacy Policy - AlertyAI',
    description: 'AlertyAI is committed to your privacy. Read our full privacy policy.',
    url: 'https://alertyai.com/privacy',
    siteName: 'AlertyAI',
  },
}

export default function PrivacyLayout({ children }) {
  return children
}
