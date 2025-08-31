'use client'
import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO || "terry9502/personal-blog"
  
  // 确保组件在客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  // 获取当前的主题
  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light'
  
  if (!mounted) {
    return (
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">评论</h3>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg h-32 animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">评论</h3>
      <Giscus
        id="comments"
        repo={repo as `${string}/${string}`}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "R_kgDOPl3H1g"}
        category="General"
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "DIC_kwDOPl3H1s4Cuwip"}
        mapping="pathname"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={currentTheme} // 动态切换主题
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}