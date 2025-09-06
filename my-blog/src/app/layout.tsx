import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import ScrollToTop from '@/components/ScrollToTop'

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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        
        {/* Apple 设备 */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 现有的 PNG favicon */}
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        
        {/* Web App 图标作为备用 */}
        <link rel="icon" type="image/png" sizes="192x192" href="/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/web-app-manifest-512x512.png" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 主题色彩 */}
        <meta name="theme-color" content="#1e293b" />
        <meta name="msapplication-TileColor" content="#1e293b" />
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
            {/* 添加回到顶部组件 */}
            <ScrollToTop />
          </div>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}