// src/app/tags/page.tsx - 修复后的标签页面
import { getAllPosts, getAllTags } from '@/lib/blog'
import Link from 'next/link'
import { ArrowLeft, Tag, BookOpen, TrendingUp, Hash } from 'lucide-react'

export const metadata = {
  title: '标签 - 技术博客',
  description: '浏览所有技术标签，发现感兴趣的内容分类'
}

export default function TagsPage() {
  const allPosts = getAllPosts()
  const allTags = getAllTags()

  // 计算每个标签的文章数量
  const tagCounts = allTags.map(tag => {
    const count = allPosts.filter(post => post.tags.includes(tag)).length
    return { tag, count }
  }).sort((a, b) => b.count - a.count) // 按文章数量排序

  // 获取每个标签的相关文章
  const getTagPosts = (tag: string) => {
    return allPosts
      .filter(post => post.tags.includes(tag))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3) // 只显示最新的3篇
  }

  // 按照文章数量分类标签
  const popularTags = tagCounts.filter(({ count }) => count >= 3)
  const normalTags = tagCounts.filter(({ count }) => count < 3 && count > 1)
  const rareTags = tagCounts.filter(({ count }) => count === 1)

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

      {/* 页面标题 */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center">
          <Hash className="mr-3 text-purple-600 dark:text-purple-400" size={40} />
          技术标签
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          探索 {allTags.length} 个技术标签，发现感兴趣的内容分类
        </p>
      </header>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {allTags.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">总标签数</div>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            {popularTags.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">热门标签</div>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
            {normalTags.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">常用标签</div>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {allPosts.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">总文章数</div>
        </div>
      </div>

      {/* 热门标签 (≥3篇文章) */}
      {popularTags.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="mr-2 text-red-600 dark:text-red-400" size={24} />
            热门标签
            <span className="ml-2 text-sm text-slate-500 dark:text-slate-400 font-normal">
              ({popularTags.length} 个, 3+ 篇文章)
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTags.map(({ tag, count }) => {
              const posts = getTagPosts(tag)
              return (
                <div
                  key={tag}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group"
                >
                  {/* 标签头部 - 修复链接 */}
                  <div className="flex items-center justify-between mb-4">
                    <Link
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="flex items-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      <Tag className="mr-2" size={20} />
                      <span className="text-lg font-semibold text-slate-900 dark:text-white">
                        {tag}
                      </span>
                    </Link>
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-sm rounded-full font-medium">
                      {count} 篇
                    </span>
                  </div>

                  {/* 相关文章预览 */}
                  <div className="space-y-2 mb-4">
                    {posts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                      >
                        • {post.title}
                      </Link>
                    ))}
                    {count > 3 && (
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        还有 {count - 3} 篇文章...
                      </div>
                    )}
                  </div>

                  {/* 查看按钮 - 修复链接 */}
                  <Link
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    查看全部 →
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 常用标签 (2篇文章) */}
      {normalTags.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
            <BookOpen className="mr-2 text-blue-600 dark:text-blue-400" size={24} />
            常用标签
            <span className="ml-2 text-sm text-slate-500 dark:text-slate-400 font-normal">
              ({normalTags.length} 个, 2 篇文章)
            </span>
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {normalTags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
              >
                <Tag className="mr-2" size={14} />
                {tag}
                <span className="ml-2 text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-full">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 新兴标签 (1篇文章) */}
      {rareTags.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
            <Hash className="mr-2 text-green-600 dark:text-green-400" size={24} />
            新兴标签
            <span className="ml-2 text-sm text-slate-500 dark:text-slate-400 font-normal">
              ({rareTags.length} 个, 1 篇文章)
            </span>
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {rareTags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-sm"
              >
                <Tag className="mr-1" size={12} />
                {tag}
                <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                  ({count})
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 底部行动召唤 */}
      <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          没有找到感兴趣的标签？
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          浏览所有文章或使用搜索功能找到你需要的内容
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="mr-2" size={18} />
            浏览所有文章
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            🔍 搜索文章
          </Link>
        </div>
      </div>
    </div>
  )
}