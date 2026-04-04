# ALERTYAI — PRODUCTION SEO IMPLEMENTATION
# Model: Gemini 2.5 Pro via Antigravity
# Mode: Full implementation. No scaffolding. No placeholders. Ship-ready code only.

---

## IDENTITY LOCK

Product: AlertyAI
Type: AI-powered productivity + task management app
Core value: Converts raw user thoughts → structured tasks + actionable plans
Features: AI task creation, smart reminders, push notifications, team collaboration
Platforms: Android app (Google Play Store) + Next.js marketing website
Builder: Shashank Bindal
Domain: https://alertyai.com
Play Store: https://play.google.com/store/apps/details?id=com.alertyai.app [UPDATE WITH REAL ID]
Stack: Next.js 14 App Router · TypeScript · Tailwind CSS · deployed on Vercel

Do not hallucinate features. Do not reference any other product named "Alerty".
AlertyAI is solely the product described above. Hold this definition for the entire session.

---

## MISSION

Implement complete white-hat technical SEO for alertyai.com so that:
1. Google crawls and indexes every page correctly
2. Real users land organically — zero paid traffic
3. Play Store app appears in Google search results via app schema
4. Cookie consent gate is GDPR-compliant and unblocks Google Analytics
5. Core Web Vitals pass — LCP < 2.5s, CLS < 0.1, INP < 200ms

Output every file completely. No "// add your code here". Real working TypeScript.

---

## PHASE 0 — INSTALL (run once)

```bash
npm install next-sitemap next-seo schema-dts sharp @next/third-parties
npm install -D @types/gtag.js
```

Confirm: next-sitemap generates sitemap.xml + robots.txt at build time.
Confirm: @next/third-parties provides <GoogleAnalytics> with Partytown offloading.
Confirm: schema-dts gives TypeScript types for all JSON-LD schemas.
Confirm: sharp is required by next/image for production image optimisation.

---

## PHASE 1 — GOOGLE INDEXING FOUNDATION

### FILE: `next.config.ts`

Output the complete next.config.ts with:

```ts
// Required SEO-critical settings:
// 1. images.formats: ['image/avif', 'image/webp'] — modern formats for LCP
// 2. images.remotePatterns: allow alertyai.com and play.google.com
// 3. headers() async function returning:
//    - X-Robots-Tag: index, follow  (for all routes)
//    - X-Content-Type-Options: nosniff
//    - X-Frame-Options: DENY
//    - Referrer-Policy: strict-origin-when-cross-origin
//    - Permissions-Policy: camera=(), microphone=(), geolocation=()
// 4. redirects() — www to non-www canonical redirect
// 5. compress: true
// 6. poweredByHeader: false
// 7. trailingSlash: false (canonical URL consistency)
```

---

### FILE: `next-sitemap.config.js` (project root)

```js
// Output complete config with:
// siteUrl: 'https://alertyai.com'
// generateRobotsTxt: true
// sitemapSize: 5000
// changefreq rules per route pattern:
//   /          → daily,   priority 1.0
//   /features* → weekly,  priority 0.9
//   /pricing   → weekly,  priority 0.9
//   /compare/* → weekly,  priority 0.85
//   /blog/*    → daily,   priority 0.8
//   /use-cases/* → weekly, priority 0.75
//   /about     → monthly, priority 0.5
//   /changelog → weekly,  priority 0.6
// exclude: ['/api/*', '/dashboard/*', '/admin/*', '/_next/*', '/404', '/500']
// robotsTxtOptions:
//   policies: [{ userAgent: '*', allow: '/' }, { userAgent: '*', disallow: ['/api/', '/dashboard/', '/admin/'] }]
//   additionalSitemaps: ['https://alertyai.com/server-sitemap.xml']
// transform: async (config, path) => { ...return custom priority per path }
```

---

### FILE: `app/robots.ts` (Next.js 14 native — supercedes robots.txt for App Router)

