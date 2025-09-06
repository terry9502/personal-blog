// src/components/BlogFilters.tsx
'use client'

import { useState } from 'react'
import { Search, Filter, X, Tag, TrendingUp, ChevronDown } from 'lucide-react'

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
      {/* 搜索栏和筛选按钮 - 一体化设计 */}
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-center">
          {/* 搜索框 */}
          <div className="relative group flex-1">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="搜索文章标题、描述或标签..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-base border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md focus:shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                title="清除搜索"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* 筛选按钮 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-5 py-4 rounded-xl border-2 transition-all font-medium whitespace-nowrap ${
              showFilters
                ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500'
            }`}
          >
            <Filter className="mr-2" size={18} />
            <span className="hidden sm:inline">标签筛选</span>
            <span className="sm:hidden">筛选</span>
            <ChevronDown className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs font-bold min-w-[20px] text-center">
                {(selectedTag ? 1 : 0) + (searchTerm ? 1 : 0)}
              </span>
            )}
          </button>

          {/* 清除按钮 - 紧凑设计 */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center px-4 py-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 font-medium shadow-sm hover:shadow-md"
              title="清除全部筛选"
            >
              <X size={18} />
              <span className="hidden sm:inline ml-2">清除</span>
            </button>
          )}
        </div>
      </div>

      {/* 当前筛选状态显示 - 更突出的设计 */}
      {(selectedTag || searchTerm) && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-700">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center">
                <Filter className="mr-2" size={16} />
                当前筛选：
              </span>
              {selectedTag && (
                <span className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                  <Tag className="mr-2" size={14} />
                  <span className="font-medium">{selectedTag}</span>
                  <button
                    onClick={() => onTagSelect('')}
                    className="ml-3 text-blue-100 hover:text-white p-1 rounded-full hover:bg-blue-600 transition-all"
                    title="移除标签筛选"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                  <Search className="mr-2" size={14} />
                  <span className="font-medium">"{searchTerm}"</span>
                  <button
                    onClick={() => onSearch('')}
                    className="ml-3 text-green-100 hover:text-white p-1 rounded-full hover:bg-green-600 transition-all"
                    title="清除搜索"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 标签过滤器 - 改进的展开动画 */}
      {showFilters && (
        <div className="max-w-5xl mx-auto animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center">
                <TrendingUp className="mr-3 text-blue-600 dark:text-blue-400" size={24} />
                热门标签
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                点击标签筛选相关文章，再次点击取消筛选
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagSelect(selectedTag === tag ? '' : tag)}
                  className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedTag === tag
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm hover:shadow-md'
                  }`}
                >
                  <Tag className="mr-2" size={14} />
                  {tag}
                </button>
              ))}
            </div>

            {/* 显示所有标签的选项 */}
            {allTags.length > popularTags.length && (
              <details className="group">
                <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center font-medium text-sm py-2 transition-colors">
                  <ChevronDown className="mr-2 transition-transform group-open:rotate-180" size={16} />
                  显示全部 {allTags.length} 个标签
                </summary>
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                  {allTags.slice(popularTags.length).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagSelect(selectedTag === tag ? '' : tag)}
                      className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                        selectedTag === tag
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <Tag className="mr-2" size={14} />
                      {tag}
                    </button>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  )
}