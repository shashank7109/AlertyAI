/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

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
