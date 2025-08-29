import { MDXComponents } from 'mdx/types'
import Image from 'next/image'

// 高亮文本组件
const Highlight = ({ children, color = '#DF2A3F' }: { children: React.ReactNode, color?: string }) => (
  <span style={{ color, fontWeight: 'bold' }}>{children}</span>
)

// 代码块组件
const CodeBlock = ({ children, language = 'text' }: { children: React.ReactNode, language?: string }) => (
  <div className="relative">
    <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
      {language}
    </div>
    <pre className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto mb-4">
      <code>{children}</code>
    </pre>
  </div>
)

// 引用块组件
const Quote = ({ children }: { children: React.ReactNode }) => (
  <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-6 py-4 my-6 rounded-r-lg">
    <div className="text-blue-900">{children}</div>
  </blockquote>
)

const components: MDXComponents = {
  // 基础组件
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-slate-900 mb-6 mt-8 first:mt-0 border-b-2 border-gray-200 pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-slate-900 mb-4 mt-8">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-slate-700 mb-4 leading-relaxed">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a 
      href={href} 
      className="text-blue-600 hover:text-blue-700 underline hover:no-underline transition-all"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">
      {children}
    </code>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-slate-700">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <Quote>{children}</Quote>
  ),
  img: ({ src, alt, ...props }) => (
    <div className="my-6">
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg shadow-md max-w-full h-auto mx-auto"
        {...props}
      />
    </div>
  ),
  
  // 自定义组件
  Highlight,
  CodeBlock,
  Quote,
  
  // 处理 font 标签（向后兼容）
  font: ({ children, style, color, ...props }) => {
    // 解析旧的 font 标签
    let textColor = color;
    if (style && typeof style === 'string') {
      const colorMatch = style.match(/color:\s*([^;]+)/);
      if (colorMatch) {
        textColor = colorMatch[1];
      }
    } else if (style && typeof style === 'object') {
      textColor = (style as any).color || textColor;
    }
    
    return (
      <span style={{ color: textColor || '#DF2A3F', fontWeight: 'bold' }}>
        {children}
      </span>
    );
  },
}

export default components