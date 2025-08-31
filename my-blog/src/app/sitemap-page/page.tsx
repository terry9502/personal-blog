import { getAllPosts, getAllTags } from '@/lib/blog'
import Link from 'next/link'
import { ArrowLeft, Home, BookOpen, User, Search, Calendar, Tag, ExternalLink } from 'lucide-react'

export const metadata = {
  title: '站点地图',
  description: '天润的个人博客完整站点地图，包含所有页面和文章链接'
}

export default function SitemapPage() {
  const posts = getAllPosts()
  const tags = getAllTags()
  
  // 按年份分组文章
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {} as Record<number, typeof posts>)

  const years = Object.keys(postsByYear)
    .map(year => parseInt(year))
    .sort((a, b) => b - a) // 按年份倒序

  return (
    <div className="max-w-6xl mx-auto">
      {/* 返回按钮 */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="mr-1" size={16} />
          返回首页
        </Link>
      </div>

      {/* 页面标题 */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">🗺️ 站点地图</h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          探索博客的所有内容，包含 {posts.length} 篇文章和 {tags.length} 个标签
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要页面 */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 h-fit">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <Home className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
              主要页面
            </h2>
            <nav className="space-y-3">
              <Link 
                href="/" 
                className="flex items-center p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              >
                <Home size={18} className="mr-3" />
                <div>
                  <div className="font-medium">首页</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">博客主页和最新文章</div>
                </div>
              </Link>
              
              <Link 
                href="/blog" 
                className="flex items-center p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              >
                <BookOpen size={18} className="mr-3" />
                <div>
                  <div className="font-medium">博客文章</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">所有技术文章列表</div>
                </div>
              </Link>
              
              <Link 
                href="/search" 
                className="flex items-center p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              >
                <Search size={18} className="mr-3" />
                <div>
                  <div className="font-medium">搜索</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">查找感兴趣的内容</div>
                </div>
              </Link>
              
              <Link 
                href="/about" 
                className="flex items-center p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              >
                <User size={18} className="mr-3" />
                <div>
                  <div className="font-medium">关于我</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">了解博主和技术栈</div>
                </div>
              </Link>

              <Link 
                href="/rss" 
                className="flex items-center p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-orange-500 dark:hover:text-orange-400 transition-all"
              >
                <div className="w-[18px] h-[18px] mr-3 flex items-center justify-center">📡</div>
                <div>
                  <div className="font-medium">RSS 订阅</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">订阅博客更新</div>
                </div>
              </Link>
            </nav>

            {/* 技术链接 */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="font-medium text-slate-900 dark:text-white mb-3">技术资源</h3>
              <div className="space-y-2">
                <a 
                  href="/sitemap.xml" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <ExternalLink size={14} className="mr-2" />
                  XML 站点地图
                </a>
                <a 
                  href="/rss.xml" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  <ExternalLink size={14} className="mr-2" />
                  RSS Feed XML
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
              <BookOpen className="mr-2 text-green-600 dark:text-green-400" size={20} />
              所有文章 ({posts.length})
            </h2>
            
            {years.map(year => (
              <div key={year} className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="mr-2 text-purple-600 dark:text-purple-400" size={18} />
                  {year} 年 ({postsByYear[year].length} 篇)
                </h3>
                
                <div className="grid gap-3">
                  {postsByYear[year].map(post => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex items-start p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                          {post.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                          <span>{post.readingTime.text}</span>
                          <div className="flex items-center gap-1">
                            <Tag size={12} />
                            {post.tags.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 标签云 */}
      <div className="mt-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
            <Tag className="mr-2 text-yellow-600 dark:text-yellow-400" size={20} />
            所有标签 ({tags.length})
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {tags.map(tag => {
              const tagPosts = posts.filter(post => post.tags.includes(tag))
              return (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="group inline-flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                >
                  <span className="font-medium">{tag}</span>
                  <span className="ml-2 text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800">
                    {tagPosts.length}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>
          最后更新：{new Date().toLocaleDateString('zh-CN')} • 
          共 {posts.length} 篇文章 • 
          涵盖 {tags.length} 个技术领域
        </p>
      </div>
    </div>
  )
}