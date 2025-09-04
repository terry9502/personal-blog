import { getAllPosts } from '@/lib/blog'
import SearchClient from '@/components/SearchClient'

export const metadata = {
  title: '搜索文章',
  description: '搜索博客中的技术文章'
}

export default function SearchPage() {
  let allPosts: any[] = []
  
  try {
    allPosts = getAllPosts()
  } catch (error) {
    console.error('获取文章数据失败:', error)
    allPosts = []
  }
  
  return (
    <div>
      <SearchClient />
      <script 
        id="posts-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(allPosts)
        }}
      />
    </div>
  )
}