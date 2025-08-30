'use client'
import Giscus from '@giscus/react'

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <h3 className="text-2xl font-semibold text-slate-900 mb-6">评论</h3>
      <Giscus
        id="comments"
        repo="terry9502/personal-blog"
        repoId="R_kgDOPl3H1g" // 从 giscus.app 获取
        category="General"
        categoryId="DIC_kwDOPl3H1s4Cuwip" // 从 giscus.app 获取
        mapping="pathname"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}