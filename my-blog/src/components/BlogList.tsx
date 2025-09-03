// src/components/BlogList.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Tag, BookOpen, X, Filter } from 'lucide-react'
import { PostData } from '@/lib/blog'

interface BlogListProps {
  allPosts: PostData[]
  allTags: string[]
  initialSelectedTag: string
}

export default function BlogList({ allPosts, allTags, initialSelectedTag }: BlogListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>(allPosts)
  const [activeTag, setActiveTag] = useState(initialSelectedTag)

  // 根据标签筛选文章
  useEffect(() => {
    if (activeTag) {
      const filtered = allPosts.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      )
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(allPosts)
    }
  }, [activeTag, allPosts])

  // 监听URL参数变化
  useEffect(() => {
    const tagFromUrl = searchParams.get('tag') || ''
    setActiveTag(tagFromUrl)
  }, [searchParams])

  const clearTagFilter = () => {
    setActiveTag('')
    router.push('/blog')
  }

  const handleTagClick = (tag: string) => {
    setActiveTag(tag)
    router.push(`/blog?tag=${encodeURIComponent(tag)}`)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题 */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          📚 技术博客
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          记录学习历程，分享技术心得
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 侧边栏 - 标签筛选 */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <Filter className="mr-2" size={18} />
                标签筛选
              </h2>
              {activeTag && (
                <button
                  onClick={clearTagFilter}
                  className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center"
                  title="清除筛选"
                >
                  <X size={16} className="mr-1" />
                  清除
                </button>
              )}
            </div>

            {/* 当前筛选状态 */}
            {activeTag && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                  当前筛选:
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-sm rounded-md">
                    <Tag size={12} className="mr-1" />
                    {activeTag}
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {filteredPosts.length} 篇
                  </span>
                </div>
              </div>
            )}

            {/* 标签列表 */}
            <div className="space-y-2">
              {allTags.map(tag => {
                const tagCount = allPosts.filter(post => post.tags.includes(tag)).length
                const isActive = activeTag === tag
                
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span className="flex items-center">
                      <Tag size={12} className="mr-2" />
                      {tag}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isActive 
                        ? 'bg-blue-700 text-blue-100' 
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                    }`}>
                      {tagCount}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 统计信息 */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                共 {allPosts.length} 篇文章
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {allTags.length} 个标签
              </div>
            </div>
          </div>
        </aside>

        {/* 主内容区 - 文章列表 */}
        <main className="lg:col-span-3">
          {/* 筛选结果提示 */}
          {activeTag && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Tag className="mr-2 text-blue-600 dark:text-blue-400" size={18} />
                  <span className="text-blue-800 dark:text-blue-200">
                    标签「{activeTag}」的文章 ({filteredPosts.length} 篇)
                  </span>
                </div>
                <Link
                  href="/tags"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  查看所有标签 →
                </Link>
              </div>
            </div>
          )}

          {/* 文章列表 */}
          {filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                >
                  <Link href={`/blog/${post.slug}`} className="block group">
                    {/* 文章标题 */}
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>

                    {/* 文章描述 */}
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
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
                  </Link>

                  {/* 标签 - 独立的点击区域 */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs transition-colors ${
                          activeTag === tag
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <Tag size={10} className="mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* 空状态 */
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              {activeTag ? (
                <>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    没有找到标签「{activeTag}」的文章
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    试试其他标签或查看所有文章
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={clearTagFilter}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      查看所有文章
                    </button>
                    <Link
                      href="/tags"
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      浏览标签
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    还没有文章
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    开始创建第一篇文章吧！
                  </p>
                  <Link
                    href="/editor"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="mr-2" size={18} />
                    开始写作
                  </Link>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}