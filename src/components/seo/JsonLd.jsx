export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
      },
      {
        "@type": "Organization",
        "name": "AlertyAI",
        "alternateName": "Alerty AI",
        "url": "https://alertyai.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://alertyai.com/alerty-icon.png",
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
      },
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
            "urlTemplate": "https://alertyai.com/blogs?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
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
              "text": "You simply type or speak your thoughts into AlertyAI. The AI engine automatically structures them into organised tasks with priorities, deadlines, and actionable steps - no manual formatting needed."
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
      },
      {
        "@type": "MobileApplication",
        "name": "AlertyAI",
        "operatingSystem": "Android",
        "applicationCategory": "LifestyleApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "url": "https://play.google.com/store/apps/details?id=com.alertyai.app"
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
