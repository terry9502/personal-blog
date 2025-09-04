// src/components/SearchClient.tsx - 生产版本（移除调试信息）

'use client'

import { useState, useEffect } from 'react'
import { PostData } from '@/lib/blog'
import { searchPosts, SearchResult, SearchResponse } from '@/lib/clientSearch'
import Link from 'next/link'
import { Search, Calendar, Clock, Tag, AlertCircle, TrendingUp } from 'lucide-react'

export default function SearchClient() {
  const [allPosts, setAllPosts] = useState<PostData[]>([])
  const [query, setQuery] = useState('')
  const [searchResult, setSearchResult] = useState<SearchResponse>({
    results: [],
    query: '',
    total: 0
  })
  const [loading, setLoading] = useState(false)

  // 从页面中读取预加载的数据
  useEffect(() => {
    const script = document.getElementById('posts-data')
    
    if (script) {
      try {
        const textContent = script.textContent || '[]'
        const posts = JSON.parse(textContent)
        setAllPosts(posts)
      } catch (error) {
        console.error('解析文章数据失败:', error)
        setAllPosts([])
      }
    }
  }, [])

  const popularKeywords = [
    'MapReduce', 'Hadoop', 'Next.js', '分布式计算', 
    '前端', '技术', '学习', '编程'
  ]

  useEffect(() => {
    if (!query.trim()) {
      setSearchResult({
        results: [],
        query: '',
        total: 0
      })
      setLoading(false)
      return
    }

    if (allPosts.length === 0) {
      setSearchResult({
        results: [],
        query: query,
        total: 0,
        error: '文章数据未加载'
      })
      return
    }

    setLoading(true)
    
    const timeoutId = setTimeout(() => {
      try {
        const result = searchPosts(allPosts, query)
        setSearchResult(result)
      } catch (error) {
        console.error('搜索失败:', error)
        setSearchResult({
          results: [],
          query: query,
          total: 0,
          error: '搜索过程中出现错误，请重试'
        })
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, allPosts])

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ?
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">{part}</mark> : 
        part
    )
  }

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword)
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">搜索文章</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
          <input
            type="text"
            placeholder="搜索标题、内容、标签... (至少2个字符)"
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* 热门搜索关键词 */}
        {!query && (
          <div className="mt-6">
            <div className="flex items-center mb-3">
              <TrendingUp size={16} className="mr-2 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-300">热门搜索：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.map(keyword => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordClick(keyword)}
                  className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 搜索结果信息 */}
      {query && (
        <div className="mb-6">
          {searchResult.error ? (
            <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="mr-2 text-red-500" size={20} />
              <p className="text-red-700 dark:text-red-300">{searchResult.error}</p>
            </div>
          ) : searchResult.message ? (
            <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertCircle className="mr-2 text-yellow-500" size={20} />
              <div>
                <p className="text-yellow-700 dark:text-yellow-300">{searchResult.message}</p>
                {searchResult.suggestion && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">{searchResult.suggestion}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-600 dark:text-slate-400">
              {loading ? '搜索中...' : `找到 ${searchResult.total} 个结果`}
            </p>
          )}
        </div>
      )}

      {/* 搜索结果列表 */}
      <div className="grid gap-6">
        {searchResult.results.map((post) => (
          <article 
            key={post.slug} 
            className="group bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-slate-200 dark:border-slate-700"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                {highlightText(post.title, query)}
              </h2>
            </Link>
            
            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              {post.snippet ? 
                highlightText(post.snippet, query) : 
                post.description
              }
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <Calendar className="mr-1" size={14} />
                {new Date(post.date).toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1" size={14} />
                {post.readingTime?.text || '未知'}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="mr-1" size={14} />
                {post.tags?.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {highlightText(tag, query)}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 无结果状态 */}
      {query && !loading && searchResult.results.length === 0 && !searchResult.message && !searchResult.error && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">没有找到相关文章</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            试试搜索 "{query}" 相关的其他关键词
          </p>
          
          <div className="max-w-md mx-auto p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">搜索建议</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 text-left">
              <li>• 尝试使用更通用的关键词</li>
              <li>• 检查拼写是否正确</li>
              <li>• 尝试搜索技术栈或工具名称</li>
              <li>• 使用2个以上字符的搜索词</li>
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

      {/* 数据加载中的状态 */}
      {allPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="animate-pulse">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">正在加载文章数据...</h2>
            <p className="text-slate-600 dark:text-slate-400">
              请稍候，数据加载完成后即可搜索
            </p>
          </div>
        </div>
      )}
    </div>
  )
}