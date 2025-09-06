// src/app/blog/page.tsx
import { getAllPosts, getAllTags } from '@/lib/blog'
import BlogListWrapper from '@/components/BlogListWrapper'
import { Suspense } from 'react'

export const metadata = {
  title: '技术博客 - 所有文章',
  description: '浏览所有技术文章，支持按标签筛选和分页浏览'
}

// 加载状态组件
function BlogLoading() {
  return (
    <div className="space-y-8">
      {/* 标题骨架 */}
      <div className="text-center">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-48 mx-auto mb-4" />
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-96 mx-auto" />
      </div>
      
      {/* 搜索栏骨架 */}
      <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg max-w-md mx-auto" />
      
      {/* 文章列表骨架 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
            <div className="flex gap-2">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BlogPage() {
  const allPosts = getAllPosts()
  const allTags = getAllTags()

  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogListWrapper 
        allPosts={allPosts} 
        allTags={allTags} 
      />
    </Suspense>
  )
}