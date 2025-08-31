import Link from 'next/link'
import { getAllPosts, getAllTags } from '@/lib/blog'
import { BookOpen, User, ArrowRight, Calendar, Clock, TrendingUp } from 'lucide-react'

export default function Home() {
  const posts = getAllPosts().slice(0, 4) // 显示最新4篇文章
  const tags = getAllTags().slice(0, 8) // 显示前8个标签
  const allPosts = getAllPosts()
  const latestPost = allPosts[0]
  

  return (
    <div className="max-w-6xl mx-auto">
      {/* 简洁的 Hero Section */}
      <section className="text-center py-12 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          技术博客 & 学习记录
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
          记录学习历程，分享技术心得，探索编程世界
        </p>
        
        
        {/* 最近更新时间 */}
        {latestPost && (
          <p className="text-sm text-slate-500">
            最后更新：{new Date(latestPost.date).toLocaleDateString('zh-CN')}
          </p>
        )}
      </section>

      {/* 标签云 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">热门标签</h2>
          <Link 
            href="/blog" 
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            查看所有文章
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => {
            const tagPosts = getAllPosts().filter(post => post.tags.includes(tag))
            return (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="group relative inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <span className="text-slate-700 group-hover:text-blue-600 font-medium">
                  {tag}
                </span>
                <span className="ml-2 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600">
                  {tagPosts.length}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 最新文章列表 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
            <TrendingUp className="mr-2 text-blue-600" size={24} />
            最新文章
          </h2>
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            查看全部
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.length > 0 ? posts.map((post, index) => (
            <article 
              key={post.slug} 
              className={`group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-6 ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className={`font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 ${
                      index === 0 ? 'text-2xl' : 'text-xl'
                    }`}>
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {post.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Calendar className="mr-1" size={14} />
                      {new Date(post.date).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1" size={14} />
                      {post.readingTime.text}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag)}`}
                        className="px-2 py-1 bg-slate-100 rounded-md text-xs hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          )) : (
            <div className="md:col-span-2 text-center py-12">
              <p className="text-slate-500">暂无文章，开始创作第一篇吧！</p>
            </div>
          )}
        </div>
      </section>

      {/* 快速导航 */}
      <section className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">探索更多</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/blog" 
            className="group text-center p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <BookOpen className="mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-slate-900 mb-2">所有文章</h3>
            <p className="text-slate-600 text-sm">浏览全部技术文章和学习笔记</p>
            <span className="inline-block mt-3 text-blue-600 text-sm">
              共 {getAllPosts().length} 篇文章 →
            </span>
          </Link>
          
          <Link 
            href="/search" 
            className="group text-center p-6 rounded-lg border border-slate-200 hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="mx-auto mb-4 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-green-600 text-xl">🔍</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">搜索文章</h3>
            <p className="text-slate-600 text-sm">快速找到你感兴趣的内容</p>
            <span className="inline-block mt-3 text-green-600 text-sm">
              立即搜索 →
            </span>
          </Link>
          
          <Link 
            href="/about" 
            className="group text-center p-6 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all"
          >
            <User className="mx-auto mb-4 text-purple-600 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-slate-900 mb-2">关于我</h3>
            <p className="text-slate-600 text-sm">了解我的学习经历和技术背景</p>
            <span className="inline-block mt-3 text-purple-600 text-sm">
              了解更多 →
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}