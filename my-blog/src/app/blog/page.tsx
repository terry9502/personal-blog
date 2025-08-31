import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { Calendar, Clock, TrendingUp } from 'lucide-react'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">博客文章</h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          记录我的学习历程和技术思考
        </p>
      </div>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article 
            key={post.slug} 
            className="group bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex flex-col">
              <div className="flex-1">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {post.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <time className="flex items-center">
                    <Calendar className="mr-1" size={16} />
                    {new Date(post.date).toLocaleDateString('zh-CN')}
                  </time>
                  <div className="flex items-center">
                    <Clock className="mr-1" size={16} />
                    {post.readingTime.text}
                  </div>
                  <div className="flex items-center gap-2">
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
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">暂无文章</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">快去创建你的第一篇博客文章吧！</p>
        </div>
      )}
    </div>
  )
}