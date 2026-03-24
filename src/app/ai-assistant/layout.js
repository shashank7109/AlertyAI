/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export const metadata = {
  title: 'AI Assistant - AlertyAI',
  description: 'Chat with your personal AI assistant. Get task suggestions, schedule planning, and smart productivity advice powered by Groq AI.',
  alternates: { canonical: 'https://alertyai.com/ai-assistant' },
  openGraph: {
    title: 'AI Assistant - AlertyAI',
    description: 'Your personal AI sidekick for planning, task management, and productivity — available 24/7.',
    url: 'https://alertyai.com/ai-assistant',
    siteName: 'AlertyAI',
    images: [{ url: 'https://alertyai.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function AIAssistantLayout({ children }) {
  return children
}
