import RSSSubscribe from '@/components/RSSSubscribe'
import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'
import { ArrowLeft, Rss } from 'lucide-react'

export default function RSSPage() {
  const posts = getAllPosts()
  const latestPost = posts[0]

  return (
    <div className="max-w-4xl mx-auto">
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
        <div className="flex items-center justify-center mb-4">
          <Rss className="text-orange-500 mr-3" size={48} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">RSS 订阅</h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          订阅我的博客RSS，第一时间获取最新技术文章和学习心得
        </p>
      </header>

      {/* 博客统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{posts.length}</div>
          <div className="text-slate-600 dark:text-slate-300">篇文章</div>
        </div>
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            {new Set(posts.flatMap(p => p.tags)).size}
          </div>
          <div className="text-slate-600 dark:text-slate-300">个标签</div>
        </div>
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">定期</div>
          <div className="text-slate-600 dark:text-slate-300">更新频率</div>
        </div>
      </div>

      {/* RSS订阅组件 */}
      <div className="mb-12">
        <RSSSubscribe />
      </div>

      {/* 最新文章预览 */}
      {latestPost && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 mb-12">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            ✨ 最新文章预览
          </h3>
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <Link href={`/blog/${latestPost.slug}`}>
              <h4 className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2">
                {latestPost.title}
              </h4>
            </Link>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
              {latestPost.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>📅 {new Date(latestPost.date).toLocaleDateString('zh-CN')}</span>
              <span>⏱️ {latestPost.readingTime.text}</span>
              <span>🏷️ {latestPost.tags.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* FAQ部分 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">❓ 常见问题</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">什么是RSS？</h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              RSS（Really Simple Syndication）是一种网页内容聚合格式。通过RSS订阅，您可以在一个地方查看多个网站的最新内容，无需逐个访问。
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">如何使用RSS阅读器？</h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              选择一个RSS阅读器（推荐Feedly、Inoreader），注册账号后添加我博客的RSS地址，就能在阅读器中看到文章更新了。
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">订阅后能看到什么内容？</h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              每篇新文章的标题、摘要、发布时间、标签，以及直接跳转到原文的链接。RSS会自动获取最新的文章更新。
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">更新频率如何？</h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              我会定期发布技术文章和学习心得，RSS Feed每20分钟更新一次，确保您能及时收到最新内容。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}