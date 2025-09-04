// src/app/blog/[slug]/page.tsx
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { getRelatedPosts } from '@/lib/relatedPosts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import MDXComponents from '@/components/MDXComponents'
import RelatedPosts from '@/components/RelatedPosts'
import SocialShare from '@/components/SocialShare'
import CompactShareButtons from '@/components/CompactShareButtons'
import dynamic from 'next/dynamic'
import ReadingProgress from '@/components/ReadingProgress'
import TableOfContents from '@/components/TableOfContents'
import { ArticleSchema } from '@/components/StructuredData'

// 简化的动态导入
const Comments = dynamic(() => import('@/components/Comments'))

interface PageProps {
  params: Promise<{ slug: string }>
}

// 修改主要的组件函数，添加结构化数据
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  
  try {
    const post = getPostBySlug(slug)
    const allPosts = getAllPosts()
    const relatedPosts = getRelatedPosts(post, allPosts, 3)
    
    return (
      <>
        {/* 添加结构化数据 */}
        <ArticleSchema 
          post={post} 
          siteUrl="https://niutr.cn"
          authorName="Niutr"
          siteName="Niutr's Blog"
        />
        
        <ReadingProgress/>
        <TableOfContents/>
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <div className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="mr-1" size={16} />
              返回博客列表
            </Link>
          </div>

          {/* 面包屑导航 - 有助于SEO */}
          <nav className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            <Link href="/" className="hover:text-blue-600">首页</Link>
            <span className="mx-2">›</span>
            <Link href="/blog" className="hover:text-blue-600">博客</Link>
            <span className="mx-2">›</span>
            <span className="text-slate-900 dark:text-slate-100">{post.title}</span>
          </nav>

          <article>
            <header className="mb-12">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 text-sm mb-6">
                {/* 发布日期 */}
                <time dateTime={post.date} className="flex items-center">
                  <Calendar className="mr-1" size={16} />
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                
                {/* 更新时间 */}
                {post.updatedAt && (
                  <time dateTime={post.updatedAt} className="flex items-center">
                    <Calendar className="mr-1" size={16} />
                    更新于 {new Date(post.updatedAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric'
                    })}
                  </time>
                )}
                
                {/* 阅读时间 */}
                <div className="flex items-center">
                  <Clock className="mr-1" size={16} />
                  {post.readingTime.text}
                </div>
                
                {/* 字数统计 */}
                <div className="flex items-center">
                  {post.readingTime.words} 字
                </div>
              </div>
              
              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Tag className="mr-1" size={12} />
                    {tag}
                  </Link>
                ))}
              </div>
            </header>

            {/* 文章内容保持原样 */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <MDXRemote 
                source={post.content} 
                components={MDXComponents}
              />
            </div>

          </article>

          {/* 相关文章 */}
          <RelatedPosts relatedPosts={relatedPosts} />

          {/* 评论区 */}
          <Comments slug={slug} />

          {/* 文章底部分享 */}
          <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                觉得这篇文章有用？
              </h3>
              <div className="flex flex-col items-center gap-4">
                <CompactShareButtons
                  title={post.title}
                  description={post.description}
                />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  分享给更多需要的朋友，让知识传递下去！ ❤️
                </p>
              </div>
            </div>
          </footer>
        </div>
      </>
    )
  } catch (error) {
    notFound()
  }
}

// 生成静态路径保持不变
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 生成元数据
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  
  try {
    const post = getPostBySlug(slug)
    
    // 生成图片URL
    const imageUrl = post.coverImage 
      ? (post.coverImage.startsWith('http') 
          ? post.coverImage 
          : `https://niutr.cn${post.coverImage.startsWith('/') ? '' : '/'}${post.coverImage}`)
      : `https://niutr.cn/images/default-blog-cover.jpg`
    
    return {
      title: `${post.title} | Niutr's Blog`,
      description: post.description,
      keywords: post.tags,
      authors: [{ name: 'Niutr' }],
      creator: 'Niutr',
      publisher: "Niutr's Blog",
      
      // Open Graph
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.updatedAt || post.date,
        url: `https://niutr.cn/blog/${slug}`,
        tags: post.tags,
        authors: ['Niutr'],
        siteName: "Niutr's Blog",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ],
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: [imageUrl],
        creator: '@your_twitter_handle', // 如果您有Twitter账号可以添加
      },
      
      // SEO优化
      alternates: {
        canonical: post.canonical || `https://niutr.cn/blog/${slug}`,
      },
      
      // robots控制
      robots: {
        index: !post.noindex,
        follow: !post.noindex,
        googleBot: {
          index: !post.noindex,
          follow: !post.noindex,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  } catch (error) {
    return {
      title: '文章未找到',
    }
  }
}