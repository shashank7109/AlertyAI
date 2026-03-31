export function buildMetadata(page) {
  const defaultTitle = 'AlertyAI — Turn Your Thoughts Into Tasks Instantly'
  const finalTitle = page.title || defaultTitle
  const finalDescription = page.description || 'AlertyAI uses AI to convert raw thoughts into structured tasks and actionable plans. Smart reminders, team collaboration, zero friction. Free on Android.'
  const url = page.slug ? `https://alertyai.com/${page.slug}` : 'https://alertyai.com'
  const imageUrl = page.ogImage || 'https://alertyai.com/alerty-icon.png'

  const metadata = {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      type: 'website',
      siteName: 'AlertyAI',
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [imageUrl],
      creator: '@alertyai',
    },
  }

  if (page.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    }
  }

  if (page.keywords) {
    metadata.keywords = page.keywords
  }

  return metadata
}
