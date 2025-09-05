// src/components/EnhancedMarkdownRenderer.tsx
'use client'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Copy, Check, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

interface EnhancedMarkdownRendererProps {
  content: string
  className?: string
}

// ===== 图片放大模态框组件 =====
function ImageZoomModal({ src, alt, isOpen, onClose }: { 
  src: string; 
  alt: string; 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const [scale, setScale] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })

  // 重置状态
  const resetTransform = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  // 关闭模态框时重置
  React.useEffect(() => {
    if (!isOpen) {
      resetTransform()
    }
  }, [isOpen])

  // ESC键关闭和快捷键
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === '+' || e.key === '=') {
        setScale(prev => Math.min(prev + 0.2, 3))
      } else if (e.key === '-') {
        setScale(prev => Math.max(prev - 0.2, 0.5))
      } else if (e.key === 'r' || e.key === 'R') {
        setRotation(prev => prev + 90)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // 鼠标拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3))
  }

  // 图片点击放大/缩小
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (scale === 1) {
      setScale(2) // 单击放大到2倍
    } else {
      setScale(1) // 重置到1倍
      setPosition({ x: 0, y: 0 })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95">
      {/* 顶部工具栏 */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        <div className="bg-black bg-opacity-80 text-white rounded-lg px-3 py-2 text-sm">
          缩放: {Math.round(scale * 100)}%
        </div>
        
        <div className="flex bg-black bg-opacity-80 rounded-lg p-1">
          <button
            onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-all"
            title="缩小"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={() => setScale(prev => Math.min(prev + 0.2, 3))}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-all"
            title="放大"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setRotation(prev => prev + 90)}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-all"
            title="旋转"
          >
            <RotateCw size={18} />
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-black bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all"
          title="关闭"
        >
          <X size={18} />
        </button>
      </div>

      {/* 主要显示区域 */}
      <div 
        className="w-full h-full flex items-center justify-center cursor-pointer"
        onClick={onClose}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-[90vw] max-h-[90vh] object-contain select-none transition-transform duration-300"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            cursor: scale > 1 ? 
              (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
          }}
          onClick={handleImageClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      {/* 使用提示 */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-xs p-3 rounded-lg max-w-48">
        <div className="space-y-1">
          <div>ESC: 关闭</div>
          <div>滚轮: 缩放</div>
          <div>拖拽: 移动</div>
          <div>+/-: 缩放</div>
          <div>R: 旋转</div>
        </div>
      </div>
    </div>
  )
}

// ===== 可点击图片组件 =====
function ClickableImageInline({ src, alt }: { src: string; alt: string }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <>
      <span className="block my-8 text-center group">
        <div className="relative inline-block">
          <img 
            src={src} 
            alt={alt || ''} 
            className="max-w-full h-auto rounded-lg shadow-lg mx-auto hover:shadow-xl transition-all duration-300 cursor-pointer group-hover:brightness-110 group-hover:scale-[1.02]"
            loading="lazy"
            onClick={() => setIsModalOpen(true)}
          />
          
          {/* 放大图标提示 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-20 rounded-lg pointer-events-none">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
              <ZoomIn size={24} className="text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>
        
        {alt && (
          <span className="block text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
            {alt} (点击查看大图)
          </span>
        )}
      </span>

      <ImageZoomModal
        src={src}
        alt={alt || ''}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

// ===== 复制按钮组件 =====
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

  // 复制到剪贴板
  const copyToClipboard = async (textToCopy: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy)
        return true
      }

      const textArea = document.createElement('textarea')
      textArea.value = textToCopy
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      textArea.style.opacity = '0'
      textArea.style.zIndex = '-1'
      textArea.setAttribute('readonly', 'readonly')
      
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      textArea.setSelectionRange(0, textArea.value.length)
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      return successful
    } catch (error) {
      console.error('复制失败:', error)
      return false
    }
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const success = await copyToClipboard(text)
      if (success) {
        setCopied(true)
        setIsVisible(true)
        
        if (timeoutRef.current !== undefined) {
          window.clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = window.setTimeout(() => {
          setCopied(false)
          setIsVisible(false)
        }, 2000)
      }
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <React.Fragment>
      <button
        onClick={handleCopy}
        className={`${getPositionClasses()} ${getVariantClasses()} ${className}`}
        title={copied ? '已复制!' : '复制代码'}
        aria-label={copied ? '已复制!' : '复制代码'}
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      {/* 提示框 */}
      {copied && isVisible && (
        <div
          className={`absolute z-30 px-2 py-1 text-xs text-white bg-slate-900 rounded whitespace-nowrap ${
            position.includes('right')
              ? 'right-0 -translate-x-full -mr-2'
              : 'left-0 translate-x-full ml-2'
          } ${
            position.includes('top')
              ? 'top-0'
              : 'bottom-0'
          }`}
        >
          已复制!
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

// ===== 代码块包装器组件 =====
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

// ===== 工具函数 =====

// 处理内容预处理
const preprocessContent = (content: string): string => {
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
  
  // 处理font标签
  processed = processed
    .replace(/<font\s+style=['"]([^'"]*?)['"][^>]*?>(.*?)<\/font>/gi, (match, style, text) => {
      const colorMatch = style.match(/color:\s*([^;]+)/i)
      const color = colorMatch ? colorMatch[1].trim() : '#DF2A3F'
      return `<span style="color: ${color}; font-weight: bold;">${text}</span>`
    })
    .replace(/<font\s+color=['"]([^'"]*?)['"][^>]*?>(.*?)<\/font>/gi, (match, color, text) => {
      return `<span style="color: ${color}; font-weight: bold;">${text}</span>`
    })
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

// ===== 主组件 =====
export const EnhancedMarkdownRenderer: React.FC<EnhancedMarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  const components = {
    // 表格组件
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

    // 段落
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

    // ★★★ 修复的图片组件 - 现在有点击放大功能了！ ★★★
    img: ({ src, alt }: any) => (
      <ClickableImageInline src={src} alt={alt || ''} />
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

    // 处理内联HTML
    span: ({ children, style, ...props }: any) => (
      <span style={style} {...props}>
        {children}
      </span>
    ),
  }

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

export default EnhancedMarkdownRenderer