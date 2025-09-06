// src/components/BlogListWrapper.tsx
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PostData } from '@/lib/blog'
import { getCurrentPage, paginateData } from '@/lib/usePagination'
import Pagination from '@/components/Pagination'
import BlogPostCard from '@/components/BlogPostCard'
import BlogFilters from '@/components/BlogFilters'

interface BlogListWrapperProps {
  allPosts: PostData[]
  allTags: string[]
}

const POSTS_PER_PAGE = 6 // 每页显示的文章数量

export default function BlogListWrapper({ allPosts, allTags }: BlogListWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 从 URL 参数初始化状态
  const [selectedTags, setSelectedTags] = useState(() => {
    const tags = searchParams.get('tags')
    return tags ? tags.split(',').filter(Boolean) : []
  })
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(() => getCurrentPage(searchParams))

  // 同步 URL 参数到状态
  useEffect(() => {
    const tags = searchParams.get('tags')
    const selectedTagsFromUrl = tags ? tags.split(',').filter(Boolean) : []
    const search = searchParams.get('search') || ''
    const page = getCurrentPage(searchParams)
    
    setSelectedTags(selectedTagsFromUrl)
    setSearchTerm(search)
    setCurrentPage(page)
  }, [searchParams])

  // 过滤和搜索逻辑
  const filteredPosts = useMemo(() => {
    let filtered = allPosts

    // 按标签过滤 - 支持多标签筛选
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedTags.some(tag => post.tags.includes(tag))
      )
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

    // 分离置顶和普通文章，保持原有排序
    const pinnedPosts = filtered.filter(post => post.pinned)
    const regularPosts = filtered.filter(post => !post.pinned)

    return [...pinnedPosts, ...regularPosts]
  }, [allPosts, selectedTags, searchTerm])

  // 分页数据
  const paginationData = useMemo(() => {
    return paginateData(filteredPosts, currentPage, POSTS_PER_PAGE)
  }, [filteredPosts, currentPage])

  // 构建新的 URL
  const buildNewUrl = useCallback((newTags: string[], newSearch: string, newPage: number) => {
    const params = new URLSearchParams()
    
    if (newTags.length > 0) params.set('tags', newTags.join(','))
    if (newSearch) params.set('search', newSearch)
    if (newPage > 1) params.set('page', newPage.toString())
    
    return `/blog${params.toString() ? `?${params.toString()}` : ''}`
  }, [])

  // 处理标签选择
  const handleTagSelect = useCallback((tags: string[]) => {
    const newUrl = buildNewUrl(tags, searchTerm, 1)
    router.push(newUrl)
  }, [searchTerm, buildNewUrl, router])

  // 处理搜索
  const handleSearch = useCallback((search: string) => {
    const newUrl = buildNewUrl(selectedTags, search, 1)
    router.push(newUrl)
  }, [selectedTags, buildNewUrl, router])

  // 清除所有过滤条件
  const clearFilters = useCallback(() => {
    router.push('/blog')
  }, [router])

  // 处理分页变化 - 这个是关键！
  const handlePageChange = useCallback((page: number) => {
    const newUrl = buildNewUrl(selectedTags, searchTerm, page)
    router.push(newUrl)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedTags, searchTerm, buildNewUrl, router])

  // 统计信息
  const pinnedCount = filteredPosts.filter(post => post.pinned).length
  const regularCount = filteredPosts.filter(post => !post.pinned).length

  return (
    <div className="space-y-8">
      {/* 页面标题和统计 */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          博客分享
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
          {selectedTags.length > 0 ? (
            <>共找到包含标签 <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedTags.map(tag => `"${tag}"`).join('、')}</span> 的 {filteredPosts.length} 篇文章</>
          ) : searchTerm ? (
            <>搜索 <span className="font-semibold text-blue-600 dark:text-blue-400">"{searchTerm}"</span> 找到 {filteredPosts.length} 篇文章</>
          ) : (
            <>分享技术学习心得，共 {allPosts.length} 篇文章</>
          )}
        </p>
        
        {/* 统计标签 */}
        {(selectedTags.length > 0 || searchTerm) && (
          <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
            {pinnedCount > 0 && (
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full">
                {pinnedCount} 篇置顶
              </span>
            )}
            {regularCount > 0 && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                {regularCount} 篇普通文章
              </span>
            )}
            {selectedTags.length > 1 && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                已选择 {selectedTags.length} 个标签
              </span>
            )}
          </div>
        )}
      </div>

      {/* 搜索和过滤组件 */}
      <BlogFilters
        allTags={allTags}
        selectedTags={selectedTags}
        searchTerm={searchTerm}
        onTagSelect={handleTagSelect}
        onSearch={handleSearch}
        onClearFilters={clearFilters}
        hasActiveFilters={!!(selectedTags.length > 0 || searchTerm)}
      />

      {/* 分页信息 */}
      {paginationData.totalPages > 1 && (
        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          显示第 {paginationData.startIndex + 1} - {paginationData.endIndex} 篇文章，共 {filteredPosts.length} 篇
        </div>
      )}

      {/* 文章列表 */}
      {paginationData.paginatedData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginationData.paginatedData.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        // 空状态
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            没有找到相关文章
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {selectedTags.length > 0 && searchTerm 
              ? `没有找到包含标签"${selectedTags.join('、')}"且包含"${searchTerm}"的文章`
              : selectedTags.length > 0
              ? `没有找到包含标签"${selectedTags.join('、')}"的文章`
              : searchTerm
              ? `没有找到包含"${searchTerm}"的文章`
              : '暂时没有文章'}
          </p>
          {(selectedTags.length > 0 || searchTerm) && (
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              清除筛选条件
            </button>
          )}
        </div>
      )}

      {/* 分页组件 */}
      {paginationData.totalPages > 1 && (
        <div className="mt-12">
          <PaginationComponent
            totalItems={filteredPosts.length}
            itemsPerPage={POSTS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

// 自定义分页组件，直接处理页面变化
interface PaginationComponentProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

function PaginationComponent({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange 
}: PaginationComponentProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  if (totalPages <= 1) return null

  // 生成页码范围
  const getPageRange = () => {
    const delta = 2
    const range = []
    
    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }
    
    if (currentPage - delta > 2) {
      range.unshift('...')
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...')
    }
    
    return range
  }

  const pageRange = getPageRange()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 分页信息 */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        显示第 <span className="font-medium text-slate-900 dark:text-white">{startItem}</span> 到 
        <span className="font-medium text-slate-900 dark:text-white"> {endItem}</span> 项，
        共 <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> 项
      </div>

      {/* 分页按钮 */}
      <nav className="flex items-center space-x-1" aria-label="分页导航">
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          上一页
        </button>

        {/* 页码按钮 */}
        <div className="flex items-center space-x-1">
          {/* 第一页 */}
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            1
          </button>

          {/* 页码范围 */}
          {pageRange.map((page, index) => {
            if (page === '...') {
              return (
                <span 
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-slate-500 dark:text-slate-400"
                >
                  ...
                </span>
              )
            }
            
            const pageNum = page as number
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {pageNum}
              </button>
            )
          })}

          {/* 最后一页 */}
          {totalPages > 1 && (
            <button
              onClick={() => onPageChange(totalPages)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {totalPages}
            </button>
          )}
        </div>

        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          下一页
        </button>
      </nav>

      {/* 快速跳转 */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-slate-600 dark:text-slate-400">跳转到</span>
        <select
          value={currentPage}
          onChange={(e) => onPageChange(parseInt(e.target.value))}
          className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <option key={page} value={page}>
              第 {page} 页
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}