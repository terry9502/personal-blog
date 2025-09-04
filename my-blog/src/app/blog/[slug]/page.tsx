// src/app/blog/[slug]/page.tsx
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { getRelatedPosts } from '@/lib/relatedPosts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import RelatedPosts from '@/components/RelatedPosts'
import SocialShare from '@/components/SocialShare'
import CompactShareButtons from '@/components/CompactShareButtons'
import dynamic from 'next/dynamic'
import ReadingProgress from '@/components/ReadingProgress'
import TableOfContents from '@/components/TableOfContents'
import { ArticleSchema } from '@/components/StructuredData'
import EnhancedMarkdownRenderer from '@/components/EnhancedMarkdownRenderer'

// 简化的动态导入
const Comments = dynamic(() => import('@/components/Comments'))

interface PageProps {
  params: Promise<{ slug: string }>
}

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
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              返回博客列表
            </Link>
          </div>

          <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-12">
            {/* 文章标题 */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(post.date).toLocaleDateString('zh-CN')}
                </span>
                
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {post.readingTime.text}
                </span>
                
                {post.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    {post.tags.map(tag => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* 文章内容 - 使用新的 EnhancedMarkdownRenderer */}
            <EnhancedMarkdownRenderer 
              content={post.content} 
              className="mb-12"
            />
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
    
    return {
      title: `${post.title} | Niutr's Blog`,
      description: post.description,
      authors: [{ name: 'Niutr' }],
      keywords: post.tags,
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.date,
        authors: ['Niutr'],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
      },
    }
  } catch (error) {
    return {
      title: '文章未找到',
    }
  }
}