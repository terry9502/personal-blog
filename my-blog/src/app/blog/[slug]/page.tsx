import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import MDXComponents from '@/components/MDXComponents'
import Comments from '@/components/Comments'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  
  try {
    const post = getPostBySlug(slug)
    
    return (
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

        {/* 文章头部 */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-600 text-sm">
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
                    className="px-2 py-1 bg-slate-100 rounded-md text-xs hover:bg-slate-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
            </div>
          </div>
        </header>

        {/* 文章内容 */}
        <article className="max-w-none">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <MDXRemote 
              source={post.content} 
              components={MDXComponents}
            />
          </div>
        </article>

        {/* 评论区 */}
        <Comments slug={slug} />

        {/* 文章底部 */}
        <footer className="mt-12 pt-8 border-t border-slate-200">
          <div className="text-center">
            <p className="text-slate-600 mb-4">
              如果这篇文章对你有帮助，欢迎分享给更多人！
            </p>
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              阅读更多文章
            </Link>
          </div>
        </footer>
      </div>
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
      authors: [{ name: '牛天润' }],
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