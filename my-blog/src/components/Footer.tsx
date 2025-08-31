import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300">
            © 2024 我的博客. Made with ❤️ using Next.js
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            持续学习，持续分享
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link 
              href="/rss.xml" 
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              RSS 订阅
            </Link>
            <Link 
              href="/sitemap.xml" 
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              站点地图
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}