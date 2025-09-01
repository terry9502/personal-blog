'use client'

import React, { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'
import { 
  getLanguageDisplayName, 
  getLanguageColor 
} from '../utils/highlightUtils'

interface EnhancedCodeBlockProps {
  children: React.ReactNode
  className?: string
  filename?: string
  title?: string
}

export const EnhancedCodeBlock: React.FC<EnhancedCodeBlockProps> = ({
  children,
  className = '',
  filename,
  title
}) => {
  const [copied, setCopied] = useState(false)

  // 提取代码文本
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
  const languageMatch = className.match(/language-(\w+)/)
  const detectedLanguage = languageMatch ? languageMatch[1] : ''
  const languageName = getLanguageDisplayName(detectedLanguage)
  const languageColor = getLanguageColor(detectedLanguage)

  // 复制功能
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // 备用方案
      const textArea = document.createElement('textarea')
      textArea.value = codeText
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error('复制失败:', fallbackErr)
      }
      document.body.removeChild(textArea)
    }
  }

  // 下载功能
  const handleDownload = () => {
    const getFileExtension = (lang: string): string => {
      const extensionMap: { [key: string]: string } = {
        'javascript': '.js', 'typescript': '.ts', 'jsx': '.jsx', 'tsx': '.tsx',
        'python': '.py', 'java': '.java', 'cpp': '.cpp', 'c': '.c',
        'csharp': '.cs', 'php': '.php', 'ruby': '.rb', 'go': '.go',
        'rust': '.rs', 'swift': '.swift', 'kotlin': '.kt', 'scala': '.scala',
        'html': '.html', 'css': '.css', 'scss': '.scss', 'json': '.json',
        'yaml': '.yaml', 'sql': '.sql', 'bash': '.sh', 'dockerfile': '.dockerfile',
        'markdown': '.md', 'latex': '.tex'
      }
      return extensionMap[lang.toLowerCase()] || '.txt'
    }

    const fileExtension = getFileExtension(detectedLanguage)
    const fileName = filename || `code-snippet${fileExtension}`
    
    const blob = new Blob([codeText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="relative group mb-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* 头部工具栏 */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {/* 语言标签 */}
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: languageColor }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {title || languageName}
            </span>
          </div>

          {/* 文件名 */}
          {filename && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              {filename}
            </span>
          )}
        </div>

        {/* 右侧按钮组 */}
        <div className="flex items-center gap-2">
          {/* 下载按钮 */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="下载代码"
          >
            <Download size={12} />
          </button>

          {/* 复制按钮 */}
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-md transition-all duration-200 ${
              copied 
                ? 'bg-green-600 text-white opacity-100' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 opacity-70 group-hover:opacity-100'
            }`}
            title={copied ? '已复制!' : '复制代码'}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* 代码内容 */}
      <div className="overflow-hidden">
        <pre 
          className="bg-slate-900 dark:bg-gray-900 text-slate-100 p-4 overflow-auto !mt-0 !rounded-none"
          style={{ 
            maxHeight: '500px',
            fontFamily: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
          }}
        >
          <code className={className}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default EnhancedCodeBlock