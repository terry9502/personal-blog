'use client'
import { useState, useEffect } from 'react'
import { PostData } from '@/lib/blog'
import Link from 'next/link'
import { Search, Calendar, Clock } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PostData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchPosts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const posts = await response.json()
        setResults(posts)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    // 延迟搜索，避免频繁请求
    const timeoutId = setTimeout(searchPosts, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">搜索文章</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
          <input
            type="text"
            placeholder="搜索标题、内容、标签..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {query && (
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            {loading ? '搜索中...' : `找到 ${results.length} 个结果`}
          </p>
        </div>
      )}

      <div className="grid gap-6">
        {results.map((post) => (
          <article 
            key={post.slug} 
            className="group bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-slate-200 dark:border-slate-700"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                {post.title}
              </h2>
            </Link>
            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <Calendar className="mr-1" size={14} />
                {new Date(post.date).toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1" size={14} />
                {post.readingTime.text}
              </div>
              <div className="flex items-center gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {query && !loading && results.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">没有找到相关文章</h2>
          <p className="text-slate-600 dark:text-slate-400">试试其他关键词</p>
          
          {/* 搜索建议 */}
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">搜索建议</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 text-left max-w-md mx-auto">
              <li>• 尝试使用更简单的关键词</li>
              <li>• 检查拼写是否正确</li>
              <li>• 尝试搜索相关的技术标签</li>
              <li>• 或者浏览所有文章</li>
            </ul>
            <Link 
              href="/blog" 
              className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              浏览所有文章
            </Link>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}