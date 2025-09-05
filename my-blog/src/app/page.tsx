// src/app/page.tsx - 修复标签链接后的首页
import { getAllPosts, getPinnedPosts } from '@/lib/blog'
import Link from 'next/link'
import { ArrowRight, BookOpen, Calendar, Clock, Tag, TrendingUp, User, Pin, Star } from 'lucide-react'

export default function HomePage() {
  const allPosts = getAllPosts()
  const pinnedPosts = getPinnedPosts()
  const regularPosts = allPosts.filter(post => !post.pinned)
  
  // 首页显示：最多3篇置顶文章 + 最新的常规文章（总共6篇）
  const displayPosts = [
    ...pinnedPosts.slice(0, 3),
    ...regularPosts.slice(0, 6 - pinnedPosts.slice(0, 3).length)
  ].slice(0, 6)
  
  // 获取所有标签及其文章数量
  const tagCounts = allPosts.reduce<Record<string, number>>((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {})
  
  const popularTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)

  // 置顶标识组件
  const PinnedBadge = ({ pinnedOrder, size = 'sm' }: { pinnedOrder?: number, size?: 'sm' | 'xs' }) => (
    <div className={`inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-full shadow-sm ${
      size === 'xs' 
        ? 'px-1.5 py-0.5 text-xs' 
        : 'px-2 py-1 text-xs'
    }`}>
      <Pin className="mr-1" size={size === 'xs' ? 10 : 12} />
      置顶
      {pinnedOrder !== undefined && pinnedOrder > 0 && (
        <span className="ml-1 opacity-90">#{pinnedOrder}</span>
      )}
    </div>
  )

  return (
    <div className="space-y-12">
      {/* 紧凑英雄区域 */}
      <section className="text-center py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-lg">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          欢迎来到我的博客
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
          记录学习历程、分享生活经验
        </p>
        
        {/* 博客统计信息 */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
          <div className="flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
            <BookOpen className="mr-1" size={14} />
            <span>{allPosts.length} 篇文章</span>
          </div>
          {pinnedPosts.length > 0 && (
            <div className="flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full">
              <Pin className="mr-1" size={14} />
              <span>{pinnedPosts.length} 篇置顶</span>
            </div>
          )}
          <div className="flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
            <Tag className="mr-1" size={14} />
            <span>{Object.keys(tagCounts).length} 个标签</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-none mx-auto">
          <Link 
            href="/blog" 
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <BookOpen className="mr-2" size={20} />
            开始阅读
          </Link>
          <Link 
            href="/about" 
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <User className="mr-2" size={20} />
            了解我
          </Link>
        </div>
      </section>

      {/* 热门标签 - 修复标签链接 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center">
            <Tag className="mr-2 text-purple-600 dark:text-purple-400" size={20} />
            热门标签
          </h2>
          <Link 
            href="/tags" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center"
          >
            查看所有标签
            <ArrowRight className="ml-1" size={14} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {popularTags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="group inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <Tag className="mr-1.5 sm:mr-2 text-purple-600 dark:text-purple-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={14} />
              <span className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                {tag}
              </span>
              <span className="ml-1.5 sm:ml-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-xs rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新文章 - 包含置顶文章 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center">
            <TrendingUp className="mr-2 text-green-600 dark:text-green-400" size={20} />
            {pinnedPosts.length > 0 ? '置顶文章 & 最新文章' : '最新文章'}
          </h2>
          <Link 
            href="/blog" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center"
          >
            查看所有文章
            <ArrowRight className="ml-1" size={14} />
          </Link>
        </div>
        
        <div className="grid gap-6">
          {displayPosts.map((post) => (
            <article 
              key={post.slug} 
              className={`group rounded-lg shadow-sm border transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 relative ${
                post.pinned 
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-700' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* 置顶标识 */}
              {post.pinned && (
                <div className="absolute -top-2 -right-2 z-10">
                  <PinnedBadge pinnedOrder={post.pinnedOrder} />
                </div>
              )}
              
              <Link href={`/blog/${post.slug}`} className="block p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                      {post.description}
                    </p>
                    
                    {/* 文章元信息 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(post.date).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {post.readingTime.text}
                      </span>
                    </div>
                  </div>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 sm:max-w-xs">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 快速导航 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/blog" 
          className="group text-center p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
        >
          <BookOpen className="mx-auto mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform w-7 h-7" />
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">所有文章</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">浏览完整的文章列表</p>
          <div className="text-blue-600 dark:text-blue-400 text-sm mt-3">
            共 {allPosts.length} 篇文章
            {pinnedPosts.length > 0 && (
              <span className="text-red-600 dark:text-red-400 ml-2">
                • {pinnedPosts.length} 篇置顶
              </span>
            )}
            <span className="inline-block ml-2">→</span>
          </div>
        </Link>
        
        <Link 
          href="/tags" 
          className="group text-center p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all"
        >
          <Tag className="mx-auto mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform w-7 h-7" />
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">技术标签</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">按标签分类浏览相关内容</p>
          <span className="inline-block mt-3 text-purple-600 dark:text-purple-400 text-sm">
            {Object.keys(tagCounts).length} 个标签 →
          </span>
        </Link>
        
        <Link 
          href="/search" 
          className="group text-center p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-500 hover:shadow-md transition-all"
        >
          <div className="mx-auto mb-4 w-7 h-7 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-green-600 dark:text-green-400 text-lg">🔍</span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">搜索文章</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">快速找到你感兴趣的内容</p>
          <span className="inline-block mt-3 text-green-600 dark:text-green-400 text-sm">
            立即搜索 →
          </span>
        </Link>
      </section>
    </div>
  )
}