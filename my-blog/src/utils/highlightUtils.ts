// src/utils/highlightUtils.ts

/**
 * 代码高亮增强工具类
 * 提供语言检测、主题管理和语法高亮增强功能
 */

// 支持的编程语言配置
export const SUPPORTED_LANGUAGES = {
  // Web 开发
  'javascript': { name: 'JavaScript', extensions: ['.js', '.mjs'], color: '#f7df1e' },
  'typescript': { name: 'TypeScript', extensions: ['.ts'], color: '#3178c6' },
  'jsx': { name: 'JSX', extensions: ['.jsx'], color: '#61dafb' },
  'tsx': { name: 'TSX', extensions: ['.tsx'], color: '#61dafb' },
  'html': { name: 'HTML', extensions: ['.html', '.htm'], color: '#e34f26' },
  'css': { name: 'CSS', extensions: ['.css'], color: '#1572b6' },
  'scss': { name: 'SCSS', extensions: ['.scss'], color: '#cf649a' },
  'sass': { name: 'Sass', extensions: ['.sass'], color: '#cf649a' },
  'less': { name: 'Less', extensions: ['.less'], color: '#1d365d' },
  'vue': { name: 'Vue', extensions: ['.vue'], color: '#4fc08d' },
  'svelte': { name: 'Svelte', extensions: ['.svelte'], color: '#ff3e00' },
  'angular': { name: 'Angular', extensions: ['.component.ts'], color: '#dd0031' },

  // 后端语言
  'python': { name: 'Python', extensions: ['.py', '.pyw'], color: '#3776ab' },
  'java': { name: 'Java', extensions: ['.java'], color: '#ed8b00' },
  'cpp': { name: 'C++', extensions: ['.cpp', '.cc', '.cxx'], color: '#00599c' },
  'c': { name: 'C', extensions: ['.c', '.h'], color: '#555555' },
  'csharp': { name: 'C#', extensions: ['.cs'], color: '#239120' },
  'php': { name: 'PHP', extensions: ['.php'], color: '#777bb4' },
  'ruby': { name: 'Ruby', extensions: ['.rb'], color: '#cc342d' },
  'go': { name: 'Go', extensions: ['.go'], color: '#00add8' },
  'rust': { name: 'Rust', extensions: ['.rs'], color: '#000000' },
  'swift': { name: 'Swift', extensions: ['.swift'], color: '#fa7343' },
  'kotlin': { name: 'Kotlin', extensions: ['.kt'], color: '#7f52ff' },
  'scala': { name: 'Scala', extensions: ['.scala'], color: '#dc322f' },

  // 脚本和配置
  'bash': { name: 'Bash', extensions: ['.sh', '.bash'], color: '#4eaa25' },
  'powershell': { name: 'PowerShell', extensions: ['.ps1'], color: '#5391fe' },
  'json': { name: 'JSON', extensions: ['.json'], color: '#000000' },
  'yaml': { name: 'YAML', extensions: ['.yaml', '.yml'], color: '#cb171e' },
  'toml': { name: 'TOML', extensions: ['.toml'], color: '#9c4221' },
  'ini': { name: 'INI', extensions: ['.ini'], color: '#6e6e6e' },
  'xml': { name: 'XML', extensions: ['.xml'], color: '#e34f26' },

  // 数据库
  'sql': { name: 'SQL', extensions: ['.sql'], color: '#e38c00' },
  'mysql': { name: 'MySQL', extensions: ['.sql'], color: '#4479a1' },
  'postgresql': { name: 'PostgreSQL', extensions: ['.sql'], color: '#336791' },

  // 函数式语言
  'haskell': { name: 'Haskell', extensions: ['.hs'], color: '#5d4f85' },
  'erlang': { name: 'Erlang', extensions: ['.erl'], color: '#b83998' },
  'elixir': { name: 'Elixir', extensions: ['.ex', '.exs'], color: '#6e4a7e' },
  'clojure': { name: 'Clojure', extensions: ['.clj'], color: '#5881d8' },
  'ocaml': { name: 'OCaml', extensions: ['.ml'], color: '#3be133' },
  'elm': { name: 'Elm', extensions: ['.elm'], color: '#60b5cc' },

  // 新兴语言
  'zig': { name: 'Zig', extensions: ['.zig'], color: '#ec915c' },
  'nim': { name: 'Nim', extensions: ['.nim'], color: '#ffe953' },
  'crystal': { name: 'Crystal', extensions: ['.cr'], color: '#000000' },
  'julia': { name: 'Julia', extensions: ['.jl'], color: '#9558b2' },
  'dart': { name: 'Dart', extensions: ['.dart'], color: '#0175c2' },

  // 运维和DevOps
  'dockerfile': { name: 'Dockerfile', extensions: ['Dockerfile'], color: '#384d54' },
  'docker': { name: 'Docker', extensions: ['docker-compose.yml'], color: '#2496ed' },
  'nginx': { name: 'Nginx', extensions: ['.conf'], color: '#009639' },
  'apache': { name: 'Apache', extensions: ['.conf'], color: '#d22128' },
  'terraform': { name: 'Terraform', extensions: ['.tf'], color: '#7b42bc' },
  'ansible': { name: 'Ansible', extensions: ['.yml'], color: '#ee0000' },
  'puppet': { name: 'Puppet', extensions: ['.pp'], color: '#ffae1a' },

  // 游戏开发
  'glsl': { name: 'GLSL', extensions: ['.glsl', '.vert', '.frag'], color: '#5586a4' },
  'hlsl': { name: 'HLSL', extensions: ['.hlsl'], color: '#5586a4' },
  'gdscript': { name: 'GDScript', extensions: ['.gd'], color: '#355570' },

  // 移动开发
  'objectivec': { name: 'Objective-C', extensions: ['.m', '.mm'], color: '#438eff' },

  // 数据科学
  'r': { name: 'R', extensions: ['.r', '.R'], color: '#198ce7' },
  'matlab': { name: 'MATLAB', extensions: ['.m'], color: '#0076a8' },
  'jupyter': { name: 'Jupyter', extensions: ['.ipynb'], color: '#f37626' },

  // 区块链
  'solidity': { name: 'Solidity', extensions: ['.sol'], color: '#363636' },

  // 其他
  'latex': { name: 'LaTeX', extensions: ['.tex'], color: '#008080' },
  'markdown': { name: 'Markdown', extensions: ['.md', '.markdown'], color: '#083fa1' },
  'diff': { name: 'Diff', extensions: ['.diff', '.patch'], color: '#88c999' },
  'assembly': { name: 'Assembly', extensions: ['.asm', '.s'], color: '#6e4c13' },
  'vhdl': { name: 'VHDL', extensions: ['.vhd', '.vhdl'], color: '#543978' },
  'verilog': { name: 'Verilog', extensions: ['.v', '.sv'], color: '#b2b7f8' },
  'perl': { name: 'Perl', extensions: ['.pl', '.pm'], color: '#0298c3' },
  'lua': { name: 'Lua', extensions: ['.lua'], color: '#000080' },
  'makefile': { name: 'Makefile', extensions: ['Makefile', 'makefile'], color: '#427819' },
  'cmake': { name: 'CMake', extensions: ['CMakeLists.txt', '.cmake'], color: '#064f8c' },
  'gradle': { name: 'Gradle', extensions: ['.gradle'], color: '#02303a' },
  'wasm': { name: 'WebAssembly', extensions: ['.wasm', '.wat'], color: '#654ff0' },
} as const

