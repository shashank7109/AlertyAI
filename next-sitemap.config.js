/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://alertyai.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/api/*', '/dashboard/*', '/admin/*', '/_next/*', '/404', '/500'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/dashboard/', '/admin/'] },
    ],
    additionalSitemaps: [
      'https://alertyai.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    let priority = 0.5
    let changefreq = 'weekly'

    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path.startsWith('/features')) {
      priority = 0.9
    } else if (path === '/pricing') {
      priority = 0.9
    } else if (path.startsWith('/compare')) {
      priority = 0.85
    } else if (path.startsWith('/blog') || path.startsWith('/changelog')) {
      priority = 0.8
      changefreq = 'daily'
    } else if (path.startsWith('/use-cases')) {
      priority = 0.75
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
