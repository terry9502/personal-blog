// src/components/Pagination.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  baseUrl?: string
  showInfo?: boolean
  className?: string
}

export default function Pagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage,
  baseUrl = '/blog',
  showInfo = true,
  className = ''
}: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // 如果只有一页或没有内容，不显示分页
  if (totalPages <= 1) return null

  // 构建页面URL
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    const queryString = params.toString()
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`
  }

  // 处理页面跳转
  const navigateToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      const url = buildPageUrl(page)
      router.push(url)
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // 生成页码范围
  const getPageRange = () => {
    const delta = 2 // 当前页前后显示的页数
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
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* 分页信息 */}
      {showInfo && (
        <div className="text-sm text-slate-600 dark:text-slate-400">
          显示第 <span className="font-medium text-slate-900 dark:text-white">{startItem}</span> 到 
          <span className="font-medium text-slate-900 dark:text-white"> {endItem}</span> 项，
          共 <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> 项
        </div>
      )}

      {/* 分页按钮 */}
      <nav className="flex items-center space-x-1" aria-label="分页导航">
        {/* 首页按钮 */}
        <button
          onClick={() => navigateToPage(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="首页"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* 上一页按钮 */}
        <button
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="上一页"
        >
          <ChevronLeft size={16} />
        </button>

        {/* 页码按钮 */}
        <div className="flex items-center space-x-1">
          {/* 第一页 */}
          <button
            onClick={() => navigateToPage(1)}
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
                onClick={() => navigateToPage(pageNum)}
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
              onClick={() => navigateToPage(totalPages)}
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
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="下一页"
        >
          <ChevronRight size={16} />
        </button>

        {/* 末页按钮 */}
        <button
          onClick={() => navigateToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="末页"
        >
          <ChevronsRight size={16} />
        </button>
      </nav>

      {/* 快速跳转 */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-slate-600 dark:text-slate-400">跳转到</span>
        <select
          value={currentPage}
          onChange={(e) => navigateToPage(parseInt(e.target.value))}
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