// src/components/BlogPostCard.tsx
import Link from 'next/link'
import { PostData } from '@/lib/blog'
import { Calendar, Clock, Tag, Pin } from 'lucide-react'

interface BlogPostCardProps {
  post: PostData
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  // 置顶标识组件
  const PinnedBadge = ({ pinnedOrder }: { pinnedOrder?: number }) => (
    <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-sm">
      <Pin className="mr-1" size={12} />
      置顶
      {pinnedOrder !== undefined && pinnedOrder > 0 && (
        <span className="ml-1 text-xs opacity-90">#{pinnedOrder}</span>
      )}
    </div>
  )

  return (
    <article 
      className={`group bg-white dark:bg-slate-800 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
        post.pinned 
          ? 'border-red-200 dark:border-red-700 hover:border-red-300 dark:hover:border-red-600 relative overflow-hidden' 
          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'
      }`}
    >
      {/* 置顶文章的背景装饰 */}
      {post.pinned && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 pointer-events-none" />
      )}
      
      <Link href={`/blog/${post.slug}`} className="block p-6 relative">
        {/* 文章标题和置顶标识 */}
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1 mr-4">
            {post.title}
          </h2>
          {post.pinned && <PinnedBadge pinnedOrder={post.pinnedOrder} />}
        </div>

        {/* 文章描述 */}
        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {/* 文章元信息 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center">
            <Calendar className="mr-1" size={14} />
            {new Date(post.date).toLocaleDateString('zh-CN')}
          </div>
          <div className="flex items-center">
            <Clock className="mr-1" size={14} />
            {post.readingTime.text}
          </div>
        </div>

        {/* 标签列表 */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                // 这里可以添加标签点击处理逻辑
                window.location.href = `/blog?tag=${encodeURIComponent(tag)}`
              }}
            >
              <Tag size={10} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  )
}