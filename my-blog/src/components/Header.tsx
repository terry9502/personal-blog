import Link from 'next/link'
import { Home, BookOpen, User, Github, Mail, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">我</span>
            </div>
            <span className="text-slate-900">的博客</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Home size={18} />
              <span>首页</span>
            </Link>
            <Link 
              href="/blog" 
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <BookOpen size={18} />
              <span>博客</span>
            </Link>
            <Link 
              href="/about" 
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <User size={18} />
              <span>关于我</span>
            </Link>
            <Link 
              href="/search" 
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Search size={18} />
              <span>搜索</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Github size={20} />
            </a>
            <a 
              href="mailto:your@email.com" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="md:hidden mt-4 flex space-x-6">
          <Link 
            href="/" 
            className="flex items-center space-x-1 text-sm text-slate-700 hover:text-blue-600 transition-colors"
          >
            <Home size={16} />
            <span>首页</span>
          </Link>
          <Link 
            href="/blog" 
            className="flex items-center space-x-1 text-sm text-slate-700 hover:text-blue-600 transition-colors"
          >
            <BookOpen size={16} />
            <span>博客</span>
          </Link>
          <Link 
            href="/about" 
            className="flex items-center space-x-1 text-sm text-slate-700 hover:text-blue-600 transition-colors"
          >
            <User size={16} />
            <span>关于我</span>
          </Link>
          <Link 
            href="/search" 
            className="flex items-center space-x-1 text-sm text-slate-700 hover:text-blue-600 transition-colors"
          >
            <Search size={16} />
            <span>搜索</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}