interface WebsiteSchemaProps {
  siteUrl?: string
  siteName?: string
  siteDescription?: string
  authorName?: string
}

export function WebsiteSchema({
  siteUrl = 'https://niutr.cn',
  siteName = "Niutr's Blog",
  siteDescription = '专注前端开发技术分享的个人博客',
  authorName = 'Niutr'
}: WebsiteSchemaProps) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "description": siteDescription,
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": `${siteUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "inLanguage": "zh-CN"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(websiteSchema, null, 2) 
      }}
    />
  )
}