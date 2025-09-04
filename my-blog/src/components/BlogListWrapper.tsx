'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PostData } from '@/lib/blog'
import BlogList from '@/components/BlogList'

interface BlogListWrapperProps {
  allPosts: PostData[]
  allTags: string[]
}

export default function BlogListWrapper({ allPosts, allTags }: BlogListWrapperProps) {
  const searchParams = useSearchParams()
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    const tag = searchParams.get('tag') || ''
    setSelectedTag(tag)
  }, [searchParams])

  return (
    <BlogList 
      allPosts={allPosts} 
      allTags={allTags} 
      initialSelectedTag={selectedTag}
    />
  )
}