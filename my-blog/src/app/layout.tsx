import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '天润的个人博客',
    template: '%s | 天润的个人博客'
  },
  description: '软件工程专业学生的技术博客，分享学习历程、项目经验和生活思考',
  keywords: ['博客', '技术', '软件工程', 'Next.js', 'React', '编程', 'MapReduce', 'Hadoop', '分布式计算'],
  authors: [{ name: '天润' }],
  creator: '天润',
  metadataBase: new URL('https://niutr.cn'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://niutr.cn',
    title: '天润的个人博客',
    description: '软件工程专业学生的技术博客，分享学习历程、项目经验和生活思考',
    siteName: '天润的个人博客',
  },
  twitter: {
    card: 'summary_large_image',
    title: '天润的个人博客',
    description: '软件工程专业学生的技术博客',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://niutr.cn',
    types: {
      'application/rss+xml': [
        {
          url: 'https://niutr.cn/rss.xml',
          title: '天润的个人博客 RSS Feed'
        }
      ]
    }
  },
  verification: {
    google: '你的Google Search Console验证码',
  },
  // 添加其他有用的元数据
  category: 'technology',
  classification: 'blog',
  referrer: 'origin-when-cross-origin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
          integrity="sha512-rO+olRTkcf304DQBxSWxln8JXCzTHlKnIdnMUwYvQa9/Jd4cQaNkItIUj6Z4nvW1dqK0SKXLbn9h4KwZTNtAyw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* 🔥 修复 favicon - 只保留存在的文件 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* RSS Feed 自动发现 */}
        <link 
          rel="alternate" 
          type="application/rss+xml" 
          title="天润的个人博客 RSS Feed" 
          href="https://niutr.cn/rss.xml" 
        />
        {/* 额外的RSS格式支持 */}
        <link 
          rel="alternate" 
          type="application/atom+xml" 
          title="天润的个人博客 Atom Feed" 
          href="https://niutr.cn/rss.xml" 
        />
        {/* Feed图标 */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 pt-20 max-w-7xl">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}