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
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypeHighlight, {
        // 简化配置，让 highlight.js 自动检测语言
        detect: true,
        ignoreMissing: true,
        // 可选：指定特定语言的别名
        aliases: {
          'js': 'javascript',
          'ts': 'typescript',
          'py': 'python',
          'sh': 'bash',
          'yml': 'yaml'
        }
      }]
    ],
  },
})

export default withMDX(nextConfig)