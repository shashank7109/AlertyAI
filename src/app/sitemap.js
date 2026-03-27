/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export default function sitemap() {
  const baseUrl = 'https://alertyai.com'

  const routes = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/faqs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }))

  return routes
}
