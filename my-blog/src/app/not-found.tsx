import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="text-8xl mb-4">😅</div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">页面未找到</h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
        抱歉，你访问的页面不存在或已被移动。
      </p>
      <div className="flex justify-center gap-4">
        <Link 
          href="/" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          回到首页
        </Link>
        <Link 
          href="/blog" 
          className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          查看博客
        </Link>
      </div>
    </div>
  )
}