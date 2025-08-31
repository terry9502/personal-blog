'use client'
import React from 'react'
import { MDXComponents } from 'mdx/types'
import { CopyButton } from './CopyButton'
import ClickableImage from './ClickableImage'

console.log('MDXComponents file loaded')

// 高亮文本组件
const Highlight = ({ children, color = '#DF2A3F' }: { children: React.ReactNode, color?: string }) => (
  <span style={{ color, fontWeight: 'bold' }}>{children}</span>
)

// 引用块组件
const Quote = ({ children }: { children: React.ReactNode }) => (
  <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900 pl-6 py-4 my-6 rounded-r-lg">
    <div className="text-blue-900 dark:text-blue-100">{children}</div>
  </blockquote>
)

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

  // 段落 - 智能检测块级元素
  p: ({ children, ...props }) => {
    const hasBlockElements = React.Children.toArray(children).some((child) => {
      if (React.isValidElement(child)) {
        const type = child.type
        if (typeof type === 'string') {
          return ['img', 'div', 'figure', 'video', 'iframe'].includes(type)
        }
        if (typeof type === 'function') {
          return true
        }
      }
      return false
    })

    if (hasBlockElements) {
      return (
        <div className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed" {...props}>
          {children}
        </div>
      )
    }

    return (
      <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    )
  },

  // 引用块
  blockquote: ({ children, ...props }) => (
    <Quote>{children}</Quote>
  ),

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

  // 代码块处理
  pre: ({ children, ...props }) => {
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

    const codeText = getCodeText(children)

    return (
      <div className="relative group mb-4">
        <pre className="bg-gray-900 text-green-400 dark:bg-gray-800 dark:text-green-300 rounded-lg p-4 overflow-x-auto" {...props}>
          {children}
        </pre>
        <CopyButton text={codeText} />
      </div>
    )
  },
  code: ({ children, className, ...props }) => {
    if (className?.includes('language-')) {
      return <code className={className} {...props}>{children}</code>
    }
    return (
      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400" {...props}>
        {children}
      </code>
    )
  },

  // 链接
  a: ({ href, children, ...props }) => (
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

  // 图片 - 支持点击放大（添加调试）
  img: ({ src, alt, ...props }) => {
    console.log('=== MDX IMG COMPONENT CALLED ===')
    console.log('Image props:', { src, alt, props })
    console.log('ClickableImage component:', ClickableImage)
    
    return (
      <ClickableImage 
        src={src || ''} 
        alt={alt || ''} 
        {...props}
      />
    )
  },

  // 强调
  strong: ({ children, ...props }) => (
    <strong className="font-bold text-slate-900 dark:text-white" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </em>
  ),

  // 处理 font 标签
  font: ({ children, style, color, ...props }) => {
    return (
      <span style={style || { color: color || '#DF2A3F', fontWeight: 'bold' }} {...props}>
        {children}
      </span>
    );
  },

  // 自定义组件
  Highlight,
  Quote,
}

console.log('MDX Components object created:', components)

export default components