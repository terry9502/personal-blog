// src/lib/blog.ts - 支持置顶功能版本
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

// 确保只在服务端使用
if (typeof window !== 'undefined') {
  throw new Error('Blog utilities can only be used on the server side')
}

// 改进的预处理函数
function preprocessMDXContent(content: string): string {
  return content
    // 修复所有 style="..." 为 style={{...}}
    .replace(/style="([^"]*)"([^>]*>)/g, (match, styleString, rest) => {
      if (!styleString.trim()) return match;
      
      const styles: string[] = []
      styleString.split(';').forEach((rule: string) => {
        const [property, value] = rule.split(':').map((s: string) => s.trim())
        if (property && value) {
          // 转换 CSS 属性名为驼峰命名
          const camelProperty = property.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())
          styles.push(`${camelProperty}: '${value}'`)
        }
      })
      
      if (styles.length === 0) return match;
      return `style={{${styles.join(', ')}}}${rest}`
    })
    // 修复可能的其他样式问题
    .replace(/color:#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g, "color: '#$1'")
    .replace(/color:rgb\(([^)]+)\)/g, "color: 'rgb($1)'")
}

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

export interface PostData {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  content: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  // 新增置顶字段
  pinned?: boolean
  pinnedOrder?: number // 置顶文章的排序，数字越小越靠前
  // 新增SEO相关字段
  coverImage?: string      // 文章封面图片
  updatedAt?: string       // 文章更新时间
  excerpt?: string         // 文章摘要
  canonical?: string       // 规范链接
  noindex?: boolean        // 是否不被搜索引擎索引
}

export function getAllPosts(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const slug = name.replace(/\.mdx$/, '')
      return getPostBySlug(slug)
    })

  // 新的排序逻辑：置顶文章优先，然后按日期排序
  return allPosts.sort((post1, post2) => {
    // 如果两篇文章都是置顶文章，按 pinnedOrder 排序
    if (post1.pinned && post2.pinned) {
      const order1 = post1.pinnedOrder || 0
      const order2 = post2.pinnedOrder || 0
      if (order1 !== order2) {
        return order1 - order2 // 数字越小越靠前
      }
      // 如果 pinnedOrder 相同，按日期排序
      return post1.date > post2.date ? -1 : 1
    }
    
    // 如果只有一篇是置顶文章，置顶文章排在前面
    if (post1.pinned && !post2.pinned) return -1
    if (!post1.pinned && post2.pinned) return 1
    
    // 如果都不是置顶文章，按日期排序
    return post1.date > post2.date ? -1 : 1
  })
}

// 获取置顶文章
export function getPinnedPosts(): PostData[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => post.pinned)
}

// 获取非置顶文章
export function getRegularPosts(): PostData[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => !post.pinned)
}

// 分页获取文章（置顶文章会在第一页优先显示）
export function getPostsWithPagination(page: number = 1, postsPerPage: number = 10): {
  posts: PostData[]
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
} {
  const allPosts = getAllPosts()
  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  
  const startIndex = (page - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  
  const posts = allPosts.slice(startIndex, endIndex)
  
  return {
    posts,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }
}

export function getPostBySlug(slug: string): PostData {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  // 预处理内容
  const processedContent = preprocessMDXContent(content)

  return {
    slug,
    content: processedContent,
    readingTime: readingTime(content),
    title: data.title || '',
    date: data.date || '',
    description: data.description || '',
    tags: data.tags || [],
    // 处理置顶相关字段
    pinned: data.pinned === true,
    pinnedOrder: typeof data.pinnedOrder === 'number' ? data.pinnedOrder : 0,
      // 新增字段处理：
    coverImage: data.coverImage || undefined,
    updatedAt: data.updatedAt || undefined,
    excerpt: data.excerpt || undefined,  
    canonical: data.canonical || undefined,
    noindex: data.noindex === true,
  }
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx$/, ''))
}

export function getPostsByTag(tag: string): PostData[] {
  const allPosts = getAllPosts() // 已经包含置顶排序逻辑
  return allPosts.filter((post) => post.tags.includes(tag))
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts()
  const tags = new Set<string>()
  
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag))
  })
  
  return Array.from(tags)
}

// 获取指定标签的置顶文章
export function getTagPosts(tag: string): PostData[] {
  const allPosts = getAllPosts() // 已经包含置顶排序
  return allPosts.filter((post) => post.tags.includes(tag))
}