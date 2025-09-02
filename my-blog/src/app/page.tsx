// src/app/page.tsx
import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'
import { ArrowRight, BookOpen, Calendar, Clock, Tag, TrendingUp, User } from 'lucide-react'

export default function HomePage() {
  const allPosts = getAllPosts()
  const posts = allPosts.slice(0, 6) // 显示最新的6篇文章
  
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

  return (
    <div className="space-y-12">
      {/* 英雄区域 */}
      <section className="text-center py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-lg">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
          欢迎来到我的博客
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          软件工程专业学生的技术日志，记录学习历程、分享项目经验
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <BookOpen className="mr-2" size={20} />
            开始阅读
          </Link>
          <Link 
            href="/about" 
            className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <User className="mr-2" size={20} />
            了解我
          </Link>
        </div>
      </section>

      {/* 热门标签 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
          <Tag className="mr-2 text-purple-600 dark:text-purple-400" size={24} />
          热门标签
        </h2>
        <div className="flex flex-wrap gap-3">
          {popularTags.map(([tag, count]) => {
            const tagPosts = allPosts.filter(post => post.tags.includes(tag))
            return (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="group inline-flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
              >
                <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tag}
                </span>
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {count}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 最新文章列表 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center">
            <TrendingUp className="mr-2 text-blue-600 dark:text-blue-400" size={24} />
            最新文章
          </h2>
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            查看全部
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>

        <div className="space-y-6">
          {/* 第一篇文章 - 特色展示 */}
          {posts.length > 0 && (
            <article className="group bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col">
                  <Link href={`/blog/${posts[0].slug}`}>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
                      {posts[0].title}
                    </h3>
                  </Link>
                  
                  <p className="text-base text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                    {posts[0].description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(posts[0].date).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {posts[0].readingTime.text}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {posts[0].tags.slice(0, 4).map(tag => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Tag size={10} className="mr-1" />
                          {tag}
                        </Link>
                      ))}
                      {posts[0].tags.length > 4 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                          +{posts[0].tags.length - 4} 更多
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* 其余文章 - 网格布局 */}
          {posts.length > 1 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(1).map((post, index) => (
                <article 
                  key={post.slug} 
                  className="group bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                          {post.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(post.date).toLocaleDateString('zh-CN')}
                          </span>
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {post.readingTime.text}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map(tag => (
                            <Link
                              key={tag}
                              href={`/blog?tag=${encodeURIComponent(tag)}`}
                              className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <Tag size={10} className="mr-1" />
                              {tag}
                            </Link>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                              +{post.tags.length - 3} 更多
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* 如果没有文章 */}
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 mb-4">暂无文章，开始创作第一篇吧！</p>
              <Link 
                href="/editor" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                开始写作
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 快速导航 */}
      <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">探索更多</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/blog" 
            className="group text-center p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
          >
            <BookOpen className="mx-auto mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">所有文章</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">浏览全部技术文章和学习笔记</p>
            <span className="inline-block mt-3 text-blue-600 dark:text-blue-400 text-sm">
              共 {allPosts.length} 篇文章 →
            </span>
          </Link>
          
          <Link 
            href="/search" 
            className="group text-center p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-500 hover:shadow-md transition-all"
          >
            <div className="mx-auto mb-4 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-green-600 dark:text-green-400 text-xl">🔍</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">搜索文章</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">快速找到你感兴趣的内容</p>
            <span className="inline-block mt-3 text-green-600 dark:text-green-400 text-sm">
              立即搜索 →
            </span>
          </Link>
          
          <Link 
            href="/about" 
            className="group text-center p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all"
          >
            <User className="mx-auto mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">关于我</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">了解我的学习经历和技术背景</p>
            <span className="inline-block mt-3 text-purple-600 dark:text-purple-400 text-sm">
              了解更多 →
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}