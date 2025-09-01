// src/config/highlightConfig.ts

/**
 * 代码高亮功能配置
 * 在这里可以轻松开启/关闭各种功能
 */

export const HIGHLIGHT_CONFIG = {
  // === 基础功能 ===
  
  // 是否启用增强的代码块（推荐开启）
  enableEnhancedCodeBlocks: true,
  
  // 是否显示语言标签
  showLanguageLabels: true,
  
  // 是否显示复制按钮
  showCopyButton: true,
  
  // 是否显示下载按钮
  showDownloadButton: true,
  
  // === 高级功能 ===
  
  // 是否显示行号
  showLineNumbers: false,
  
  // 是否显示代码统计信息
  showCodeStats: false,
  
  // 是否启用代码折叠
  enableCodeFolding: false,
  
  // 是否启用代码质量检查
  enableQualityCheck: false,
  
  // 是否启用自动语言检测
  enableAutoDetection: true,
  
  // === 样式配置 ===
  
  // 代码块最大高度（超过则滚动）
  maxCodeBlockHeight: '500px',
  
  // 默认主题（'dracula' | 'github' | 'githubDark' | 'vscode'）
  defaultTheme: 'dracula' as const,
  
  // 是否根据系统主题自动切换代码高亮主题
  autoThemeSwitch: true,
  
  // 是否显示语言颜色指示器
  showLanguageColors: true,
  
  // === 交互功能 ===
  
  // 复制成功提示持续时间（毫秒）
  copySuccessDuration: 2000,
  
  // 是否启用键盘快捷键（Ctrl+C 复制代码）
  enableKeyboardShortcuts: false,
  
  // 是否在悬停时显示工具提示
  showTooltips: true,
  
  // === 性能配置 ===
  
  // 超过多少行时启用虚拟滚动（0 表示禁用）
  virtualScrollThreshold: 1000,
  
  // 是否延迟加载大型代码块
  lazyLoadLargeBlocks: true,
  
  // 大型代码块阈值（字符数）
  largeBlockThreshold: 5000,
  
  // === 特定语言配置 ===
  
  // JavaScript/TypeScript 特殊处理
  javascript: {
    showESLintHints: false,
    highlightTodos: true,
    showImportPaths: false,
  },
  
  // Python 特殊处理
  python: {
    showPEP8Hints: false,
    highlightDecorators: true,
  },
  
  // SQL 特殊处理
  sql: {
    highlightKeywords: true,
    showTableNames: false,
  },
  
  // === 实验性功能 ===
  
  // 是否启用代码实时预览（适用于 HTML/CSS）
  enableLivePreview: false,
  
  // 是否启用代码格式化按钮
  enableCodeFormatting: false,
  
  // 是否启用代码搜索功能
  enableCodeSearch: false,
  
  // 是否启用代码注释功能
  enableCodeComments: false,
} as const

/**
 * 根据环境获取配置
 */
export const getHighlightConfig = (environment: 'development' | 'production' = 'production') => {
  if (environment === 'development') {
    return {
      ...HIGHLIGHT_CONFIG,
      // 开发环境下启用更多调试功能
      showCodeStats: true,
      enableQualityCheck: true,
      showLineNumbers: true,
      enableCodeFolding: true,
    }
  }
  
  return HIGHLIGHT_CONFIG
}

/**
 * 特定页面的配置覆盖
 */
export const PAGE_SPECIFIC_CONFIG = {
  // 博客文章页面
  '/blog/[slug]': {
    showLineNumbers: false,
    showCodeStats: false,
    enableCodeFolding: true,
    maxCodeBlockHeight: '400px',
  },
  
  // 技术文档页面
  '/docs': {
    showLineNumbers: true,
    showCodeStats: true,
    enableQualityCheck: true,
    maxCodeBlockHeight: '600px',
  },
  
  // 项目展示页面
  '/projects': {
    showDownloadButton: true,
    showCodeStats: true,
    enableCodeFolding: true,
    maxCodeBlockHeight: '300px',
  },
  
  // 教程页面
  '/tutorials': {
    showLineNumbers: true,
    enableQualityCheck: true,
    showCodeStats: false,
    maxCodeBlockHeight: '500px',
  },
} as const

/**
 * 获取页面特定的配置
 */
export const getPageConfig = (pathname: string) => {
  const baseConfig = getHighlightConfig()
  const pageConfig = PAGE_SPECIFIC_CONFIG[pathname as keyof typeof PAGE_SPECIFIC_CONFIG]
  
  return pageConfig ? { ...baseConfig, ...pageConfig } : baseConfig
}

/**
 * 主题配置
 */
export const THEME_CONFIG = {
  light: {
    codeBackground: '#ffffff',
    codeForeground: '#24292e',
    headerBackground: '#f6f8fa',
    headerForeground: '#586069',
    borderColor: '#e1e4e8',
    buttonBackground: '#f6f8fa',
    buttonHover: '#e1e4e8',
  },
  dark: {
    codeBackground: '#282a36',
    codeForeground: '#f8f8f2',
    headerBackground: '#44475a',
    headerForeground: '#f8f8f2',
    borderColor: '#6272a4',
    buttonBackground: '#44475a',
    buttonHover: '#6272a4',
  },
} as const

/**
 * 语言特定的配置
 */
export const LANGUAGE_SPECIFIC_CONFIG = {
  // 需要特殊处理的语言
  specialHandling: {
    'markdown': {
      preserveFormatting: true,
      enableLivePreview: true,
    },
    'html': {
      enableLivePreview: true,
      showElementStructure: true,
    },
    'css': {
      enableLivePreview: true,
      showColorPreview: true,
    },
    'json': {
      enableFormatting: true,
      validateSyntax: true,
    },
    'yaml': {
      validateSyntax: true,
      showStructure: true,
    },
    'dockerfile': {
      showInstructions: true,
      validateCommands: true,
    },
    'sql': {
      formatQueries: true,
      highlightTables: true,
    },
  },
  
  // 代码模板
  templates: {
    'react-component': {
      language: 'tsx',
      template: `import React from 'react'

interface Props {
  // 定义组件属性
}

const ComponentName: React.FC<Props> = () => {
  return (
    <div>
      {/* 组件内容 */}
    </div>
  )
}

export default ComponentName`,
    },
    'express-api': {
      language: 'javascript',
      template: `const express = require('express')
const app = express()

app.use(express.json())

app.get('/api/endpoint', (req, res) => {
  res.json({ message: 'Hello World' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})`,
    },
    'python-script': {
      language: 'python',
      template: `#!/usr/bin/env python3
"""
脚本描述
"""

def main():
    """主函数"""
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
    },
  },
} as const

/**
 * 代码高亮的快捷键配置
 */
export const KEYBOARD_SHORTCUTS = {
  copy: { key: 'c', modifiers: ['ctrl'] },
  download: { key: 'd', modifiers: ['ctrl', 'shift'] },
  toggleLineNumbers: { key: 'l', modifiers: ['ctrl'] },
  toggleStats: { key: 'i', modifiers: ['ctrl'] },
  fold: { key: 'f', modifiers: ['ctrl'] },
} as const

/**
 * 导出所有配置的便捷函数
 */
export const useHighlightConfig = (pathname?: string) => {
  const config = pathname ? getPageConfig(pathname) : getHighlightConfig()
  
  return {
    ...config,
    themes: THEME_CONFIG,
    languages: LANGUAGE_SPECIFIC_CONFIG,
    shortcuts: KEYBOARD_SHORTCUTS,
  }
}

export default HIGHLIGHT_CONFIG