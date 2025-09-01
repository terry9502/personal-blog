'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PostData } from '@/lib/blog'
import { Calendar, Clock, ArrowRight, Lightbulb, BookOpen, Eye, TrendingUp } from 'lucide-react'

interface RelatedPostsProps {
  relatedPosts: PostData[]
}

export default function RelatedPosts({ relatedPosts }: RelatedPostsProps) {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
      {/* 标题部分 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-3">
            <Lightbulb className="text-yellow-600 dark:text-yellow-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              相关文章推荐
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              基于标签和内容相似度为您推荐
            </p>
          </div>
        </div>
        
        <Link
          href="/blog"
          className="hidden md:inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm transition-colors"
        >
          <BookOpen size={16} className="mr-1" />
          查看所有文章
        </Link>
      </div>
      
      {/* 文章卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post, index) => (
          <article 
            key={post.slug}
            className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden"
            onMouseEnter={() => setHoveredPost(post.slug)}
            onMouseLeave={() => setHoveredPost(null)}
          >
            {/* 推荐标识条 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            {/* 整个卡片可点击的链接 */}
            <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" aria-label={`阅读文章: ${post.title}`}></Link>
            
            <div className="p-6 relative">
              {/* 头部信息 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    <TrendingUp size={12} className="mr-1" />
                    推荐 #{index + 1}
                  </div>
                </div>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <Calendar size={12} className="mr-1" />
                  {new Date(post.date).toLocaleDateString('zh-CN')}
                </div>
              </div>

              {/* 文章标题 */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>

              {/* 文章描述 */}
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                {post.description}
              </p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="relative z-20 px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 text-xs rounded-md transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {tag}
                  </Link>
                ))}
                {post.tags.length > 3 && (
                  <span className="px-2 py-1 text-slate-400 dark:text-slate-500 text-xs">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>

              {/* 底部信息 */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                  <Clock size={12} className="mr-1" />
                  {post.readingTime.text}
                </div>
                
                <div className={`flex items-center text-blue-600 dark:text-blue-400 text-sm transition-all duration-200 ${
                  hoveredPost === post.slug ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                }`}>
                  <Eye size={14} className="mr-1" />
                  <span>阅读</span>
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </div>

            {/* 悬停效果 */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 transition-opacity duration-300 ${
              hoveredPost === post.slug ? 'opacity-100' : 'opacity-0'
            }`}></div>
          </article>
        ))}
      </div>

      {/* 移动端查看更多按钮 */}
      <div className="text-center mt-8 md:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <BookOpen className="mr-2" size={18} />
          查看所有文章
        </Link>
      </div>

      {/* 推荐算法说明（可选，可移除） */}
      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          💡 推荐算法基于标签匹配度、标题相似性和内容相关性智能计算
        </p>
      </div>
    </section>
  )
}