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

        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 text-sm mb-6">
            <div className="flex items-center">
              <Calendar className="mr-1" size={16} />
              {new Date(post.date).toLocaleDateString('zh-CN')}
            </div>
            <div className="flex items-center">
              <Clock className="mr-1" size={16} />
              {post.readingTime.text}
            </div>
            <div className="flex items-center gap-2">
              <Tag className="mr-1" size={16} />
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* 文章顶部分享按钮 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-t border-b border-slate-200 dark:border-slate-700">
            <CompactShareButtons
              title={post.title}
              description={post.description}
              className=""
            />
            <SocialShare
              title={post.title}
              description={post.description}
              className=""
            />
          </div>
        </header>

        {/* 文章内容部分 - 确保用 article 标签包裹 */}
        <article className="max-w-none" id="article-content">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
            <MDXRemote 
              source={post.content} 
              components={MDXComponents}
            />
          </div>
        </article>

        {/* 相关文章推荐 - 在 article 外部 */}
        <RelatedPosts relatedPosts={relatedPosts} />

        {/* 评论区 - 在 article 外部 */}
        <Comments slug={slug} />

        {/* 文章底部 */}
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          {/* 文章底部分享 */}
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

// 生成静态路径
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
      title: post.title,
      description: post.description,
      keywords: post.tags,
      authors: [{ name: 'Niutr' }],
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.date,
        url: `https://niutr.cn/blog/${slug}`,
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
      },
      alternates: {
        canonical: `https://niutr.cn/blog/${slug}`,
      },
    }
  } catch (error) {
    return {
      title: '文章未找到',
    }
  }
}