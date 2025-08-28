import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="text-8xl mb-4">😅</div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">页面未找到</h1>
      <p className="text-xl text-slate-600 mb-8">
        抱歉，你访问的页面不存在或已被移动。
      </p>
      <div className="flex justify-center gap-4">
        <Link 
          href="/" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          回到首页
        </Link>
        <Link 
          href="/blog" 
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:text-slate-900 transition-colors"
        >
          查看博客
        </Link>
      </div>
    </div>
  )
}