// 语言别名映射
export const LANGUAGE_ALIASES: { [key: string]: keyof typeof SUPPORTED_LANGUAGES } = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'rb': 'ruby',
  'rs': 'rust',
  'cpp': 'cpp',
  'c++': 'cpp',
  'cs': 'csharp',
  'kt': 'kotlin',
  'hs': 'haskell',
  'sh': 'bash',
  'zsh': 'bash',
  'shell': 'bash',
  'ps1': 'powershell',
  'yml': 'yaml',
  'md': 'markdown',
  'tex': 'latex',
  'objc': 'objectivec',
  'objective-c': 'objectivec',
  'sol': 'solidity',
  'tf': 'terraform',
  'asm': 'assembly',
  'wat': 'wasm',
}

/**
 * 自动检测代码语言
 */
export const detectLanguage = (code: string): string | null => {
  const patterns = [
    { pattern: /^import\s+\w+\s+from\s+['"]/, language: 'javascript' },
    { pattern: /^import\s*{[^}]*}\s*from\s+['"]/, language: 'javascript' },
    { pattern: /interface\s+\w+\s*{/, language: 'typescript' },
    { pattern: /^def\s+\w+\s*\(/, language: 'python' },
    { pattern: /^class\s+\w+.*:/, language: 'python' },
    { pattern: /^public\s+class\s+\w+/, language: 'java' },
    { pattern: /^#include\s*</, language: 'cpp' },
    { pattern: /^using\s+System/, language: 'csharp' },
    { pattern: /^<\?php/, language: 'php' },
    { pattern: /^package\s+main/, language: 'go' },
    { pattern: /^fn\s+main\s*\(/, language: 'rust' },
    { pattern: /^SELECT\s+.*\s+FROM/i, language: 'sql' },
    { pattern: /^<!DOCTYPE\s+html/i, language: 'html' },
    { pattern: /^FROM\s+\w+/, language: 'dockerfile' },
    { pattern: /^\s*\{[\s\S]*".*"[\s\S]*\}/, language: 'json' },
  ]

  for (const { pattern, language } of patterns) {
    if (pattern.test(code.trim())) {
      return language
    }
  }

  return null
}

/**
 * 规范化语言名称
 */
export const normalizeLanguage = (lang: string): string => {
  const normalized = lang.toLowerCase().trim()
  return LANGUAGE_ALIASES[normalized] || normalized
}

/**
 * 获取语言的显示名称
 */
export const getLanguageDisplayName = (lang: string): string => {
  const normalized = normalizeLanguage(lang)
  const languageInfo = SUPPORTED_LANGUAGES[normalized as keyof typeof SUPPORTED_LANGUAGES]
  return languageInfo?.name || lang.charAt(0).toUpperCase() + lang.slice(1)
}

/**
 * 获取语言的主题色
 */
export const getLanguageColor = (lang: string): string => {
  const normalized = normalizeLanguage(lang)
  const languageInfo = SUPPORTED_LANGUAGES[normalized as keyof typeof SUPPORTED_LANGUAGES]
  return languageInfo?.color || '#6b7280'
}

/**
 * 检查是否支持某种语言
 */
export const isLanguageSupported = (lang: string): boolean => {
  const normalized = normalizeLanguage(lang)
  return normalized in SUPPORTED_LANGUAGES
}

/**
 * 代码统计信息
 */
export const getCodeStats = (code: string): {
  lines: number
  characters: number
  words: number
  size: string
} => {
  const lines = code.split('\n').length
  const characters = code.length
  const words = code.split(/\s+/).filter(word => word.length > 0).length
  const bytes = new Blob([code]).size
  
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return {
    lines,
    characters,
    words,
    size: formatSize(bytes)
  }
}

/**
 * 代码质量检查规则
 */
export const CODE_QUALITY_RULES = {
  javascript: [
    { pattern: /var\s+/, message: '建议使用 let 或 const 代替 var', severity: 'warning' as const },
    { pattern: /==(?!=)/, message: '建议使用 === 进行严格比较', severity: 'warning' as const },
    { pattern: /console\.log/, message: '生产环境中应移除 console.log', severity: 'info' as const },
  ],
  python: [
    { pattern: /print\s*\(/, message: '考虑使用 logging 模块代替 print', severity: 'info' as const },
    { pattern: /except:/, message: '建议指定具体的异常类型', severity: 'warning' as const },
  ],
  sql: [
    { pattern: /SELECT\s+\*/, message: '避免使用 SELECT *，明确指定列名', severity: 'warning' as const },
    { pattern: /WHERE.*=.*NULL/i, message: '使用 IS NULL 代替 = NULL', severity: 'error' as const },
  ],
}

/**
 * 简单的代码质量检查
 */
export const checkCodeQuality = (code: string, language: string): Array<{
  line: number
  message: string
  severity: 'error' | 'warning' | 'info'
}> => {
  const normalized = normalizeLanguage(language)
  const rules = CODE_QUALITY_RULES[normalized as keyof typeof CODE_QUALITY_RULES] || []
  const issues: Array<{ line: number; message: string; severity: 'error' | 'warning' | 'info' }> = []
  
  const lines = code.split('\n')
  
  lines.forEach((line, index) => {
    rules.forEach(rule => {
      if (rule.pattern.test(line)) {
        issues.push({
          line: index + 1,
          message: rule.message,
          severity: rule.severity
        })
      }
    })
  })
  
  return issues
}

/**
 * 语言特定的格式化规则
 */
export const LANGUAGE_FORMATTING: { [key: string]: { tabSize: number; insertSpaces: boolean } } = {
  'javascript': { tabSize: 2, insertSpaces: true },
  'typescript': { tabSize: 2, insertSpaces: true },
  'python': { tabSize: 4, insertSpaces: true },
  'java': { tabSize: 4, insertSpaces: true },
  'cpp': { tabSize: 2, insertSpaces: true },
  'c': { tabSize: 2, insertSpaces: true },
  'csharp': { tabSize: 4, insertSpaces: true },
  'php': { tabSize: 4, insertSpaces: true },
  'ruby': { tabSize: 2, insertSpaces: true },
  'go': { tabSize: 8, insertSpaces: false }, // Go 使用 tab
  'rust': { tabSize: 4, insertSpaces: true },
  'swift': { tabSize: 4, insertSpaces: true },
  'kotlin': { tabSize: 4, insertSpaces: true },
  'scala': { tabSize: 2, insertSpaces: true },
  'html': { tabSize: 2, insertSpaces: true },
  'css': { tabSize: 2, insertSpaces: true },
  'json': { tabSize: 2, insertSpaces: true },
  'yaml': { tabSize: 2, insertSpaces: true },
  'sql': { tabSize: 2, insertSpaces: true },
  'bash': { tabSize: 2, insertSpaces: true },
  'dockerfile': { tabSize: 2, insertSpaces: true },
  'makefile': { tabSize: 8, insertSpaces: false }, // Makefile 使用 tab
}

/**
 * 获取语言的格式化配置
 */
export const getLanguageFormatting = (lang: string) => {
  const normalized = normalizeLanguage(lang)
  return LANGUAGE_FORMATTING[normalized] || { tabSize: 2, insertSpaces: true }
}

/**
 * 格式化代码（基础版本）
 */
export const formatCode = (code: string, language: string): string => {
  const formatting = getLanguageFormatting(language)
  const lines = code.split('\n')
  
  // 基础的缩进修复
  let indentLevel = 0
  const formatted = lines.map(line => {
    const trimmed = line.trim()
    if (!trimmed) return ''
    
    // 简单的缩进逻辑
    if (trimmed.includes('}') || trimmed.includes(']') || trimmed.includes(')'))) {
      indentLevel = Math.max(0, indentLevel - 1)
    }
    
    const indent = formatting.insertSpaces 
      ? ' '.repeat(indentLevel * formatting.tabSize)
      : '\t'.repeat(indentLevel)
      
    const result = indent + trimmed
    
    if (trimmed.includes('{') || trimmed.includes('[') || trimmed.includes('('))) {
      indentLevel++
    }
    
    return result
  })
  
  return formatted.join('\n')
}