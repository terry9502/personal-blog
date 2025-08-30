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
        <h1 className="text-4xl font-bold text-slate-900 mb-6">搜索文章</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索标题、内容、标签..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {query && (
        <div className="mb-6">
          <p className="text-slate-600">
            {loading ? '搜索中...' : `找到 ${results.length} 个结果`}
          </p>
        </div>
      )}

      <div className="grid gap-6">
        {results.map((post) => (
          <article 
            key={post.slug} 
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-3">
                {post.title}
              </h2>
            </Link>
            <p className="text-slate-600 mb-4 leading-relaxed">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
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

      {query && !loading && results.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">没有找到相关文章</h2>
          <p className="text-slate-600">试试其他关键词</p>
        </div>
      )}
    </div>
  )
}