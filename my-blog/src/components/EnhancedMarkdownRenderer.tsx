// src/components/EnhancedMarkdownRenderer.tsx
'use client'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Copy, Check } from 'lucide-react'

interface EnhancedMarkdownRendererProps {
  content: string
  className?: string
}

// 增强的复制按钮组件
interface CopyButtonProps {
  text: string
  className?: string
  variant?: 'default' | 'minimal' | 'floating'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className = '',
  variant = 'default',
  position = 'top-right'
}) => {
  const [copied, setCopied] = React.useState<boolean>(false)
  const [isVisible, setIsVisible] = React.useState<boolean>(false)
  const timeoutRef = React.useRef<number | undefined>(undefined)

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 获取变体样式
  const getVariantClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center w-8 h-8 rounded transition-all duration-200'
    
    switch (variant) {
      case 'minimal':
        return `${baseClasses} text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700`
      case 'floating':
        return `${baseClasses} bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-lg border border-slate-200 dark:border-slate-600 hover:shadow-xl hover:scale-105`
      default:
        return `${baseClasses} bg-slate-700 hover:bg-slate-600 text-white opacity-70 hover:opacity-100`
    }
  }

  // 获取位置样式
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'absolute top-2 left-2 z-10'
      case 'bottom-right':
        return 'absolute bottom-2 right-2 z-10'
      case 'bottom-left':
        return 'absolute bottom-2 left-2 z-10'
      default:
        return 'absolute top-2 right-2 z-10'
    }
  }

  // 复制到剪贴板的多种方法
  const copyToClipboard = async (textToCopy: string): Promise<boolean> => {
    try {
      // 方法1: 现代浏览器的 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy)
        return true
      }

      // 方法2: 兼容性方案 - 使用 execCommand
      const textArea = document.createElement('textarea')
      textArea.value = textToCopy
      
      // 设置样式使其不可见
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      textArea.style.opacity = '0'
      textArea.style.zIndex = '-1'
      textArea.setAttribute('readonly', 'readonly')
      
      document.body.appendChild(textArea)
      
      // 选择文本
      textArea.focus()
      textArea.select()
      textArea.setSelectionRange(0, textArea.value.length)
      
      // 执行复制
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      return successful
    } catch (error) {
      console.error('复制失败:', error)
      return false
    }
  }

  // 处理复制操作
  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const success = await copyToClipboard(text)
      
      if (success) {
        setCopied(true)
        setIsVisible(true)
        
        // 清除之前的定时器
        if (timeoutRef.current !== undefined) {
          window.clearTimeout(timeoutRef.current)
        }
        
        // 设置新的定时器
        timeoutRef.current = window.setTimeout(() => {
          setCopied(false)
          setIsVisible(false)
        }, 2000)
      }
    } catch (error) {
      console.error('复制操作失败:', error)
    }
  }

  const variantClasses = getVariantClasses()
  const positionClasses = getPositionClasses()

  return (
    <React.Fragment>
      <button
        onClick={handleCopy}
        className={`${positionClasses} ${variantClasses} ${className} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
        title={copied ? '已复制!' : '复制代码'}
        aria-label={copied ? '已复制到剪贴板' : '复制代码到剪贴板'}
        type="button"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      {/* 反馈提示 */}
      {isVisible && (
        <div
          className={`${positionClasses} ${
            position.includes('right') ? '-translate-x-16' : 'translate-x-16'
          } bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-all duration-200 pointer-events-none z-20`}
          style={{
            marginTop: position.includes('top') ? '0' : '-2rem',
            marginBottom: position.includes('bottom') ? '0' : '-2rem'
          }}
        >
          {copied ? '已复制!' : '复制失败'}
          {/* 小箭头 */}
          <div
            className={`absolute w-2 h-2 bg-slate-900 transform rotate-45 ${
              position.includes('right')
                ? 'right-0 translate-x-1'
                : 'left-0 -translate-x-1'
            } ${
              position.includes('top')
                ? 'top-1/2 -translate-y-1/2'
                : 'bottom-1/2 translate-y-1/2'
            }`}
          />
        </div>
      )}
    </React.Fragment>
  )
}

// 代码块包装器组件
interface CodeBlockWrapperProps {
  children: React.ReactNode
  code: string
  language?: string
  className?: string
}

const CodeBlockWrapper: React.FC<CodeBlockWrapperProps> = ({
  children,
  code,
  language,
  className = ''
}) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(false)

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 语言标签 */}
      {language && (
        <div className="absolute top-2 left-4 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded z-10">
          {language}
        </div>
      )}
      
      {/* 复制按钮 */}
      <div className={`transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <CopyButton
          text={code}
          variant="default"
          position="top-right"
        />
      </div>

      {/* 代码内容 */}
      {children}
    </div>
  )
}

// 处理内容预处理
const preprocessContent = (content: string): string => {
  // 处理自定义组件
  let processed = content
  
  // 处理 <Highlight> 组件
  processed = processed.replace(
    /<Highlight\s+color=["']([^"']+)["']>([^<]+)<\/Highlight>/g,
    '<span style="color: $1; font-weight: bold;">$2</span>'
  )
  
  // 处理没有color属性的 <Highlight> 组件
  processed = processed.replace(
    /<Highlight>([^<]+)<\/Highlight>/g,
    '<span style="color: #DF2A3F; font-weight: bold;">$1</span>'
  )
  
  // 处理 <Quote> 组件
  processed = processed.replace(
    /<Quote>([\s\S]*?)<\/Quote>/g,
    '> $1'
  )
  
  // 处理font标签 - 保持与原版本兼容
  processed = processed
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
  
  return processed
}

// 提取代码内容的辅助函数
const extractCodeContent = (children: any): string => {
  if (typeof children === 'string') {
    return children
  }
  
  if (Array.isArray(children)) {
    return children.map(extractCodeContent).join('')
  }
  
  if (children?.props?.children) {
    return extractCodeContent(children.props.children)
  }
  
  return String(children || '')
}

// 检测编程语言
const detectLanguage = (className: string): string => {
  const match = className?.match(/language-(\w+)/)
  return match ? match[1] : ''
}

// 主组件 - 使用命名导出
export const EnhancedMarkdownRenderer: React.FC<EnhancedMarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  const components = {
    // 表格组件 - 保持与原版本兼容的样式
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

    // 增强的代码块组件
    pre: ({ children, className, ...props }: any) => {
      const codeContent = extractCodeContent(children)
      const language = detectLanguage(className || '')
      
      return (
        <CodeBlockWrapper
          code={codeContent}
          language={language}
          className="mb-6"
        >
          <pre 
            className="bg-gray-900 dark:bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed"
            {...props}
          >
            {children}
          </pre>
        </CodeBlockWrapper>
      )
    },
    
    // 内联代码
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
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

// 同时提供默认导出以保持向后兼容
export default EnhancedMarkdownRenderer