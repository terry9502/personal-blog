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
    default: 'Niutr\'s Blog',
    template: '%s | Niutr\'s Blog'
  },
  description: '软件工程专业学生的技术博客，分享学习历程、项目经验和生活思考',
  keywords: ['博客', '技术', '软件工程', 'Next.js', 'React', '编程', 'MapReduce', 'Hadoop', '分布式计算'],
  authors: [{ name: 'Niutr' }],
  creator: 'Niutr',
  metadataBase: new URL('https://niutr.cn'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://niutr.cn',
    title: 'Niutr\'s Blog',
    description: '软件工程专业学生的技术博客，分享学习历程、项目经验和生活思考',
    siteName: 'Niutr\'s Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Niutr\'s Blog',
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
          title: 'Niutr\'s Blog RSS Feed'
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
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Niutr's Blog" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* RSS Feed 自动发现 */}
        <link 
          rel="alternate" 
          type="application/rss+xml" 
          title="Niutr's Blog RSS Feed" 
          href="https://niutr.cn/rss.xml" 
        />
        {/* 额外的RSS格式支持 */}
        <link 
          rel="alternate" 
          type="application/atom+xml" 
          title="Niutr's Blog Atom Feed" 
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
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            <Header />
            <main className="container mx-auto px-4 py-8 pt-20">
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