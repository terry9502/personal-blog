// src/lib/relatedPosts.ts
import { PostData } from './blog'

interface PostWithScore extends PostData {
  score: number
}

export function getRelatedPosts(currentPost: PostData, allPosts: PostData[], maxResults: number = 3): PostData[] {
  // 排除当前文章
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug)
  
  if (otherPosts.length === 0) return []

  // 计算相关度分数
  const postsWithScores: PostWithScore[] = otherPosts.map(post => ({
    ...post,
    score: calculateRelatedScore(currentPost, post)
  }))

  // 按分数排序并返回前 maxResults 个
  return postsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ score, ...post }) => post)
}

function calculateRelatedScore(currentPost: PostData, otherPost: PostData): number {
  let score = 0

  // 1. 标签相似度（权重最高：60%）
  const commonTags = currentPost.tags.filter(tag => otherPost.tags.includes(tag))
  const tagSimilarity = commonTags.length / Math.max(currentPost.tags.length, otherPost.tags.length, 1)
  score += tagSimilarity * 0.6

  // 2. 标题关键词相似度（权重：25%）
  const titleSimilarity = calculateTextSimilarity(currentPost.title, otherPost.title)
  score += titleSimilarity * 0.25

  // 3. 描述相似度（权重：10%）
  const descSimilarity = calculateTextSimilarity(currentPost.description, otherPost.description)
  score += descSimilarity * 0.1

  // 4. 时间接近度（权重：5%） - 最近的文章稍微加分
  const timeDiff = Math.abs(new Date(currentPost.date).getTime() - new Date(otherPost.date).getTime())
  const maxTimeDiff = 365 * 24 * 60 * 60 * 1000 // 一年的毫秒数
  const timeScore = 1 - Math.min(timeDiff / maxTimeDiff, 1)
  score += timeScore * 0.05

  return score
}

function calculateTextSimilarity(text1: string, text2: string): number {
  // 简单的文本相似度计算 - 基于共同关键词
  const words1 = extractKeywords(text1)
  const words2 = extractKeywords(text2)
  
  if (words1.length === 0 || words2.length === 0) return 0
  
  const commonWords = words1.filter(word => words2.includes(word))
  return commonWords.length / Math.max(words1.length, words2.length)
}

function extractKeywords(text: string): string[] {
  // 提取关键词：去除常用词，保留有意义的词汇
  const stopWords = new Set([
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '里', '后', '以', '所', '如果', '但是', '因为', '所以', '可以', '应该', '需要', '使用', '通过', '这样', '这种', '这个', '那个', '什么', '怎么', '为什么', '怎样'
  ])

  return text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff]/g, ' ') // 保留中英文和数字
    .split(/\s+/)
    .filter(word => word.length >= 2 && !stopWords.has(word))
    .slice(0, 10) // 只取前10个关键词
}

// 获取标签相关的文章（用于标签页面的推荐）
export function getPostsByTagRelevance(targetTag: string, allPosts: PostData[], maxResults: number = 4): PostData[] {
  return allPosts
    .filter(post => post.tags.includes(targetTag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxResults)
}

// 获取热门标签（按文章数量排序）
export function getPopularTags(allPosts: PostData[], maxResults: number = 6): Array<{tag: string, count: number}> {
  const tagCounts = new Map<string, number>()
  
  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxResults)
}