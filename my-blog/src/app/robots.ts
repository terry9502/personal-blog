export const dynamic = 'force-static'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/admin/', '/search?*'],
    },
    sitemap: 'https://niutr.cn/sitemap.xml',
  }
}