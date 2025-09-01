'use client'

import React, { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'

interface CopyButtonProps {
  text: string
  filename?: string
  language?: string
  showDownload?: boolean
}

export const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  filename, 
  language,
  showDownload = false 
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
      // 备用方案：使用传统的复制方法
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error('备用复制方法也失败:', fallbackErr)
      }
      document.body.removeChild(textArea)
    }
  }

  const handleDownload = () => {
    if (!filename && !language) return
    
    const fileExtension = getFileExtension(language || '')
    const fileName = filename || `code${fileExtension}`
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getFileExtension = (lang: string): string => {
    const extensionMap: { [key: string]: string } = {
      'javascript': '.js',
      'typescript': '.ts',
      'jsx': '.jsx',
      'tsx': '.tsx',
      'python': '.py',
      'java': '.java',
      'cpp': '.cpp',
      'c': '.c',
      'csharp': '.cs',
      'php': '.php',
      'ruby': '.rb',
      'go': '.go',
      'rust': '.rs',
      'swift': '.swift',
      'kotlin': '.kt',
      'scala': '.scala',
      'html': '.html',
      'css': '.css',
      'scss': '.scss',
      'sass': '.sass',
      'json': '.json',
      'yaml': '.yaml',
      'sql': '.sql',
      'bash': '.sh',
      'shell': '.sh',
      'dockerfile': '.dockerfile',
      'vim': '.vim',
      'makefile': '.makefile',
      'r': '.r',
      'lua': '.lua',
      'dart': '.dart',
      'haskell': '.hs',
      'elixir': '.ex',
      'clojure': '.clj',
      'latex': '.tex',
      'markdown': '.md',
      'vue': '.vue',
      'svelte': '.svelte',
      'graphql': '.graphql',
      'solidity': '.sol',
    }
    
    return extensionMap[lang.toLowerCase()] || '.txt'
  }

  return (
    <div className="absolute top-2 right-2 flex items-center gap-2">
      {/* 下载按钮（可选） */}
      {showDownload && (filename || language) && (
        <button
          onClick={handleDownload}
          className="p-2 rounded-md bg-slate-700 dark:bg-gray-700 text-slate-300 hover:bg-slate-600 dark:hover:bg-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
          title="下载代码文件"
        >
          <Download size={14} />
        </button>
      )}
      
      {/* 复制按钮 */}
      <button
        onClick={handleCopy}
        className={`copy-button p-2 rounded-md transition-all duration-200 ${
          copied 
            ? 'bg-green-600 text-white opacity-100 copy-success' 
            : 'bg-slate-700 dark:bg-gray-700 text-slate-300 hover:bg-slate-600 dark:hover:bg-gray-600 opacity-70 group-hover:opacity-100'
        }`}
        title={copied ? '已复制!' : '复制代码'}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  )
}

// 导出一个简化版本以保持向后兼容
export default CopyButton