```ts
// Use Next.js MetadataRoute.Robots
// Rules: allow all Googlebot, Bingbot, allow /
// Disallow: /api/, /dashboard/, /admin/
// Sitemap: https://alertyai.com/sitemap.xml
// Host: https://alertyai.com
```

---

### FILE: `app/sitemap.ts` (dynamic server sitemap)

```ts
// MetadataRoute.Sitemap
// Static routes: /, /features, /features/ai-tasks, /features/reminders,
//   /features/teams, /pricing, /about, /compare, /changelog
// Compare routes: ['notion','todoist','asana','any.do','ticktick'].map(tool => /compare/${tool})
// Use-case routes: ['students','freelancers','small-teams','solopreneurs'].map(s => /use-cases/${s})
// Blog routes: fetch from your CMS or local MDX files — map to /blog/[slug]
// Each entry: { url, lastModified: new Date(), changeFrequency, priority }
```

---

## PHASE 2 — METADATA ENGINE

### FILE: `app/layout.tsx`

Output the complete root layout with this exact Metadata export:

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://alertyai.com'),
  title: {
    default: 'AlertyAI — Turn Your Thoughts Into Tasks Instantly',
    template: '%s | AlertyAI'
  },
  description: 'AlertyAI uses AI to convert raw thoughts into structured tasks and actionable plans. Smart reminders, team collaboration, zero friction. Free on Android.',
  keywords: [
    'ai task manager', 'ai productivity app', 'thought to task ai',
    'ai to-do list app', 'smart task planner', 'ai reminder app',
    'task management app android', 'alertyai', 'convert thoughts to tasks',
    'ai planning app', 'task organiser ai', 'productivity app free'
  ],
  authors: [{ name: 'Shashank Bindal', url: 'https://alertyai.com' }],
  creator: 'Shashank Bindal',
  publisher: 'AlertyAI',
  category: 'productivity',
  classification: 'Business/Productivity',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alertyai.com',
    siteName: 'AlertyAI',
    title: 'AlertyAI — Turn Your Thoughts Into Tasks Instantly',
    description: 'AI that converts your thoughts into structured tasks and plans. Smart reminders, team features. Free on Android.',
    images: [{
      url: 'https://alertyai.com/og-default.png',
      width: 1200,
      height: 630,
      alt: 'AlertyAI — AI Task Manager App'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlertyAI — AI-Powered Task Manager',
    description: 'Turn thoughts into tasks instantly. Free on Android.',
    images: ['https://alertyai.com/og-default.png'],
    creator: '@alertyai'
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: 'https://alertyai.com',
    languages: { 'en-US': 'https://alertyai.com' }
  },
  verification: {
    google: 'PASTE_GOOGLE_SEARCH_CONSOLE_TOKEN_HERE',
    yandex: 'PASTE_IF_NEEDED'
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#6366f1' }]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AlertyAI'
  },
  other: {
    'google-play-app': 'app-id=com.alertyai.app'
  }
}
```

Body must include:
- `<ConsentProvider>` wrapping everything
- `<JsonLd />` in head via `<head>` slot
- `<CookieBanner />` as first child of body
- `<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />` rendered only when consent === 'accepted'
- `<Analytics />` from @vercel/analytics always rendered (privacy-safe, no cookies)

---

## PHASE 3 — STRUCTURED DATA (JSON-LD)

### FILE: `components/seo/JsonLd.tsx`

Output a single component that injects one `<script type="application/ld+json">` with a `@graph` array containing ALL 5 schemas below. Use `schema-dts` types throughout.

#### Schema 1 — SoftwareApplication (triggers Play Store rich result)
```json
{
  "@type": "SoftwareApplication",
  "name": "AlertyAI",
  "applicationCategory": "ProductivityApplication",
  "applicationSubCategory": "TaskManagement",
  "operatingSystem": "Android 6.0+",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "downloadUrl": "https://play.google.com/store/apps/details?id=com.alertyai.app",
  "installUrl": "https://play.google.com/store/apps/details?id=com.alertyai.app",
  "author": { "@type": "Person", "name": "Shashank Bindal" },
  "description": "AlertyAI converts your raw thoughts into structured tasks and actionable plans using AI. Features smart reminders, push notifications, and team collaboration.",
  "featureList": "AI task creation, Smart reminders, Push notifications, Team collaboration, Actionable planning",
  "screenshot": "https://alertyai.com/screenshot-1.png",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5"
  },
  "softwareVersion": "1.0.0",
  "datePublished": "2024-01-01",
  "inLanguage": "en"
}
```

#### Schema 2 — Organization
```json
{
  "@type": "Organization",
  "name": "AlertyAI",
  "alternateName": "Alerty AI",
  "url": "https://alertyai.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://alertyai.com/logo.png",
    "width": 512,
    "height": 512
  },
  "founder": {
    "@type": "Person",
    "name": "Shashank Bindal",
    "jobTitle": "Founder"
  },
  "foundingDate": "2024",
  "description": "AlertyAI builds AI-powered productivity tools that turn thoughts into tasks.",
  "sameAs": [
    "https://play.google.com/store/apps/details?id=com.alertyai.app"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "availableLanguage": "English"
  }
}
```

#### Schema 3 — WebSite (Sitelinks Search Box)
```json
{
  "@type": "WebSite",
  "name": "AlertyAI",
  "url": "https://alertyai.com",
  "description": "AI-powered task manager that turns thoughts into structured plans",
  "inLanguage": "en-US",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://alertyai.com/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

#### Schema 4 — FAQPage (homepage FAQ section — drives rich snippets)
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is AlertyAI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AlertyAI is an AI-powered productivity app that transforms your raw thoughts and ideas into structured tasks and actionable plans. It includes smart reminders, push notifications, and team collaboration features."
      }
    },
    {
      "@type": "Question",
      "name": "Is AlertyAI free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, AlertyAI is free to download and use on Android. It is available on the Google Play Store."
      }
    },
    {
      "@type": "Question",
      "name": "How does AlertyAI use AI to create tasks?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You simply type or speak your thoughts into AlertyAI. The AI engine automatically structures them into organised tasks with priorities, deadlines, and actionable steps — no manual formatting needed."
      }
    },
    {
      "@type": "Question",
      "name": "Does AlertyAI support team collaboration?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. AlertyAI supports small team collaboration, allowing you to share tasks, assign responsibilities, and track progress together."
      }
    },
    {
      "@type": "Question",
      "name": "Is AlertyAI available on iPhone or iOS?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AlertyAI is currently available on Android via the Google Play Store. iOS support is planned for a future release."
      }
    }
  ]
}
```

#### Schema 5 — MobileApplication (reinforces Play Store signal)
```json
{
  "@type": "MobileApplication",
  "name": "AlertyAI",
  "operatingSystem": "Android",
  "applicationCategory": "LifestyleApplication",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://play.google.com/store/apps/details?id=com.alertyai.app"
}
```

---

## PHASE 4 — COOKIE CONSENT + ANALYTICS GATE

### FILE: `context/ConsentContext.tsx`

```ts
// Requirements:
// - createContext with shape: { consent: 'accepted' | 'rejected' | 'pending', accept: ()=>void, reject: ()=>void, reset: ()=>void }
// - On mount: read document.cookie for 'alertyai_consent'
//   if found → set state to its value
//   if not found → state = 'pending' (banner shows)
// - accept(): set cookie alertyai_consent=accepted; max-age=31536000; path=/; SameSite=Lax; Secure
//   then push window.dataLayer event: { event: 'consent_update', analytics_storage: 'granted' }
//   then call window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied' })
// - reject(): set cookie alertyai_consent=rejected; max-age=31536000; path=/; SameSite=Lax; Secure
//   then call window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' })
// - reset(): delete cookie, set state back to 'pending'
// - Export useConsent() hook that throws if used outside provider
```

---

### FILE: `components/seo/CookieBanner.tsx`

```tsx
// Requirements:
// - 'use client'
// - Read consent from useConsent()
// - Only render when consent === 'pending'
// - Layout: fixed bottom-0 left-0 right-0 z-[9999]
// - Background: bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700
// - Content:
//   Left: icon (shield or cookie SVG inline, 20px) + text:
//     "We use cookies to understand how you use AlertyAI and improve your experience."
//     + <a href="/privacy" className="underline">Privacy Policy</a>
//   Right: 3 buttons:
//     [Manage] → ghost, opens <PreferencesModal />
//     [Reject] → outline button
//     [Accept All] → filled primary button (bg-indigo-600 text-white)
// - Mobile: stack vertically, buttons full-width
// - No animation libraries. CSS transition only: translate-y-full → translate-y-0 on mount
// - Accessible: role="region" aria-label="Cookie consent" aria-live="polite"

