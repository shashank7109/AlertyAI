/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/settings/', // Private user settings
        '/_next/',
        '/static/',
      ],
    },
    sitemap: 'https://smaranai.com/sitemap.xml', // Replace with production domain
  }
}
