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
    { url: 'https://docs.alertyai.com', changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://docs.alertyai.com/quickstart', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://docs.alertyai.com/alertyai/how-to-use', changeFrequency: 'weekly', priority: 0.85 },
    { url: 'https://docs.alertyai.com/alertyai/features', changeFrequency: 'monthly', priority: 0.75 },
  ]

  return routes.map((route) => ({
    url: route.url || `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
