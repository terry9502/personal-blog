// RSS工具函数
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function stripMdxToText(content: string): string {
  return content
    // 移除MDX/React导入和导出
    .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
    .replace(/export\s+.*?;?\s*/g, '')
    
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '[代码示例]')
    
    // 移除图片，保留alt文本
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '[$1]')
    
    // 移除链接，保留文本
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, '')
    
    // 移除粗体和斜体标记
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    
    // 移除内联代码
    .replace(/`([^`]*)`/g, '$1')
    
    // 转换列表项
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/^\s*\d+\.\s+/gm, '• ')
    
    // 移除HTML标签（如果有）
    .replace(/<[^>]*>/g, '')
    
    // 规范化空白字符
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    
    // 移除多余的空格
    .replace(/[ \t]{2,}/g, ' ')
}

export function generatePostSummary(content: string, maxLength: number = 200): string {
  const cleanText = stripMdxToText(content)
  
  if (cleanText.length <= maxLength) {
    return cleanText
  }
  
  // 在单词边界截断，避免截断到单词中间
  const truncated = cleanText.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }
  
  return truncated + '...'
}

export interface RssConfig {
  title: string
  description: string
  siteUrl: string
  feedUrl: string
  author: {
    name: string
    email: string
  }
  language: string
  copyright: string
}

export const defaultRssConfig: RssConfig = {
  title: 'Niutr\'s Blog',
  description: '软件工程专业学生的技术博客，分享学习历程、项目经验和生活思考',
  siteUrl: 'https://niutr.cn',
  feedUrl: 'https://niutr.cn/rss.xml',
  author: {
    name: 'Niutr',
    email: '1958577075@qq.com'
  },
  language: 'zh-CN',
  copyright: `© ${new Date().getFullYear()} Niutr's Blog`
}