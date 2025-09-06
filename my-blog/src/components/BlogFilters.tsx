// src/components/BlogFilters.tsx
'use client'

import { useState } from 'react'
import { Search, Filter, X, Tag, TrendingUp } from 'lucide-react'

interface BlogFiltersProps {
  allTags: string[]
  selectedTag: string
  searchTerm: string
  onTagSelect: (tag: string) => void
  onSearch: (search: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export default function BlogFilters({
  allTags,
  selectedTag,
  searchTerm,
  onTagSelect,
  onSearch,
  onClearFilters,
  hasActiveFilters
}: BlogFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  // 获取热门标签（按文章数量排序，取前8个）
  const popularTags = allTags.slice(0, 8)

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索文章标题、描述或标签..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* 过滤器切换按钮 */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-4 py-3 rounded-lg border transition-colors ${
            showFilters
              ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <Filter className="mr-2" size={18} />
          标签筛选
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs">
              有筛选
            </span>
          )}
        </button>

        {/* 清除按钮 */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <X className="mr-1" size={16} />
            清除筛选
          </button>
        )}
      </div>

      {/* 标签过滤器 */}
      {showFilters && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
              <TrendingUp className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
              热门标签
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              点击标签筛选相关文章
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagSelect(selectedTag === tag ? '' : tag)}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500'
                }`}
              >
                <Tag className="mr-1" size={14} />
                {tag}
              </button>
            ))}
          </div>

          {/* 显示所有标签的选项 */}
          {allTags.length > popularTags.length && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
                显示全部 {allTags.length} 个标签
              </summary>
              <div className="flex flex-wrap gap-2 mt-3">
                {allTags.slice(popularTags.length).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagSelect(selectedTag === tag ? '' : tag)}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <Tag className="mr-1" size={14} />
                    {tag}
                  </button>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* 当前筛选状态显示 */}
      {(selectedTag || searchTerm) && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-600 dark:text-slate-400">当前筛选：</span>
          {selectedTag && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
              <Tag className="mr-1" size={12} />
              {selectedTag}
              <button
                onClick={() => onTagSelect('')}
                className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
              <Search className="mr-1" size={12} />
              "{searchTerm}"
              <button
                onClick={() => onSearch('')}
                className="ml-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}