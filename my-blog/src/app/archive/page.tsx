import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag, TrendingUp, Archive, ChevronDown, ChevronRight } from 'lucide-react'
import ArchiveTimeline from '@/components/ArchiveTimeline'

export const metadata = {
  title: '文章归档',
  description: '按时间浏览天润博客的所有技术文章，探索学习历程'
}

export default function ArchivePage() {
  const posts = getAllPosts()
  
  // 按年份和月份分组
  const postsByYear = posts.reduce((acc, post) => {
    const date = new Date(post.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // JavaScript 月份从0开始
    
    if (!acc[year]) {
      acc[year] = {}
    }
    if (!acc[year][month]) {
      acc[year][month] = []
    }
    
    acc[year][month].push(post)
    return acc
  }, {} as Record<number, Record<number, typeof posts>>)

  const years = Object.keys(postsByYear)
    .map(year => parseInt(year))
    .sort((a, b) => b - a) // 按年份倒序

  // 计算总统计
  const totalWords = posts.reduce((sum, post) => sum + post.readingTime.words, 0)
  const avgReadingTime = posts.length > 0 ? 
    Math.round(posts.reduce((sum, post) => sum + post.readingTime.minutes, 0) / posts.length) : 0

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* 返回按钮 */}
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="mr-1" size={16} />
          返回博客列表
        </Link>
      </div>

      {/* 页面标题和统计 */}
      <header className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Archive className="text-purple-600 dark:text-purple-400 mr-3" size={48} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">📚 文章归档</h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
          按时间线浏览所有技术文章，见证学习成长历程
        </p>
        
        {/* 统计信息卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{posts.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">总文章</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(totalWords / 1000)}K</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">总字数</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{avgReadingTime}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">平均阅读时长(分钟)</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{years.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">写作年数</div>
          </div>
        </div>
      </header>

      {/* 归档时间线 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 年份导航 */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
                年份导航
              </h3>
              <nav className="space-y-2">
                {years.map(year => {
                  const yearPostCount = Object.values(postsByYear[year]).flat().length
                  return (
                    <a
                      key={year}
                      href={`#year-${year}`}
                      className="block p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{year} 年</span>
                        <span className="text-xs bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded-full">
                          {yearPostCount}
                        </span>
                      </div>
                    </a>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* 归档内容 */}
        <div className="lg:col-span-3">
          <ArchiveTimeline posts={posts} />
        </div>
      </div>
    </div>
  )
}