// src/components/BlogList.tsx - 支持置顶功能版本
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PostData } from '@/lib/blog'
import { Search, Calendar, Clock, Tag, Filter, X, Pin, Star, TrendingUp } from 'lucide-react'

interface BlogListProps {
  allPosts: PostData[]
  allTags: string[]
  initialSelectedTag?: string
}

export default function BlogList({ allPosts, allTags, initialSelectedTag = '' }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState(initialSelectedTag)
  const [showFilters, setShowFilters] = useState(false)

  // 过滤和搜索逻辑
  const filteredPosts = useMemo(() => {
    let filtered = allPosts

    // 按标签过滤
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag))
    }

    // 按搜索词过滤
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // 分离置顶和普通文章
    const pinnedPosts = filtered.filter(post => post.pinned)
    const regularPosts = filtered.filter(post => !post.pinned)

    // 返回置顶文章在前，普通文章在后的列表
    return [...pinnedPosts, ...regularPosts]
  }, [allPosts, selectedTag, searchTerm])

  // 统计信息
  const pinnedCount = filteredPosts.filter(post => post.pinned).length
  const regularCount = filteredPosts.filter(post => !post.pinned).length

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTag('')
  }

  // 渲染置顶标识
  const PinnedBadge = ({ pinnedOrder }: { pinnedOrder?: number }) => (
    <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-sm">
      <Pin className="mr-1" size={12} />
      置顶
      {pinnedOrder !== undefined && pinnedOrder > 0 && (
        <span className="ml-1 text-xs opacity-90">#{pinnedOrder}</span>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* 页面标题和统计 */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          技术博客
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
          {selectedTag 
            ? `标签「${selectedTag}」相关文章` 
            : '分享技术学习历程和项目经验'
          }
        </p>
        
        {/* 文章统计 */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
            <TrendingUp className="mr-1" size={14} />
            <span>共 {filteredPosts.length} 篇文章</span>
          </div>
          {pinnedCount > 0 && (
            <div className="flex items-center px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full">
              <Pin className="mr-1" size={14} />
              <span>{pinnedCount} 篇置顶</span>
            </div>
          )}
          {regularCount > 0 && (
            <div className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
              <Star className="mr-1" size={14} />
              <span>{regularCount} 篇普通</span>
            </div>
          )}
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索文章标题、描述或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* 筛选器切换按钮 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Filter className="mr-2" size={18} />
            标签筛选
          </button>

          {/* 清空筛选 */}
          {(searchTerm || selectedTag) && (
            <button
              onClick={clearFilters}
              className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors text-sm"
            >
              <X className="mr-1" size={16} />
              清空筛选
            </button>
          )}
        </div>

        {/* 标签筛选器 */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  !selectedTag
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                全部标签
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {tag}
                  <span className="ml-1 text-xs opacity-75">
                    ({allPosts.filter(post => post.tags.includes(tag)).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 文章列表 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
            没有找到相关文章
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            尝试调整搜索条件或浏览其他标签
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className={`group bg-white dark:bg-slate-800 rounded-lg shadow-sm border transition-all hover:shadow-md hover:scale-[1.02] ${
                post.pinned 
                  ? 'border-red-200 dark:border-red-700 hover:border-red-300 dark:hover:border-red-600 relative overflow-hidden' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'
              }`}
            >
              {/* 置顶文章的背景装饰 */}
              {post.pinned && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 pointer-events-none" />
              )}
              
              <Link href={`/blog/${post.slug}`} className="block p-6 relative">
                {/* 文章标题和置顶标识 */}
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1 mr-4">
                    {post.title}
                  </h2>
                  {post.pinned && <PinnedBadge pinnedOrder={post.pinnedOrder} />}
                </div>

                {/* 文章描述 */}
                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                  {post.description}
                </p>

                {/* 文章元信息 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="mr-1" size={14} />
                    {new Date(post.date).toLocaleDateString('zh-CN')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1" size={14} />
                    {post.readingTime.text}
                  </div>
                </div>

                {/* 标签列表 */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Tag size={10} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}