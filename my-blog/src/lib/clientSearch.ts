import { PostData } from './blog'

// 搜索配置
const SEARCH_CONFIG = {
  minQueryLength: 2, // 最小搜索词长度
  highlightSnippetLength: 150, // 搜索结果摘要长度
  maxResults: 20 // 最大结果数量
}

// 清理和预处理搜索内容
function cleanContent(content: string): string {
  return content
    // 移除 MDX 导入和导出语句
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    // 移除代码块
    .replace(/```[\s\S]*?```/g, ' ')
    // 移除内联代码
    .replace(/`[^`]*`/g, ' ')
    // 移除图片语法
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 移除链接，保留文本
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 移除 HTML 标签
    .replace(/<[^>]*>/g, ' ')
    // 移除 Markdown 标题标记
    .replace(/^#{1,6}\s+/gm, '')
    // 移除多余空白
    .replace(/\s+/g, ' ')
    .trim()
}

// 计算搜索相关度分数
function calculateRelevanceScore(post: PostData, query: string): number {
  const lowerQuery = query.toLowerCase()
  let score = 0
  
  // 标题完全匹配 (最高权重)
  if (post.title.toLowerCase() === lowerQuery) {
    score += 100
  } else if (post.title.toLowerCase().includes(lowerQuery)) {
    // 标题部分匹配
    score += 50
    // 如果查询词在标题开头，额外加分
    if (post.title.toLowerCase().startsWith(lowerQuery)) {
      score += 20
    }
  }
  
  // 描述匹配
  if (post.description.toLowerCase().includes(lowerQuery)) {
    score += 30
  }
  
  // 标签完全匹配
  const exactTagMatch = post.tags.some((tag: string) => 
    tag.toLowerCase() === lowerQuery
  )
  if (exactTagMatch) {
    score += 40
  } else {
    // 标签部分匹配
    const partialTagMatch = post.tags.some((tag: string) => 
      tag.toLowerCase().includes(lowerQuery)
    )
    if (partialTagMatch) {
      score += 20
    }
  }
  
  // 内容匹配 (权重较低)
  const cleanedContent = cleanContent(post.content).toLowerCase()
  if (cleanedContent.includes(lowerQuery)) {
    // 根据匹配次数增加分数，但设置上限
    const matches = (cleanedContent.match(new RegExp(lowerQuery, 'g')) || []).length
    score += Math.min(matches * 5, 25)
  }
  
  return score
}

// 生成搜索结果摘要
function generateSnippet(content: string, query: string, maxLength: number = SEARCH_CONFIG.highlightSnippetLength): string {
  const cleanedContent = cleanContent(content)
  const lowerContent = cleanedContent.toLowerCase()
  const lowerQuery = query.toLowerCase()
  
  const queryIndex = lowerContent.indexOf(lowerQuery)
  
  if (queryIndex === -1) {
    // 如果没找到查询词，返回内容开头
    return cleanedContent.length > maxLength 
      ? cleanedContent.substring(0, maxLength) + '...'
      : cleanedContent
  }
  
  // 计算摘要的起始位置
  const start = Math.max(0, queryIndex - Math.floor(maxLength / 2))
  const end = Math.min(cleanedContent.length, start + maxLength)
  
  let snippet = cleanedContent.substring(start, end)
  
  // 在开头和结尾添加省略号
  if (start > 0) snippet = '...' + snippet
  if (end < cleanedContent.length) snippet = snippet + '...'
  
  return snippet
}

// 主要的客户端搜索函数
export interface SearchResult extends PostData {
  score?: number
  snippet?: string
  matchInfo?: {
    titleMatch: boolean
    descriptionMatch: boolean
    tagMatch: boolean
    contentMatch: boolean
  }
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  total: number
  message?: string
  suggestion?: string
  error?: string
}

export function searchPosts(posts: PostData[], query: string): SearchResponse {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return {
      results: [],
      query: '',
      total: 0
    }
  }

  // 检查最小搜索长度
  if (trimmedQuery.length < SEARCH_CONFIG.minQueryLength) {
    return {
      results: [],
      query: trimmedQuery,
      total: 0,
      message: `搜索词至少需要 ${SEARCH_CONFIG.minQueryLength} 个字符`,
      suggestion: '请输入更具体的关键词'
    }
  }

  const lowerQuery = trimmedQuery.toLowerCase()
  
  // 搜索和评分
  const searchResults: SearchResult[] = posts
    .map(post => {
      const score = calculateRelevanceScore(post, trimmedQuery)
      
      if (score === 0) return null
      
      return {
        ...post,
        score,
        snippet: generateSnippet(post.content, trimmedQuery),
        // 添加匹配信息用于调试
        matchInfo: {
          titleMatch: post.title.toLowerCase().includes(lowerQuery),
          descriptionMatch: post.description.toLowerCase().includes(lowerQuery),
          tagMatch: post.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery)),
          contentMatch: cleanContent(post.content).toLowerCase().includes(lowerQuery)
        }
      } as SearchResult
    })
    .filter((result): result is SearchResult => result !== null)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, SEARCH_CONFIG.maxResults)

  return {
    results: searchResults,
    query: trimmedQuery,
    total: searchResults.length,
    suggestion: searchResults.length === 0 ? '尝试使用更常见的关键词或检查拼写' : undefined
  }
}