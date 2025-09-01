import React from 'react'
import { MDXComponents } from 'mdx/types'
import { CopyButton } from './CopyButton'
// 直接导入，不使用动态导入
import ClickableImage from './ClickableImage'

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

// 语言映射表
const languageMap: { [key: string]: string } = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'jsx': 'JSX',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'tsx': 'TSX',
  'py': 'Python',
  'python': 'Python',
  'java': 'Java',
  'cpp': 'C++',
  'c++': 'C++',
  'c': 'C',
  'cs': 'C#',
  'csharp': 'C#',
  'php': 'PHP',
  'rb': 'Ruby',
  'ruby': 'Ruby',
  'go': 'Go',
  'rust': 'Rust',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'scala': 'Scala',
  'html': 'HTML',
  'xml': 'XML',
  'css': 'CSS',
  'scss': 'SCSS',
  'sass': 'Sass',
  'json': 'JSON',
  'yaml': 'YAML',
  'sql': 'SQL',
  'bash': 'Bash',
  'shell': 'Shell',
  'dockerfile': 'Dockerfile',
  'nginx': 'Nginx',
  'terraform': 'Terraform',
  'vue': 'Vue',
  'svelte': 'Svelte',
  'angular': 'Angular',
  'react': 'React',
  'graphql': 'GraphQL',
  'solidity': 'Solidity',
  'markdown': 'Markdown',
  'md': 'Markdown',
  'diff': 'Diff',
  'latex': 'LaTeX',
  'r': 'R',
  'lua': 'Lua',
  'perl': 'Perl',
  'assembly': 'Assembly',
  'makefile': 'Makefile',
  'plain': 'Plain Text',
  'text': 'Plain Text'
}

// 语言颜色映射
const languageColors: { [key: string]: string } = {
  'javascript': '#f7df1e',
  'typescript': '#3178c6',
  'python': '#3776ab',
  'java': '#ed8b00',
  'cpp': '#00599c',
  'c': '#555555',
  'csharp': '#239120',
  'php': '#777bb4',
  'ruby': '#cc342d',
  'go': '#00add8',
  'rust': '#000000',
  'html': '#e34f26',
  'css': '#1572b6',
  'json': '#000000',
  'sql': '#e38c00',
  'bash': '#4eaa25',
  'dockerfile': '#384d54',
}

// 获取语言显示名称
const getLanguageDisplayName = (className?: string): string => {
  if (!className) return 'Code'
  
  const languageMatch = className.match(/language-(\w+)/)
  if (!languageMatch) return 'Code'
  
  const language = languageMatch[1].toLowerCase()
  return languageMap[language] || language.charAt(0).toUpperCase() + language.slice(1)
}

// 获取语言颜色
const getLanguageColor = (className?: string): string => {
  if (!className) return '#6b7280'
  
  const languageMatch = className.match(/language-(\w+)/)
  if (!languageMatch) return '#6b7280'
  
  const language = languageMatch[1].toLowerCase()
  return languageColors[language] || '#6b7280'
}

// 增强的代码块组件
const EnhancedCodeBlock = ({ children, className, filename, title, ...props }: any) => {
  const [copied, setCopied] = useState(false)

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
  const languageName = getLanguageDisplayName(className)
  const languageColor = getLanguageColor(className)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const handleDownload = () => {
    const getFileExtension = (className?: string): string => {
      if (!className) return '.txt'
      const languageMatch = className.match(/language-(\w+)/)
      if (!languageMatch) return '.txt'
      
      const extensionMap: { [key: string]: string } = {
        'javascript': '.js', 'typescript': '.ts', 'python': '.py', 'java': '.java',
        'cpp': '.cpp', 'c': '.c', 'html': '.html', 'css': '.css', 'json': '.json',
        'sql': '.sql', 'bash': '.sh', 'php': '.php', 'ruby': '.rb', 'go': '.go'
      }
      return extensionMap[languageMatch[1].toLowerCase()] || '.txt'
    }

    const fileExtension = getFileExtension(className)
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
      {/* 语言标签和工具栏 */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: languageColor }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {title || languageName}
            </span>
          </div>
          {filename && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              {filename}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="下载代码"
          >
            <Download size={12} />
          </button>
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
      <pre 
        className="!mt-0 !rounded-t-none bg-slate-900 dark:bg-gray-900 text-slate-100 p-4 overflow-x-auto"
        style={{ 
          maxHeight: '500px',
          fontFamily: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
        }}
        {...props}
      >
        <code className={className}>
          {children}
        </code>
      </pre>
    </div>
  )
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

  // 增强的代码块处理
  pre: ({ children, ...props }: any) => {
    // 检查是否是代码块
    try {
      const child = React.Children.only(children) as React.ReactElement
      if (child && React.isValidElement(child) && child.type === 'code') {
        return <EnhancedCodeBlock {...child.props} />
      }
    } catch (error) {
      // 如果不是单个子元素，使用 fallback
    }

    // fallback 到原始 pre 标签
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

  // 内联代码
  code: ({ children, className, ...props }: any) => {
    // 如果有语言类名，说明是代码块内的代码
    if (className?.includes('language-')) {
      return <code className={className} {...props}>{children}</code>
    }
    
    // 内联代码样式
    return (
      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700" {...props}>
        {children}
      </code>
    )
  },

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

  // 图片 - 支持点击放大
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
  em: ({ children, ...props }: any) => (
    <em className="italic text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </em>
  ),

  // 表格增强
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
  hr: ({ ...props }: any) => (
    <hr className="my-8 border-gray-200 dark:border-gray-700" {...props} />
  ),

  // 处理 font 标签（向后兼容）
  font: ({ children, style, color, ...props }: any) => {
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

export default components