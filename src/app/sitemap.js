/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export default function sitemap() {
  const baseUrl = 'https://alertyai.com'
  const lastModified = new Date()

  const routes = [
    { path: '', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/faqs', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.5 },
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
