/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/settings/',
        '/_next/',
        '/static/',
      ],
    },
    sitemap: 'https://alertyai.com/sitemap.xml',
  }
}
