'use client'

import { useState, useEffect } from 'react'
import { PostData } from '@/lib/blog'
import BlogList from '@/components/BlogList'

interface BlogListWrapperProps {
  allPosts: PostData[]
  allTags: string[]
}

export default function BlogListWrapper({ allPosts, allTags }: BlogListWrapperProps) {
  const [selectedTag, setSelectedTag] = useState('')

  // 在客户端读取URL参数（避免使用useSearchParams）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tag = urlParams.get('tag') || ''
      setSelectedTag(tag)
      
      // 监听URL变化
      const handlePopState = () => {
        const newUrlParams = new URLSearchParams(window.location.search)
        const newTag = newUrlParams.get('tag') || ''
        setSelectedTag(newTag)
      }
      
      window.addEventListener('popstate', handlePopState)
      return () => window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  return (
    <BlogList 
      allPosts={allPosts} 
      allTags={allTags} 
      initialSelectedTag={selectedTag}
    />
  )
}