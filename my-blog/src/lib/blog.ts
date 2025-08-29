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

  return allPosts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
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