// PreferencesModal (inline in same file):
// - Overlay: fixed inset-0 bg-black/40 z-[10000]
// - Modal: centered card max-w-md
// - Three toggle rows:
//   1. Essential cookies — always ON, toggle disabled, label "Required for the site to work"
//   2. Analytics cookies — default OFF unless accepted, label "Help us understand usage"
//   3. Marketing cookies — always OFF for now, toggle disabled, label "Coming soon"
// - [Save preferences] button → calls accept() if analytics toggled on, else reject()
// - [Cancel] closes modal
// - Trap focus inside modal when open (use useEffect + keydown listener)
```

---

### FILE: `app/layout.tsx` — GA integration pattern

```tsx
// In layout body, after CookieBanner:

// 1. Default consent mode (fires before GA loads — tells Google consent state)
<Script id="consent-default" strategy="beforeInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      wait_for_update: 500
    });
  `}
</Script>

// 2. Load GA only if consent === 'accepted'
// Use a client component wrapper <AnalyticsLoader /> that:
//   - reads useConsent()
//   - if accepted: renders <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
//   - if pending/rejected: renders null
//   This way GA script never loads until user explicitly accepts

// 3. process.env.NEXT_PUBLIC_GA_ID must be set in .env.local:
// NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

### FILE: `components/seo/AnalyticsLoader.tsx`

```tsx
'use client'
// Reads consent from useConsent()
// When consent changes to 'accepted':
//   - dynamically import and render <GoogleAnalytics gaId={gaId} />
//   - fire gtag consent update: analytics_storage: 'granted'
// When consent is 'rejected' or 'pending': render null
// Use React.lazy + Suspense pattern for dynamic import
// This is the ONLY place GA loads — never import GoogleAnalytics in layout directly
```

---

## PHASE 5 — PER-PAGE METADATA (generateMetadata pattern)

### PATTERN: Use this exact generateMetadata factory for every page

```ts
// FILE: lib/seo/metadata.ts
// Export a function: buildMetadata(page: PageSEOConfig): Metadata
// PageSEOConfig type:
type PageSEOConfig = {
  title: string           // page title WITHOUT " | AlertyAI" — template handles it
  description: string     // 140-160 chars. Specific. Action-oriented.
  slug: string            // e.g. 'features/ai-tasks'
  ogImage?: string        // defaults to /og-default.png
  noIndex?: boolean       // for /thank-you, /dashboard etc
  keywords?: string[]
}

