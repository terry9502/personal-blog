'use client'
import Link from 'next/link'
import { Home, BookOpen, User, Github, Mail, Search, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">我</span>
            </div>
            <span className="text-slate-900 dark:text-white">的博客</span>
          </Link>
          
          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Home size={18} />
              <span>首页</span>
            </Link>
            <Link 
              href="/blog" 
              className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <BookOpen size={18} />
              <span>博客</span>
            </Link>
            <Link 
              href="/about" 
              className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <User size={18} />
              <span>关于我</span>
            </Link>
            <Link 
              href="/search" 
              className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Search size={18} />
              <span>搜索</span>
            </Link>
          </div>

          {/* 桌面端右侧按钮组 */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a 
              href="mailto:your@email.com" 
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>

          {/* 移动端按钮组 - 只显示ThemeToggle和菜单按钮 */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 - 移除额外的主题切换按钮 */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home size={18} />
                <span>首页</span>
              </Link>
              <Link 
                href="/blog" 
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen size={18} />
                <span>博客</span>
              </Link>
              <Link 
                href="/about" 
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} />
                <span>关于我</span>
              </Link>
              <Link 
                href="/search" 
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search size={18} />
                <span>搜索</span>
              </Link>
              <div className="flex items-center space-x-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="mailto:your@email.com" 
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}