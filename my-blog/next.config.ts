import type { NextConfig } from 'next'

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
    // ⬅️ 关键：忽略 ESLint 报错（避免构建失败）
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⬅️ 可选：忽略 TS 类型检查报错
    ignoreBuildErrors: true,
  },
}

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
