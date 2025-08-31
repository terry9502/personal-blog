import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '我的个人博客',
    template: '%s | 我的个人博客'
  },
  description: '软件工程专业学生的技术博客，分享学习历程、项目经验和生活思考',
  keywords: ['博客', '技术', '软件工程', 'Next.js', 'React', '编程', 'MapReduce', 'Hadoop', '分布式计算'],
  authors: [{ name: '你的名字' }],
  creator: '你的名字',
  metadataBase: new URL('https://niutr.cn'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://niutr.cn',
    title: '我的个人博客',
    description: '软件工程专业学生的技术博客，分享学习历程、项目经验和生活思考',
    siteName: '我的个人博客',
  },
  twitter: {
    card: 'summary_large_image',
    title: '我的个人博客',
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
  },
  verification: {
    google: '你的Google Search Console验证码',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://niutr.cn" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Header />
          <main className="container mx-auto px-4 py-8 pt-20">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}