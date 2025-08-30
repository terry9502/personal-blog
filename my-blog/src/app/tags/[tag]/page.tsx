import { getAllPosts, getPostsByTag } from '@/lib/blog'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ tag: string }>
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  
  // 解码标签名
  let decodedTag = decodeURIComponent(tag)
  try {
    const testDecode = decodeURIComponent(decodedTag)
    if (testDecode !== decodedTag) {
      decodedTag = testDecode
    }
  } catch (e) {
    // 解码失败时使用原始标签
  }
  
  const posts = getPostsByTag(decodedTag)
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="mr-1" size={16} />
          返回博客列表
        </Link>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          标签：<span className="text-blue-600">{decodedTag}</span>
        </h1>
        <p className="text-xl text-slate-600">
          找到 {posts.length} 篇相关文章
        </p>
      </div>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article 
            key={post.slug} 
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-3">
                {post.title}
              </h2>
            </Link>
            <p className="text-slate-600 mb-4 leading-relaxed">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center">
                <Calendar className="mr-1" size={16} />
                {new Date(post.date).toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1" size={16} />
                {post.readingTime.text}
              </div>
              <div className="flex items-center gap-2">
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
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">没有找到相关文章</h2>
          <p className="text-slate-600">标签 "{decodedTag}" 下暂无文章</p>
        </div>
      )}
    </div>
  )
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  const tags = Array.from(new Set(posts.flatMap(post => post.tags)))
  
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
}