// src/app/tags/[tag]/page.tsx
import { getAllPosts, getAllTags, getPostsByTag } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Tag, Calendar, Clock, BookOpen, Hash, TrendingUp } from 'lucide-react'

interface PageProps {
  params: Promise<{ tag: string }>
}

export default async function TagDetailPage({ params }: PageProps) {
  const { tag: encodedTag } = await params
  const tag = decodeURIComponent(encodedTag)
  
  const allPosts = getAllPosts()
  const allTags = getAllTags()
  
  // 验证标签是否存在
  if (!allTags.includes(tag)) {
    notFound()
  }
  
  const tagPosts = getPostsByTag(tag)
  
  // 获取相关标签（与当前标签经常一起出现的标签）
  const getRelatedTags = () => {
    const tagFrequency = new Map<string, number>()
    
    tagPosts.forEach(post => {
      post.tags.forEach(postTag => {
        if (postTag !== tag) {
          tagFrequency.set(postTag, (tagFrequency.get(postTag) || 0) + 1)
        }
      })
    })
    
    return Array.from(tagFrequency.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([relatedTag, count]) => ({ tag: relatedTag, count }))
  }
  
  const relatedTags = getRelatedTags()

  return (
    <div className="max-w-4xl mx-auto">
      {/* 面包屑导航 */}
      <nav className="mb-8 flex items-center text-sm text-slate-600 dark:text-slate-400">
        <Link 
          href="/blog" 
          className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          博客
        </Link>
        <span className="mx-2">→</span>
        <Link 
          href="/tags" 
          className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          标签
        </Link>
        <span className="mx-2">→</span>
        <span className="text-slate-900 dark:text-white font-medium">{tag}</span>
      </nav>

      {/* 返回按钮 */}
      <div className="mb-8">
        <Link 
          href="/tags" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="mr-1" size={16} />
          返回标签列表
        </Link>
      </div>

      {/* 页面标题 */}
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Tag className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {tag}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          共找到 {tagPosts.length} 篇相关文章
        </p>
      </header>

      {/* 文章列表 */}
      <section className="mb-12">
        <div className="space-y-6">
          {tagPosts.map((post, index) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                {/* 序号和标题 */}
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1">
                    {post.title}
                  </h2>
                </div>

                {/* 文章描述 */}
                <p className="text-slate-600 dark:text-slate-300 mb-4 ml-12 line-clamp-2">
                  {post.description}
                </p>

                {/* 文章元信息 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 ml-12 mb-4">
                  <div className="flex items-center">
                    <Calendar className="mr-1" size={14} />
                    {new Date(post.date).toLocaleDateString('zh-CN')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1" size={14} />
                    {post.readingTime.text}
                  </div>
                </div>

                {/* 其他标签 */}
                <div className="flex flex-wrap gap-2 ml-12">
                  {post.tags.map((postTag) => (
                    <span
                      key={postTag}
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs transition-colors ${
                        postTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Tag size={10} className="mr-1" />
                      {postTag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 相关标签 */}
      {relatedTags.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="mr-2 text-green-600 dark:text-green-400" size={24} />
            相关标签
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              经常与「{tag}」一起出现的标签：
            </p>
            <div className="flex flex-wrap gap-3">
              {relatedTags.map(({ tag: relatedTag, count }) => (
                <Link
                  key={relatedTag}
                  href={`/tags/${encodeURIComponent(relatedTag)}`}
                  className="inline-flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-300 transition-all"
                >
                  <Tag className="mr-1" size={14} />
                  {relatedTag}
                  <span className="ml-2 text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-full">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 底部行动召唤 */}
      <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          探索更多内容
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          发现更多有趣的技术文章和知识分享
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tags"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Hash className="mr-2" size={18} />
            浏览所有标签
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <BookOpen className="mr-2" size={18} />
            所有文章
          </Link>
        </div>
      </div>
    </div>
  )
}

// 移除 generateStaticParams，改为动态路由
// export async function generateStaticParams() {
//   const tags = getAllTags()
//   return tags.map((tag) => ({
//     tag: encodeURIComponent(tag),
//   }))
// }

// 生成元数据
export async function generateMetadata({ params }: PageProps) {
  const { tag: encodedTag } = await params
  const tag = decodeURIComponent(encodedTag)
  
  const allTags = getAllTags()
  if (!allTags.includes(tag)) {
    return {
      title: '标签未找到'
    }
  }
  
  const tagPosts = getPostsByTag(tag)
  
  return {
    title: `${tag} 标签 - 技术博客`,
    description: `浏览标签「${tag}」下的所有文章，共 ${tagPosts.length} 篇相关内容`,
    keywords: [tag, ...tagPosts.flatMap(post => post.tags)],
    openGraph: {
      title: `${tag} 标签`,
      description: `发现标签「${tag}」下的 ${tagPosts.length} 篇技术文章`,
      type: 'website',
    },
  }
}