// Returns Metadata object with:
// - title, description, keywords
// - canonical: https://alertyai.com/${slug}
// - openGraph with correct url and image
// - twitter card
// - robots: noIndex if flagged
```

### PAGES — generate these metadata outputs using buildMetadata():

| Page | Title | Description |
|------|-------|-------------|
| / | Turn Your Thoughts Into Tasks Instantly | AlertyAI uses AI to convert your thoughts into structured tasks and plans. Smart reminders, team collaboration. Free on Android. |
| /features | AlertyAI Features — AI Tasks, Reminders & Teams | Explore AlertyAI's AI task creation, smart reminders, push notifications, and team collaboration features. |
| /features/ai-tasks | AI Task Creation — From Thought to Task in Seconds | Type your thought. AlertyAI's AI structures it into a task instantly. No formatting, no friction. |
| /features/reminders | Smart Reminders That Actually Help You Execute | AlertyAI sends context-aware reminders so you never drop a task. AI-powered, not annoying. |
| /features/teams | Team Task Collaboration for Small Teams | Share tasks, assign work, and track progress with AlertyAI's lightweight team collaboration tools. |
| /pricing | AlertyAI Pricing — Free to Start, No Credit Card | AlertyAI is free. See what's included and what's coming in paid plans. |
| /compare/notion | AlertyAI vs Notion — Which Is Better for Tasks? | Notion is powerful but complex. AlertyAI is laser-focused on turning thoughts into tasks with AI. |
| /compare/todoist | AlertyAI vs Todoist — AI Task Creation vs Manual Entry | Todoist requires manual input. AlertyAI uses AI to create and structure tasks from your thoughts. |
| /use-cases/students | AlertyAI for Students — AI Study & Task Planner | Turn lecture notes and assignment thoughts into organised tasks instantly. Free for students. |
| /use-cases/freelancers | AlertyAI for Freelancers — AI Task & Project Planner | Manage client work, deadlines, and ideas without the overhead. AI organises it for you. |
| /use-cases/small-teams | AlertyAI for Small Teams — Lightweight Task Management | Small teams move fast. AlertyAI keeps tasks structured without bloated project management tools. |
| /blog | AlertyAI Blog — Productivity Tips & AI Task Management | Guides, tips, and insights on AI-powered productivity, task management, and getting things done. |

---

## PHASE 6 — BLOG SEO (MDX + generateMetadata)

### FILE: `app/blog/[slug]/page.tsx`

```ts
// generateMetadata: fetch post frontmatter, return buildMetadata() with:
//   - title: post.title
//   - description: post.excerpt
//   - slug: `blog/${post.slug}`
//   - ogImage: post.coverImage || '/og-blog-default.png'

