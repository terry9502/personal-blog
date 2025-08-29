import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

// 简化但保持样式的 MDX 组件
const styledMDXComponents = {
  // 保持原始的 HTML 结构，但添加样式
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl font-bold text-slate-900 mb-6 mt-8 first:mt-0 border-b-2 border-gray-200 pb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-semibold text-slate-900 mb-4 mt-8" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-slate-700 mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-6 py-4 my-6 rounded-r-lg" {...props}>
      <div className="text-blue-900">{children}</div>
    </blockquote>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-slate-700" {...props}>
      {children}
    </li>
  ),
  pre: ({ children, ...props }: any) => (
    <pre className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }: any) => {
    // 区分内联代码和代码块
    if (className?.includes('language-')) {
      return <code className={className} {...props}>{children}</code>
    }
    return (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600" {...props}>
        {children}
      </code>
    )
  },
  a: ({ href, children, ...props }: any) => (
    <a 
      href={href} 
      className="text-blue-600 hover:text-blue-700 underline hover:no-underline transition-all"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }: any) => (
    <span className="block my-6">
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg shadow-md max-w-full h-auto mx-auto"
        {...props}
      />
    </span>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-bold text-slate-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  // 处理 font 标签
  font: ({ children, style, color, ...props }: any) => {
    return (
      <span style={style || { color: color || '#DF2A3F', fontWeight: 'bold' }} {...props}>
        {children}
      </span>
    );
  },
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
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-slate-100 rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* 文章内容 */}
        <article className="max-w-none">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <MDXRemote 
              source={post.content} 
              components={styledMDXComponents}
            />
          </div>
        </article>

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
    }
  } catch (error) {
    return {
      title: '文章未找到',
    }
  }
}