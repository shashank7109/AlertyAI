/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: [
      'https://alertyai.com/sitemap.xml',
      'https://docs.alertyai.com/sitemap.xml',
    ],
  }
}
