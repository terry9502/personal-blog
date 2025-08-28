import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">博客文章</h1>
        <p className="text-xl text-slate-600">
          记录我的学习历程和技术思考
        </p>
      </div>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article 
            key={post.slug} 
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex flex-col">
              <div className="flex-1">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-3">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {post.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <time className="flex items-center">
                    📅 {new Date(post.date).toLocaleDateString('zh-CN')}
                  </time>
                  <div className="flex items-center">
                    ⏱️ {post.readingTime.text}
                  </div>
                  <div className="flex items-center gap-2">
                    🏷️
                    {post.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-slate-100 rounded-md text-xs hover:bg-slate-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">暂无文章</h2>
          <p className="text-slate-600 mb-6">快去创建你的第一篇博客文章吧！</p>
          <p className="text-sm text-slate-500">
            在 <code className="bg-slate-100 px-2 py-1 rounded">src/content/posts/</code> 目录下创建 .mdx 文件
          </p>
        </div>
      )}
    </div>
  )
}