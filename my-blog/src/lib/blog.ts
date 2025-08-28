import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

// 确保只在服务端使用
if (typeof window !== 'undefined') {
  throw new Error('Blog utilities can only be used on the server side')
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
  // 如果目录不存在，返回空数组
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

  return {
    slug,
    content,
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