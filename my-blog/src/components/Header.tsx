import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">我</span>
            </div>
            <span className="text-slate-900">的博客</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-blue-600 transition-colors">
              首页
            </Link>
            <Link href="/blog" className="text-slate-700 hover:text-blue-600 transition-colors">
              博客
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-blue-600 transition-colors">
              关于我
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}