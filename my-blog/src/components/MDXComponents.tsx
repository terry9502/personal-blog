// src/components/MDXComponents.tsx - 最终修复版本
import React from 'react'
import { MDXComponents } from 'mdx/types'
import { CopyButton } from './CopyButton'
import ClickableImage from './ClickableImage'
import TableWrapper from './TableWrapper'

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
  // ==================== 标题组件 ====================
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
  h4: ({ children, ...props }) => (
    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 mt-4" {...props}>
      {children}
    </h4>
  ),

  // ==================== 段落组件 ====================
  p: ({ children, ...props }) => {
    // 智能检测是否包含块级元素
    const hasBlockElements = React.Children.toArray(children).some((child) => {
      if (React.isValidElement(child)) {
        const type = child.type
        if (typeof type === 'string') {
          return ['img', 'div', 'figure', 'video', 'iframe', 'table'].includes(type)
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

  // ==================== 引用块 ====================
  blockquote: ({ children, ...props }) => (
    <Quote>{children}</Quote>
  ),

  // ==================== 列表组件 ====================
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

  // ==================== 强化表格组件 ====================
  table: ({ children, ...props }) => (
    <TableWrapper>
      <table 
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          border: '1px solid #e5e7eb',
          backgroundColor: 'white'
        }}
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        {...props}
      >
        {children}
      </table>
    </TableWrapper>
  ),
  
  thead: ({ children, ...props }) => (
    <thead 
      style={{ 
        backgroundColor: '#f9fafb',
        display: 'table-header-group'
      }}
      className="bg-gray-50 dark:bg-gray-800"
      {...props}
    >
      {children}
    </thead>
  ),
  
  tbody: ({ children, ...props }) => (
    <tbody 
      style={{ 
        backgroundColor: '#ffffff',
        display: 'table-row-group'
      }}
      className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
      {...props}
    >
      {children}
    </tbody>
  ),
  
  tr: ({ children, ...props }) => (
    <tr 
      style={{
        borderBottom: '1px solid #e5e7eb',
        display: 'table-row'
      }}
      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
      {...props}
    >
      {children}
    </tr>
  ),
  
  th: ({ children, ...props }) => (
    <th 
      style={{
        padding: '12px 16px',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '0.875rem',
        color: '#374151',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        display: 'table-cell',
        verticalAlign: 'middle'
      }}
      className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
      {...props}
    >
      {children}
    </th>
  ),
  
  td: ({ children, ...props }) => (
    <td 
      style={{
        padding: '12px 16px',
        fontSize: '0.875rem',
        color: '#1f2937',
        border: '1px solid #e5e7eb',
        display: 'table-cell',
        verticalAlign: 'top'
      }}
      className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </td>
  ),

  // ==================== 图片组件 ====================
  img: ({ src, alt, ...props }) => {
    const imageSrc = src?.startsWith('/') ? src : `/images/${src}`
    
    return (
      <ClickableImage
        src={imageSrc}
        alt={alt || ''}
        className="max-w-full h-auto rounded-lg shadow-md my-6 mx-auto block"
        {...props}
      />
    )
  },

  // ==================== 代码块组件 ====================
  pre: ({ children, ...props }) => {
    // 安全的代码提取函数
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
    
    // 提取语言信息
    let language = 'code'
    if (React.isValidElement(children)) {
      const className = (children as any)?.props?.className || ''
      language = className.replace('language-', '') || 'code'
    }

    return (
      <div className="relative mb-6">
        <div className="flex items-center justify-between bg-slate-800 text-slate-300 px-4 py-2 text-sm rounded-t-lg">
          <span className="font-mono">{language}</span>
          <CopyButton text={codeText} />
        </div>
        <pre className="bg-slate-900 text-slate-100 p-4 overflow-x-auto rounded-b-lg m-0" {...props}>
          {children}
        </pre>
      </div>
    )
  },

  // 内联代码
  code: (props: any) => {
    const { children, className, ...restProps } = props
    
    // 如果在pre标签内，直接返回
    if (className?.includes('language-')) {
      return <code className={className} {...restProps}>{children}</code>
    }
    
    return (
      <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded text-sm font-mono" {...restProps}>
        {children}
      </code>
    )
  },

  // ==================== 链接和文本样式 ====================
  a: ({ children, href, ...props }) => (
    <a 
      href={href} 
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // 分隔线
  hr: ({ ...props }) => (
    <hr className="my-8 border-gray-200 dark:border-gray-700" {...props} />
  ),

  // 强调和加粗
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-slate-900 dark:text-white" {...props}>
      {children}
    </strong>
  ),
  
  em: ({ children, ...props }) => (
    <em className="italic text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </em>
  ),

  // 删除线
  del: ({ children, ...props }) => (
    <del className="line-through text-slate-500 dark:text-slate-400" {...props}>
      {children}
    </del>
  ),

  // 小字体
  small: ({ children, ...props }) => (
    <small className="text-sm text-slate-600 dark:text-slate-400" {...props}>
      {children}
    </small>
  ),

  // 处理font标签（如果MDX中有）
  font: ({ children, style, color, ...props }: any) => (
    <span style={style || { color: color || '#DF2A3F', fontWeight: 'bold' }} {...props}>
      {children}
    </span>
  ),

  // ==================== 自定义组件 ====================
  Highlight,
  Quote,
  ClickableImage,
}

export default components