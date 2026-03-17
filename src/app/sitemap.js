/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

export default function sitemap() {
  const baseUrl = 'https://smaranai.com'; // Replace with production domain

  // Define static routes
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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
