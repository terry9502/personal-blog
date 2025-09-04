import { PostData } from '@/lib/blog'

interface ArticleSchemaProps {
  post: PostData
  siteUrl?: string
  authorName?: string
  siteName?: string
}

export function ArticleSchema({ 
  post, 
  siteUrl = 'https://niutr.cn', // 使用您现有域名
  authorName = 'Niutr',
  siteName = "Niutr's Blog"
}: ArticleSchemaProps) {
  const articleUrl = `${siteUrl}/blog/${post.slug}`
  
  // 生成封面图片URL
  const getImageUrl = () => {
    if (post.coverImage) {
      if (post.coverImage.startsWith('http')) {
        return post.coverImage
      }
      return `${siteUrl}${post.coverImage.startsWith('/') ? '' : '/'}${post.coverImage}`
    }
    // 默认图片
    return `${siteUrl}/images/default-blog-cover.jpg`
  }
  
  // BlogPosting 结构化数据
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": getImageUrl(),
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
        "url": `${siteUrl}/images/logo.png`
      }
    },
    "datePublished": post.date,
    "dateModified": post.updatedAt || post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "url": articleUrl,
    "keywords": post.tags.join(", "),
    "wordCount": post.readingTime.words,
    "timeRequired": `PT${Math.ceil(post.readingTime.minutes)}M`,
    "inLanguage": "zh-CN",
    "isAccessibleForFree": true,
    "genre": post.tags,
    "about": post.tags.map(tag => ({
      "@type": "Thing",
      "name": tag
    }))
  }

  // BreadcrumbList 结构化数据
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首页",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "博客",
        "item": `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": articleUrl
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(articleSchema, null, 2) 
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(breadcrumbSchema, null, 2) 
        }}
      />
    </>
  )
}