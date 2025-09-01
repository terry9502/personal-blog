import BlogEditor from '@/components/BlogEditor'

export const metadata = {
  title: '在线编辑器',
  description: '在线博客内容编辑器，支持Markdown语法和实时预览'
}

export default function EditorPage() {
  return <BlogEditor />
}