// generateStaticParams: return all blog slugs for static generation

// Article JSON-LD (inject per post):
{
  "@type": "Article",
  "headline": post.title,
  "description": post.excerpt,
  "author": { "@type": "Person", "name": "Shashank Bindal" },
  "publisher": { "@type": "Organization", "name": "AlertyAI", "logo": { "@type": "ImageObject", "url": "https://alertyai.com/logo.png" } },
  "datePublished": post.publishedAt,
  "dateModified": post.updatedAt,
  "image": post.coverImage,
  "mainEntityOfPage": { "@type": "WebPage", "@id": `https://alertyai.com/blog/${post.slug}` }
}
```

### Blog post topics to write (high organic intent, low competition):
```
1. "How to stop losing good ideas" — intent: frustrated note-takers
2. "Best AI task manager apps for Android 2025" — intent: comparison shopper
3. "How to turn your thoughts into an action plan" — intent: productivity seeker
4. "AI productivity apps that actually work" — intent: skeptical buyer
5. "Notion vs simpler tools — when simplicity wins" — intent: Notion fatigue
6. "How to manage tasks as a freelancer without burnout" — intent: freelancer
7. "Best reminder apps for Android that use AI" — intent: Play Store searcher
8. "Getting things done with AI — a beginner's guide" — intent: GTD + AI curious
```

---

## PHASE 7 — CORE WEB VITALS

### Required implementations for passing CWV:

```ts
// 1. next/image everywhere — no raw <img> tags
//    All hero images: priority={true}, sizes="100vw"
//    Below-fold images: loading="lazy" (default), sizes="(max-width: 768px) 100vw, 50vw"

// 2. next/font — load fonts at build time, not runtime
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
// Apply via className to <html> tag, NOT via @import in CSS

// 3. Preconnect hints in layout <head>:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://play.google.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />

// 4. Dynamic imports for heavy components:
const HeavyFeatureSection = dynamic(() => import('./HeavyFeatureSection'), {
  loading: () => <Skeleton />,
  ssr: false  // only if not needed for SEO
})

