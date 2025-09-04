// 移除 searchParams 和 dynamic 配置
import { getAllPosts, getAllTags } from '@/lib/blog'
import BlogListWrapper from '@/components/BlogListWrapper'

export const metadata = {
  title: '技术博客 - 所有文章',
  description: '浏览所有技术文章，支持按标签筛选'
}

export default function BlogPage() {
  const allPosts = getAllPosts()
  const allTags = getAllTags()

  return (
    <BlogListWrapper 
      allPosts={allPosts} 
      allTags={allTags} 
    />
  )
}