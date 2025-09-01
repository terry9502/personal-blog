import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypeHighlight, {
        // 指定支持的编程语言
        languages: {
          javascript: 'javascript',
          typescript: 'typescript',
          jsx: 'javascript',
          tsx: 'typescript',
          python: 'python',
          java: 'java',
          cpp: 'cpp',
          c: 'c',
          csharp: 'csharp',
          php: 'php',
          ruby: 'ruby',
          go: 'go',
          rust: 'rust',
          swift: 'swift',
          kotlin: 'kotlin',
          scala: 'scala',
          html: 'xml',
          xml: 'xml',
          css: 'css',
          scss: 'scss',
          sass: 'sass',
          less: 'less',
          json: 'json',
          yaml: 'yaml',
          yml: 'yaml',
          toml: 'ini',
          ini: 'ini',
          bash: 'bash',
          shell: 'bash',
          sh: 'bash',
          zsh: 'bash',
          powershell: 'powershell',
          sql: 'sql',
          mysql: 'sql',
          postgresql: 'sql',
          sqlite: 'sql',
          mongodb: 'javascript',
          dockerfile: 'dockerfile',
          docker: 'dockerfile',
          nginx: 'nginx',
          apache: 'apache',
          vim: 'vim',
          makefile: 'makefile',
          cmake: 'cmake',
          gradle: 'gradle',
          maven: 'xml',
          r: 'r',
          matlab: 'matlab',
          lua: 'lua',
          perl: 'perl',
          dart: 'dart',
          haskell: 'haskell',
          erlang: 'erlang',
          elixir: 'elixir',
          clojure: 'clojure',
          scheme: 'scheme',
          lisp: 'lisp',
          prolog: 'prolog',
          assembly: 'x86asm',
          asm: 'x86asm',
          vhdl: 'vhdl',
          verilog: 'verilog',
          latex: 'latex',
          tex: 'latex',
          markdown: 'markdown',
          md: 'markdown',
          diff: 'diff',
          patch: 'diff',
          git: 'diff',
          actionscript: 'actionscript',
          applescript: 'applescript',
          coffeescript: 'coffeescript',
          fsharp: 'fsharp',
          handlebars: 'handlebars',
          hbs: 'handlebars',
          pug: 'pug',
          jade: 'pug',
          stylus: 'stylus',
          twig: 'twig',
          django: 'django',
          jinja2: 'django',
          smarty: 'smarty',
          velocity: 'velocity',
          thrift: 'thrift',
          protobuf: 'protobuf',
          proto: 'protobuf',
          graphql: 'graphql',
          gql: 'graphql',
          solidity: 'solidity',
          sol: 'solidity',
          // Web框架和库
          vue: 'xml',
          svelte: 'xml',
          angular: 'typescript',
          react: 'jsx',
          // 数据格式
          csv: 'csv',
          tsv: 'csv',
          // 配置文件
          properties: 'properties',
          env: 'bash',
          gitignore: 'gitignore',
          editorconfig: 'ini',
          // 新兴语言
          zig: 'zig',
          nim: 'nim',
          crystal: 'crystal',
          julia: 'julia',
          ocaml: 'ocaml',
          reasonml: 'reasonml',
          purescript: 'haskell',
          elm: 'elm',
          // 脚本语言
          autohotkey: 'autohotkey',
          ahk: 'autohotkey',
          // 标记语言
          restructuredtext: 'restructuredtext',
          rst: 'restructuredtext',
          asciidoc: 'asciidoc',
          adoc: 'asciidoc',
          // 其他
          terraform: 'hcl',
          tf: 'hcl',
          hcl: 'hcl',
          puppet: 'puppet',
          ansible: 'yaml',
          // 游戏开发
          glsl: 'glsl',
          hlsl: 'hlsl',
          gdscript: 'gdscript',
          // 移动开发
          objc: 'objectivec',
          'objective-c': 'objectivec',
          // 数据科学
          jupyter: 'python',
          ipynb: 'python',
          // 函数式编程
          racket: 'lisp',
          // Web Assembly
          wasm: 'wasm',
          wat: 'wasm',
        },
        // 设置默认语言为纯文本
        plainText: ['txt', 'text', 'plain'],
        // 启用自动语言检测
        autodetect: true,
        // 忽略未识别的语言而不是报错
        ignoreMissing: true,
      }]
    ],
  },
})

export default withMDX(nextConfig)