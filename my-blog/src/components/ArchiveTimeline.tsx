'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Calendar, Clock, Tag } from 'lucide-react'
import { PostData } from '@/lib/blog'

interface ArchiveTimelineProps {
  posts: PostData[]
}

export default function ArchiveTimeline({ posts }: ArchiveTimelineProps) {
  // 按年份和月份分组
  const postsByYear = posts.reduce((acc, post) => {
    const date = new Date(post.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    
    if (!acc[year]) {
      acc[year] = {}
    }
    if (!acc[year][month]) {
      acc[year][month] = []
    }
    
    acc[year][month].push(post)
    return acc
  }, {} as Record<number, Record<number, PostData[]>>)

  const years = Object.keys(postsByYear)
    .map(year => parseInt(year))
    .sort((a, b) => b - a)

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set([years[0]])) // 默认展开最新年份
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears)
    if (newExpanded.has(year)) {
      newExpanded.delete(year)
      // 关闭年份时，同时关闭该年份下的所有月份
      const monthsToClose = Object.keys(postsByYear[year]).map(month => `${year}-${month}`)
      monthsToClose.forEach(monthKey => {
        const newExpandedMonths = new Set(expandedMonths)
        newExpandedMonths.delete(monthKey)
        setExpandedMonths(newExpandedMonths)
      })
    } else {
      newExpanded.add(year)
    }
    setExpandedYears(newExpanded)
  }

  const toggleMonth = (year: number, month: number) => {
    const monthKey = `${year}-${month}`
    const newExpanded = new Set(expandedMonths)
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey)
    } else {
      newExpanded.add(monthKey)
    }
    setExpandedMonths(newExpanded)
  }

  return (
    <div className="space-y-6">
      {years.map(year => {
        const yearPosts = Object.values(postsByYear[year]).flat()
        const months = Object.keys(postsByYear[year])
          .map(month => parseInt(month))
          .sort((a, b) => b - a) // 月份倒序
        
        return (
          <div key={year} id={`year-${year}`} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* 年份标题 */}
            <button
              onClick={() => toggleYear(year)}
              className="w-full p-6 text-left bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 hover:from-blue-50 dark:hover:from-blue-900/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {expandedYears.has(year) ? (
                    <ChevronDown className="mr-3 text-slate-500 dark:text-slate-400" size={20} />
                  ) : (
                    <ChevronRight className="mr-3 text-slate-500 dark:text-slate-400" size={20} />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {year} 年
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      共 {yearPosts.length} 篇文章 • 约 {Math.round(yearPosts.reduce((sum, p) => sum + p.readingTime.minutes, 0))} 分钟阅读
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{yearPosts.length}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">篇文章</div>
                </div>
              </div>
            </button>

            {/* 年份内容 */}
            {expandedYears.has(year) && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                {months.map(month => {
                  const monthPosts = postsByYear[year][month]
                  const monthKey = `${year}-${month}`
                  
                  return (
                    <div key={month} className="border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                      {/* 月份标题 */}
                      <button
                        onClick={() => toggleMonth(year, month)}
                        className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {expandedMonths.has(monthKey) ? (
                              <ChevronDown className="mr-3 text-slate-400 dark:text-slate-500" size={16} />
                            ) : (
                              <ChevronRight className="mr-3 text-slate-400 dark:text-slate-500" size={16} />
                            )}
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                {monthNames[month - 1]}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {monthPosts.length} 篇 • {Math.round(monthPosts.reduce((sum, p) => sum + p.readingTime.minutes, 0))} 分钟
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                              {monthPosts.length}
                            </span>
                            <Calendar className="text-slate-400" size={16} />
                          </div>
                        </div>
                      </button>

                      {/* 月份文章列表 */}
                      {expandedMonths.has(monthKey) && (
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4">
                          <div className="space-y-4">
                            {monthPosts.map((post: PostData) => (
                              <article 
                                key={post.slug}
                                className="group bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
                              >
                                <Link href={`/blog/${post.slug}`}>
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                        {post.title}
                                      </h4>
                                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                                        {post.description}
                                      </p>
                                      
                                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center">
                                          <Calendar size={12} className="mr-1" />
                                          {new Date(post.date).toLocaleDateString('zh-CN')}
                                        </span>
                                        <span className="flex items-center">
                                          <Clock size={12} className="mr-1" />
                                          {post.readingTime.text}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                                
                                {/* 标签 */}
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {post.tags.slice(0, 3).map((tag: string) => (
                                    <Link
                                      key={tag}
                                      href={`/tags/${encodeURIComponent(tag)}`}
                                      className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                                    >
                                      <Tag size={10} className="mr-1" />
                                      {tag}
                                    </Link>
                                  ))}
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* 无文章状态 */}
      {posts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">还没有文章</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">开始写作第一篇文章吧！</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            回到首页
          </Link>
        </div>
      )}

      {/* 页面底部信息 */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">📈 写作历程</h3>
          <p className="text-slate-600 dark:text-slate-300">
            从 {years.length > 0 ? years[years.length - 1] : new Date().getFullYear()} 年开始写作，已经坚持了 {years.length} 年，
            累计创作 {posts.length} 篇技术文章，总计约 {Math.round(posts.reduce((sum, post) => sum + post.readingTime.words, 0) / 1000)}K 字。
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            持续学习，持续分享 📚
          </p>
        </div>
      </div>
    </div>
  )
}