import { getAllPosts } from '@/lib/blog'
import { generatePostSummary, escapeXml, defaultRssConfig } from '@/lib/rss'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const posts = getAllPosts()
    const config = defaultRssConfig
    
    // 生成RSS 2.0 格式的XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title><![CDATA[${config.title}]]></title>
    <description><![CDATA[${config.description}]]></description>
    <link>${config.siteUrl}</link>
    <language>${config.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()}</pubDate>
    <generator>Next.js Blog RSS Generator</generator>
    <webMaster>${config.author.email} (${config.author.name})</webMaster>
    <managingEditor>${config.author.email} (${config.author.name})</managingEditor>
    <copyright><![CDATA[${config.copyright}]]></copyright>
    <category><![CDATA[技术]]></category>
    <category><![CDATA[博客]]></category>
    <category><![CDATA[软件工程]]></category>
    
    <!-- RSS自引用链接 -->
    <atom:link href="${config.feedUrl}" rel="self" type="application/rss+xml" />
    
    <!-- 网站Logo -->
    <image>
      <title><![CDATA[${config.title}]]></title>
      <url>${config.siteUrl}/favicon.ico</url>
      <link>${config.siteUrl}</link>
      <width>144</width>
      <height>144</height>
      <description><![CDATA[${config.description}]]></description>
    </image>
    
    <!-- 文章项目 -->
${posts.map(post => {
  const postUrl = `${config.siteUrl}/blog/${post.slug}`
  const pubDate = new Date(post.date).toUTCString()
  const summary = generatePostSummary(post.content, 300)
  
  return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${config.author.email} (${config.author.name})</author>
      
      <!-- 文章分类标签 -->
${post.tags.map(tag => `      <category><![CDATA[${tag}]]></category>`).join('\n')}
      
      <!-- 文章完整内容 -->
      <content:encoded><![CDATA[
        <article style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 800px;">
          <header style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #e5e7eb;">
            <h1 style="font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 1rem;">${escapeXml(post.title)}</h1>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.875rem; color: #6b7280;">
              <span>📅 ${new Date(post.date).toLocaleDateString('zh-CN')}</span>
              <span>⏱️ ${post.readingTime.text}</span>
              <span>🏷️ ${post.tags.join(', ')}</span>
            </div>
          </header>
          
          <main style="margin-bottom: 2rem;">
            <p style="margin-bottom: 1rem; font-size: 1.125rem; color: #4b5563;">${escapeXml(post.description)}</p>
            <div style="background: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
              ${escapeXml(summary)}
            </div>
          </main>
          
          <footer style="text-align: center; padding: 1.5rem; background: #f3f4f6; border-radius: 0.5rem;">
            <p style="margin-bottom: 1rem; color: #6b7280;">
              这只是文章的摘要，阅读完整内容请访问博客网站：
            </p>
            <a href="${postUrl}" 
               style="display: inline-block; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">
              📖 阅读完整文章
            </a>
          </footer>
        </article>
      ]]></content:encoded>
      
      <!-- Dublin Core 元数据 -->
      <dc:creator>${config.author.name}</dc:creator>
      <dc:date>${new Date(post.date).toISOString()}</dc:date>
      <dc:language>${config.language}</dc:language>
      <dc:rights>${config.copyright}</dc:rights>
      <dc:subject>${post.tags.join(', ')}</dc:subject>
    </item>`
}).join('\n')}
    
  </channel>
</rss>`.trim()

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
        'X-RSS-Generator': 'Next.js Blog'
      },
    })
  } catch (error) {
    console.error('RSS生成错误:', error)
    return new NextResponse('RSS Feed生成失败', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    })
  }
}