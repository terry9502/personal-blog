// src/components/EnhancedMarkdownRenderer.tsx
'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Components } from 'react-markdown'
import { useState } from 'react'
import rehypeRaw from 'rehype-raw'

interface EnhancedMarkdownRendererProps {
  content: string
  className?: string
}

export default function EnhancedMarkdownRenderer({ 
  content, 
  className = '' 
}: EnhancedMarkdownRendererProps) {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }))
      }, 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 预处理内容，处理font标签
  const preprocessContent = (content: string) => {
    return content
      // 处理 style 属性的 font 标签
      .replace(/<font\s+style=['"]([^'"]*?)['"][^>]*?>(.*?)<\/font>/gi, (match, style, text) => {
        // 解析样式
        const colorMatch = style.match(/color:\s*([^;]+)/i)
        const color = colorMatch ? colorMatch[1].trim() : '#DF2A3F'
        return `<span style="color: ${color}; font-weight: bold;">${text}</span>`
      })
      // 处理 color 属性的 font 标签
      .replace(/<font\s+color=['"]([^'"]*?)['"][^>]*?>(.*?)<\/font>/gi, (match, color, text) => {
        return `<span style="color: ${color}; font-weight: bold;">${text}</span>`
      })
      // 处理只有内容的 font 标签
      .replace(/<font[^>]*?>(.*?)<\/font>/gi, (match, text) => {
        return `<span style="color: #DF2A3F; font-weight: bold;">${text}</span>`
      })
  }

  const components: Components = {
    // 表格组件 - 完美样式
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full border-collapse bg-white dark:bg-gray-900">
          {children}
        </table>
      </div>
    ),
    
    thead: ({ children }: any) => (
      <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        {children}
      </thead>
    ),
    
    tbody: ({ children }: any) => (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
        {children}
      </tbody>
    ),
    
    tr: ({ children }: any) => (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
        {children}
      </tr>
    ),
    
    th: ({ children }: any) => (
      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white border-b-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-gray-700">
        {children}
      </th>
    ),
    
    td: ({ children }: any) => (
      <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
        {children}
      </td>
    ),

    // 标题组件
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-8 mb-6 border-b-2 border-blue-500 pb-2">
        {children}
      </h1>
    ),
    
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
        {children}
      </h2>
    ),
    
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
        {children}
      </h3>
    ),
    
    h4: ({ children }: any) => (
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
        {children}
      </h4>
    ),

    // 段落 - 使用div避免嵌套问题
    p: ({ children }: any) => (
      <div className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base">
        {children}
      </div>
    ),

    // 列表
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside mb-6 space-y-2 ml-4 text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    ),
    
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 ml-4 text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    ),
    
    li: ({ children }: any) => (
      <li className="text-gray-700 dark:text-gray-300 mb-1">
        {children}
      </li>
    ),

    // 引用块
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-blue-50 dark:bg-gray-800 italic text-gray-700 dark:text-gray-300 rounded-r-lg">
        {children}
      </blockquote>
    ),

    // 代码块
    pre: ({ children }: any) => {
      const codeContent = String(children).replace(/\n$/, '')
      const codeId = Math.random().toString(36).substr(2, 9)
      
      return (
        <div className="relative group mb-6">
          <button
            onClick={() => copyToClipboard(codeContent, codeId)}
            className="absolute top-3 right-3 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          >
            {copiedStates[codeId] ? '已复制!' : '复制'}
          </button>
          <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
            {children}
          </pre>
        </div>
      )
    },
    
    code: ({ children, className }: any) => {
      const isInline = !className?.includes('language-')
      
      if (isInline) {
        return (
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400">
            {children}
          </code>
        )
      }
      return (
        <code className={className}>
          {children}
        </code>
      )
    },

    // 链接
    a: ({ href, children }: any) => (
      <a 
        href={href} 
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline hover:no-underline transition-colors duration-200"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),

    // 图片 - 使用span避免嵌套问题
    img: ({ src, alt }: any) => (
      <span className="block my-8 text-center">
        <img 
          src={src} 
          alt={alt || ''} 
          className="max-w-full h-auto rounded-lg shadow-lg mx-auto hover:shadow-xl transition-shadow duration-300"
          loading="lazy"
        />
        {alt && (
          <span className="block text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
            {alt}
          </span>
        )}
      </span>
    ),

    // 强调
    strong: ({ children }: any) => (
      <strong className="font-bold text-gray-900 dark:text-white">
        {children}
      </strong>
    ),
    
    em: ({ children }: any) => (
      <em className="italic text-gray-700 dark:text-gray-300">
        {children}
      </em>
    ),

    // 水平分割线
    hr: () => (
      <hr className="my-8 border-gray-300 dark:border-gray-600" />
    ),

    // 删除线
    del: ({ children }: any) => (
      <del className="text-gray-500 dark:text-gray-400 line-through">
        {children}
      </del>
    ),

    // 处理内联HTML - span标签
    span: ({ children, style, ...props }: any) => (
      <span style={style} {...props}>
        {children}
      </span>
    ),
  }

  // 处理内容
  const processedContent = preprocessContent(content)

  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight,rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}