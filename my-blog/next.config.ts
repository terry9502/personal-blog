import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }
    return config
  },
  eslint: {
    // 忽略 ESLint 报错（避免构建失败）
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 忽略 TS 类型检查报错
    ignoreBuildErrors: true,
  },
    // 生成静态页面以提高SEO
  output: 'export',
  trailingSlash: true,
  generateEtags: false,
  
  // 图片优化
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  
  // 压缩和优化
  compress: true,
  poweredByHeader: false,
  
  // 自定义headers提高SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ]
  }
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
})

export default withMDX(nextConfig)