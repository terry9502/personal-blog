import Link from 'next/link'

export default function Home() {
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
            阅读博客
          </Link>
          <Link 
            href="/about" 
            className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:text-slate-900 transition-colors"
          >
            了解更多
          </Link>
        </div>
      </section>

      {/* 简单的技能展示 */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">前端开发</h3>
            <p className="text-slate-600">React, Next.js, Vue, TypeScript</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">后端开发</h3>
            <p className="text-slate-600">Node.js, Python, Java</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">数据库</h3>
            <p className="text-slate-600">MySQL, MongoDB, Redis</p>
          </div>
        </div>
      </section>
    </div>
  )
}