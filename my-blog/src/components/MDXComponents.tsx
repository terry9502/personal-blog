'use client'
import React, { useState } from 'react'
import { MDXComponents } from 'mdx/types'
import { Copy, Check } from 'lucide-react'
import ClickableImage from './ClickableImage'

// 简单的复制按钮组件
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
      title={copied ? '已复制!' : '复制代码'}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}

// 获取代码文本的辅助函数
const getCodeText = (children: any): string => {
  if (typeof children === 'string') return children
  if (children?.props?.children) {
    return getCodeText(children.props.children)
  }
  if (Array.isArray(children)) {
    return children.map(getCodeText).join('')
  }
  return String(children || '')
}

const components: MDXComponents = {
  // 标题
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 mt-8 first:mt-0 border-b-2 border-gray-200 dark:border-gray-700 pb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 mt-8" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6" {...props}>
      {children}
    </h3>
  ),

  // 段落
  p: ({ children, ...props }) => (
    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),

  // 🔥 关键修复：简化的代码块处理
  pre: ({ children, ...props }: any) => {
    const codeText = getCodeText(children)
    
    return (
      <div className="relative group mb-6">
        <pre className="hljs" {...props}>
          {children}
        </pre>
        <CopyButton text={codeText} />
      </div>
    )
  },

  // 🔥 关键修复：简化的内联代码处理
  code: ({ children, className, ...props }: any) => {
    // 代码块内的代码，保持原样
    if (className?.includes('language-')) {
      return <code className={className} {...props}>{children}</code>
    }
    
    // 内联代码
    return (
      <code {...props}>
        {children}
      </code>
    )
  },

  // 列表
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 ml-4 text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 ml-4 text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </li>
  ),

  // 引用块
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900 pl-6 py-4 my-6 rounded-r-lg" {...props}>
      <div className="text-blue-900 dark:text-blue-100">{children}</div>
    </blockquote>
  ),

  // 链接
  a: ({ href, children, ...props }: any) => (
    <a 
      href={href} 
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline hover:no-underline transition-all"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // 图片
  img: ({ src, alt, ...props }: any) => (
    <ClickableImage 
      src={src || ''} 
      alt={alt || ''} 
      {...props}
    />
  ),

  // 强调
  strong: ({ children, ...props }: any) => (
    <strong className="font-bold text-slate-900 dark:text-white" {...props}>
      {children}
    </strong>
  ),

  // 表格
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: any) => (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: any) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100" {...props}>
      {children}
    </td>
  ),

  // 水平分割线
  hr: (props: any) => (
    <hr className="my-8 border-gray-200 dark:border-gray-700" {...props} />
  ),
}

export default components