'use client'
import Giscus from '@giscus/react'

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO || "terry9502/personal-blog"
  
  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <h3 className="text-2xl font-semibold text-slate-900 mb-6">评论</h3>
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
        theme="light"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}