// 5. Reserve space for all images/embeds to prevent CLS:
//    Always set width + height on next/image
//    Always set min-height on sections that load async content

// 6. Play Store badge — use next/image, not <img>:
<Image
  src="/google-play-badge.png"
  alt="Get AlertyAI on Google Play"
  width={200}
  height={60}
  priority={true}
/>
```

---

## PHASE 8 — GOOGLE SEARCH CONSOLE SETUP CHECKLIST

```
After deploying, do these in order:

1. Add property: https://alertyai.com in Google Search Console
2. Verify via HTML tag → paste token into metadata.verification.google
3. Submit sitemap: https://alertyai.com/sitemap.xml
4. Submit sitemap: https://alertyai.com/server-sitemap.xml
5. Request indexing for: /, /features, /pricing, /compare/*, /use-cases/*
6. Check Coverage report — fix any "Discovered but not indexed" pages
7. Check Core Web Vitals report — fix any red pages
8. Set up GA4 property → link to Search Console for keyword data
9. Add Play Store app to Search Console → enables app indexing signals
10. Enable URL Inspection for homepage → verify structured data detected
```

---

## PHASE 9 — PLAY STORE → WEBSITE LINK SIGNALS

```ts
// FILE: public/assetlinks.json
// Required for Android App Links (Google associates website + app):
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.alertyai.app",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
  }
}]

// FILE: app/well-known/assetlinks.json/route.ts
// Serve the above at /.well-known/assetlinks.json
export async function GET() {
  return Response.json([{ ... }])
}

// In next.config.ts headers():
// Add: { source: '/.well-known/assetlinks.json', headers: [{ key: 'Content-Type', value: 'application/json' }] }
```

---

## PHASE 10 — COMPLETE FILE OUTPUT ORDER

Generate files in this exact order. Complete each file before starting the next.
Do not summarise. Do not truncate. Output 100% of each file.

```
1.  next.config.ts
2.  next-sitemap.config.js
3.  app/robots.ts
4.  app/sitemap.ts
5.  lib/seo/metadata.ts
6.  context/ConsentContext.tsx
7.  components/seo/JsonLd.tsx
8.  components/seo/CookieBanner.tsx
9.  components/seo/AnalyticsLoader.tsx
10. app/layout.tsx
11. app/page.tsx (homepage with generateMetadata + FAQ section for FAQ schema)
12. app/features/page.tsx
13. app/pricing/page.tsx
14. app/compare/[tool]/page.tsx
15. app/use-cases/[segment]/page.tsx
16. app/blog/[slug]/page.tsx
17. app/well-known/assetlinks.json/route.ts
18. public/manifest.json
19. .env.local.example
```

---

## QUALITY GATES

Before outputting any file, verify:
- [ ] No `<img>` tags — only `<Image>` from next/image
- [ ] No hardcoded font @import — only next/font
- [ ] Every page has unique title + description (no duplicates)
- [ ] canonical URL set on every page
- [ ] JSON-LD present on homepage, blog posts, compare pages
- [ ] Cookie consent never blocks page render — it overlays
- [ ] GA does not load until consent === 'accepted'
- [ ] gtag consent default fires BEFORE GA script loads
- [ ] robots.ts disallows /api/ /dashboard/ /admin/
- [ ] sitemap.ts includes ALL public routes
- [ ] assetlinks.json served at /.well-known/assetlinks.json

---

## SESSION RULES FOR GEMINI

- Hold the AlertyAI product definition above for the entire session
- Never generate incomplete files — if a file is long, continue without being asked
- Never add TODOs unless it's a secret key the user must paste
- Use TypeScript strict mode throughout
- Tailwind CSS for all styling — no CSS modules, no styled-components
- App Router only — no pages/ directory patterns
- All client components must have 'use client' at top
- All server components must have no 'use client' (default)
- When you finish all 19 files, output a final deployment checklist

BEGIN. Start with File 1: next.config.ts