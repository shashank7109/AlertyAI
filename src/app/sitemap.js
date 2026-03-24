/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

export default function sitemap() {
  const baseUrl = 'https://alertyai.com';

  const routes = [
    '',
    '/dashboard',
    '/tasks',
    '/reminders',
    '/teams',
    '/calendar',
    '/privacy',
    '/faqs',
    '/login',
    '/register',
    '/ai-assistant',
    '/opportunities',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/dashboard' ? 0.9 : 0.7,
  }));

  return routes;
}
