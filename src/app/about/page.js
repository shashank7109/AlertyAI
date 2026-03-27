/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'About AlertyAI',
  description: 'Learn about AlertyAI, our mission, and how we build calm AI tools for productivity.',
  alternates: { canonical: 'https://alertyai.com/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight uppercase">
          About AlertyAI
        </h1>
        <p className="text-lg text-text-secondary font-medium leading-relaxed mb-6">
          AlertyAI is built to make daily planning feel simple, focused, and human. We combine modern AI with a clean
          experience so people can capture tasks quickly and stay consistent.
        </p>
        <p className="text-lg text-text-secondary font-medium leading-relaxed mb-6">
          Our goal is to reduce friction in personal productivity, from idea capture to reminders and team alignment.
          We design for clarity first, then power.
        </p>
        <p className="text-lg text-text-secondary font-medium leading-relaxed">
          This website is the public face of AlertyAI, where you can explore features, read FAQs, and get updates.
        </p>
      </main>
      <Footer />
    </div>
  )
}
