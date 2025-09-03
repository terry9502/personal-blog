// src/app/blog/page.tsx
import { getAllPosts, getAllTags } from '@/lib/blog'
import BlogList from '@/components/BlogList'

export const metadata = {
  title: '技术博客 - 所有文章',
  description: '浏览所有技术文章，支持按标签筛选'
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  // 在服务端获取数据
  const allPosts = getAllPosts()
  const allTags = getAllTags()
  
  // 等待 searchParams
  const params = await searchParams
  const selectedTag = typeof params.tag === 'string' ? params.tag : ''

  return (
    <BlogList 
      allPosts={allPosts} 
      allTags={allTags} 
      initialSelectedTag={selectedTag}
    />
  )
}