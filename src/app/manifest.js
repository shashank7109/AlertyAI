/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export default function manifest() {
  return {
    name: 'AlertyAI',
    short_name: 'AlertyAI',
    description:
      'AlertyAI (Alerty AI) is an AI-first planning product for founders and teams.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
