import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

// 检查是否在服务端环境
const isServer = typeof window === 'undefined' && typeof fs.readFileSync === 'function'

// 改进的预处理函数
function preprocessMDXContent(content: string): string {
  return content
    .replace(/style="([^"]*)"([^>]*>)/g, (match, styleString, rest) => {
      if (!styleString.trim()) return match;
      
      const styles: string[] = []
      styleString.split(';').forEach((rule: string) => {
        const [property, value] = rule.split(':').map((s: string) => s.trim())
        if (property && value) {
          const camelProperty = property.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())
          styles.push(`${camelProperty}: '${value}'`)
        }
      })
      
      if (styles.length === 0) return match;
      return `style={{${styles.join(', ')}}}${rest}`
    })
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
  pinned?: boolean
  pinnedOrder?: number
  coverImage?: string
  updatedAt?: string
  excerpt?: string
  canonical?: string
  noindex?: boolean
}

export function getAllPosts(): PostData[] {
  // 如果不在服务端环境，返回空数组
  if (!isServer) {
    console.warn('getAllPosts() 只能在服务端环境调用')
    return []
  }

  try {
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

    return allPosts.sort((post1, post2) => {
      if (post1.pinned && post2.pinned) {
        const order1 = post1.pinnedOrder || 0
        const order2 = post2.pinnedOrder || 0
        if (order1 !== order2) {
          return order1 - order2
        }
        return post1.date > post2.date ? -1 : 1
      }
      
      if (post1.pinned && !post2.pinned) return -1
      if (!post1.pinned && post2.pinned) return 1
      
      return post1.date > post2.date ? -1 : 1
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return []
  }
}

export function getPostBySlug(slug: string): PostData {
  if (!isServer) {
    throw new Error('getPostBySlug() 只能在服务端环境调用')
  }

  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const processedContent = preprocessMDXContent(content)

  return {
    slug,
    content: processedContent,
    readingTime: readingTime(content),
    title: data.title || '',
    date: data.date || '',
    description: data.description || '',
    tags: data.tags || [],
    pinned: data.pinned === true,
    pinnedOrder: typeof data.pinnedOrder === 'number' ? data.pinnedOrder : 0,
    coverImage: data.coverImage || undefined,
    updatedAt: data.updatedAt || undefined,
    excerpt: data.excerpt || undefined,
    canonical: data.canonical || undefined,
    noindex: data.noindex === true,
  }
}

export function getAllTags(): string[] {
  if (!isServer) {
    console.warn('getAllTags() 只能在服务端环境调用')
    return []
  }

  try {
    const allPosts = getAllPosts()
    const tags = new Set<string>()
    
    allPosts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag))
    })
    
    return Array.from(tags)
  } catch (error) {
    console.error('获取标签列表失败:', error)
    return []
  }
}

export function getPinnedPosts(): PostData[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => post.pinned)
}

export function getRegularPosts(): PostData[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => !post.pinned)
}

export function getPostsByTag(tag: string): PostData[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.tags.includes(tag))
}

export function getPostSlugs(): string[] {
  if (!isServer) {
    return []
  }

  try {
    if (!fs.existsSync(postsDirectory)) {
      return []
    }
    
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => name.replace(/\.mdx$/, ''))
  } catch (error) {
    console.error('获取文章slug列表失败:', error)
    return []
  }
}