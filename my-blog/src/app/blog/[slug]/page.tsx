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

          {/* 置顶文章标识 */}
          {post.pinned && (
            <div className="mb-6 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 border border-yellow-300 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center text-yellow-800 dark:text-yellow-200">
                <span className="text-lg mr-2">📌</span>
                <span className="font-medium">置顶文章</span>
              </div>
            </div>
          )}

          {/* 文章头部 */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
              {post.description}
            </p>
            
            {/* 文章元信息 */}
            <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400 mb-6">
              <div className="flex items-center">
                <Calendar className="mr-2" size={18} />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2" size={18} />
                <span>{post.readingTime.text}</span>
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <Tag className="mr-1" size={12} />
                  {tag}
                </Link>
              ))}
            </div>

            {/* 分享按钮 */}
            <SocialShare 
              title={post.title} 
              description={post.description}
            />
          </header>

          {/* 文章内容 */}
          <article className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <EnhancedMarkdownRenderer content={post.content} />
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

// 移除静态路径生成，改为动态路由
// export async function generateStaticParams() {
//   const posts = getAllPosts()
//   return posts.map((post) => ({
//     slug: post.slug,
//   }))
// }

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