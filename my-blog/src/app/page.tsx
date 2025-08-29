import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { BookOpen, User, Code2, Server, Database, Palette, ArrowRight } from 'lucide-react'

export default function Home() {
  const posts = getAllPosts().slice(0, 3) // 获取最新3篇文章

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
            你好，我是 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
              开发者
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            软件工程专业学生，热爱编程与创造。在这里分享我的学习历程、项目经验和生活感悟。
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="mr-2" size={20} />
            阅读博客
          </Link>
          <Link 
            href="/about" 
            className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:text-slate-900 transition-colors"
          >
            <User className="mr-2" size={20} />
            了解更多
          </Link>
        </div>
      </section>

      {/* 技能标签 */}
      <section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Code2 className="mx-auto mb-3 text-blue-600" size={32} />
            <h3 className="font-semibold text-slate-900">前端开发</h3>
            <p className="text-sm text-slate-600 mt-1">React, Next.js, Vue</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Server className="mx-auto mb-3 text-green-600" size={32} />
            <h3 className="font-semibold text-slate-900">后端开发</h3>
            <p className="text-sm text-slate-600 mt-1">Node.js, Python, Java</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Database className="mx-auto mb-3 text-purple-600" size={32} />
            <h3 className="font-semibold text-slate-900">数据库</h3>
            <p className="text-sm text-slate-600 mt-1">MySQL, MongoDB</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Palette className="mx-auto mb-3 text-red-600" size={32} />
            <h3 className="font-semibold text-slate-900">设计</h3>
            <p className="text-sm text-slate-600 mt-1">UI/UX, Figma</p>
          </div>
        </div>
      </section>

      {/* 最新文章 */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">最新文章</h2>
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            查看全部
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>

        <div className="grid gap-6">
          {posts.length > 0 ? posts.map((post) => (
            <article 
              key={post.slug} 
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex flex-col">
                <div className="flex-1">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-600 mb-4">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      📅 {new Date(post.date).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="flex items-center">
                      ⏱️ {post.readingTime.text}
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        🏷️
                        {post.tags.slice(0, 2).map((tag) => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 bg-slate-100 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )) : (
            <div className="text-center py-12">
              <p className="text-slate-500">暂无文章，快去写第一篇吧！</p>
              <Link 
                href="/blog" 
                className="inline-block mt-4 text-blue-600 hover:text-blue-700"
              >
                创建第一篇文章 →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}