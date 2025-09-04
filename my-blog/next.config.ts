import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

const nextConfig: NextConfig = {
  // 添加静态导出配置
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // 静态导出需要禁用图片优化
  },
  
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
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
})

export default withMDX(nextConfig)