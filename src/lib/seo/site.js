/**
 * SEO-related environment values (set in production hosting, e.g. Vercel).
 * NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: value from Google Search Console meta tag content
 * NEXT_PUBLIC_GA_MEASUREMENT_ID: optional G-XXXXXXXX for @next/third-parties Google Analytics
 */
export function getGoogleSiteVerification() {
  const v = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
  if (!v || v === 'add-your-google-verification-code') return undefined
  return v
}

export function getGaMeasurementId() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  return id || undefined
}
