import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 移除 experimental.mdxRs，使用标准MDX配置
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack: (config: any) => {
    // 解决客户端fs模块问题
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }
    return config
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