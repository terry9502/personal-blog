// src/components/CompatibleCopyButton.tsx
'use client'
import * as React from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'floating'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showFeedback?: boolean
  customIcon?: React.ReactNode
  onCopy?: (success: boolean) => void
}

export const CompatibleCopyButton: React.FC<CopyButtonProps> = (props) => {
  const {
    text,
    className = '',
    size = 'md',
    variant = 'default',
    position = 'top-right',
    showFeedback = true,
    customIcon,
    onCopy
  } = props

  // 明确指定初始状态类型和值
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

  // 获取尺寸样式
  const getSizeClasses = React.useCallback(() => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6 text-xs'
      case 'lg':
        return 'w-10 h-10 text-base'
      default:
        return 'w-8 h-8 text-sm'
    }
  }, [size])

  // 获取变体样式
  const getVariantClasses = React.useCallback(() => {
    const baseClasses = 'inline-flex items-center justify-center rounded transition-all duration-200'
    
    switch (variant) {
      case 'minimal':
        return `${baseClasses} text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700`
      case 'floating':
        return `${baseClasses} bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-lg border border-slate-200 dark:border-slate-600 hover:shadow-xl hover:scale-105`
      default:
        return `${baseClasses} bg-slate-700 hover:bg-slate-600 text-white opacity-70 hover:opacity-100`
    }
  }, [variant])

  // 获取位置样式
  const getPositionClasses = React.useCallback(() => {
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
  }, [position])

  // 复制到剪贴板的多种方法
  const copyToClipboard = React.useCallback(async (textToCopy: string): Promise<boolean> => {
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
  }, [])

  // 处理复制操作
  const handleCopy = React.useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        
        // 调用回调
        if (onCopy) {
          onCopy(true)
        }
      } else {
        throw new Error('复制失败')
      }
    } catch (error) {
      console.error('复制操作失败:', error)
      if (onCopy) {
        onCopy(false)
      }
      
      // 显示失败反馈
      if (showFeedback) {
        setCopied(false)
        setIsVisible(true)
        timeoutRef.current = window.setTimeout(() => {
          setIsVisible(false)
        }, 2000)
      }
    }
  }, [text, copyToClipboard, onCopy, showFeedback])

  const sizeClasses = getSizeClasses()
  const variantClasses = getVariantClasses()
  const positionClasses = getPositionClasses()

  return (
    <React.Fragment>
      <button
        onClick={handleCopy}
        className={`${positionClasses} ${sizeClasses} ${variantClasses} ${className} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
        title={copied ? '已复制!' : '复制代码'}
        aria-label={copied ? '已复制到剪贴板' : '复制代码到剪贴板'}
        type="button"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          customIcon || <Copy className="w-4 h-4" />
        )}
      </button>

      {/* 反馈提示 */}
      {showFeedback && isVisible && (
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
  showLineNumbers?: boolean
  copyButtonProps?: Partial<CopyButtonProps>
}

export const CompatibleCodeBlockWrapper: React.FC<CodeBlockWrapperProps> = (props) => {
  const {
    children,
    code,
    language,
    className = '',
    showLineNumbers = false,
    copyButtonProps = {}
  } = props

  const [isHovered, setIsHovered] = React.useState<boolean>(false)

  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 语言标签 */}
      {language && (
        <div className="absolute top-2 left-4 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded z-10">
          {language}
        </div>
      )}
      
      {/* 复制按钮 */}
      <div className={`transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <CompatibleCopyButton
          text={code}
          variant="default"
          position="top-right"
          {...copyButtonProps}
        />
      </div>

      {/* 代码内容 */}
      {showLineNumbers ? (
        <div className="flex">
          <div className="flex-shrink-0 bg-slate-800 text-slate-400 text-xs p-4 select-none">
            {code.split('\n').map((_, index) => (
              <div key={index} className="leading-relaxed">
                {index + 1}
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-x-auto">
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

// 自动增强Hook
export const useAutoEnhanceCopyButton = (): void => {
  React.useEffect(() => {
    const addCopyButtons = (): void => {
      // 查找所有代码块
      const codeBlocks = document.querySelectorAll('pre:not([data-copy-enhanced])')
      
      codeBlocks.forEach((block) => {
        // 标记已处理
        block.setAttribute('data-copy-enhanced', 'true')
        
        // 获取代码内容
        const codeElement = block.querySelector('code')
        const codeText = codeElement?.textContent || block.textContent || ''
        
        // 创建复制按钮容器
        const buttonContainer = document.createElement('div')
        buttonContainer.className = 'absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
        
        // 创建复制按钮
        const copyButton = document.createElement('button')
        copyButton.className = 'w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded opacity-70 hover:opacity-100 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500'
        copyButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `
        copyButton.title = '复制代码'
        copyButton.type = 'button'
        
        // 添加复制事件
        copyButton.addEventListener('click', async (e: Event) => {
          e.preventDefault()
          e.stopPropagation()
          
          try {
            // 使用多种方法复制
            let success = false
            
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(codeText)
              success = true
            } else {
              const textArea = document.createElement('textarea')
              textArea.value = codeText
              textArea.style.position = 'fixed'
              textArea.style.left = '-999999px'
              textArea.style.opacity = '0'
              document.body.appendChild(textArea)
              textArea.select()
              success = document.execCommand('copy')
              document.body.removeChild(textArea)
            }
            
            if (success) {
              // 显示成功反馈
              copyButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              `
              copyButton.title = '已复制!'
              
              setTimeout(() => {
                copyButton.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                `
                copyButton.title = '复制代码'
              }, 2000)
            }
          } catch (error) {
            console.error('复制失败:', error)
          }
        })
        
        buttonContainer.appendChild(copyButton)
        
        // 确保父元素有相对定位
        const blockElement = block as HTMLElement
        if (window.getComputedStyle(blockElement).position === 'static') {
          blockElement.style.position = 'relative'
        }
        
        // 添加group类用于hover效果
        blockElement.classList.add('group')
        
        // 插入按钮
        blockElement.appendChild(buttonContainer)
      })
    }
    
    // 初始化
    addCopyButtons()
    
    // 监听DOM变化
    const observer = new MutationObserver(() => {
      setTimeout(addCopyButtons, 100)
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
    return () => {
      observer.disconnect()
    }
  }, [])
}