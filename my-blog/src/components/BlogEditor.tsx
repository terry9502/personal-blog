'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  EyeOff, 
  FileText, 
  Tag, 
  Calendar, 
  Download,
  Trash2,
  Plus,
  Settings,
  Bold,
  Italic,
  Link2,
  List,
  Code,
  Quote,
  Image,
  Hash
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  description: string;
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

const BlogEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPreview, setIsPreview] = useState(false);
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 从本地存储加载已保存的文章
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      setSavedPosts(saved);
    }
  }, []);

  // 保存文章到本地存储
  const savePosts = (posts: BlogPost[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('blogPosts', JSON.stringify(posts));
    }
    setSavedPosts(posts);
  };

  // 添加标签
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 插入文本到编辑器
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    
    // 设置新的光标位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 保存文章
  const savePost = () => {
    if (!title.trim()) {
      alert('请输入文章标题');
      return;
    }

    const post: BlogPost = {
      id: currentPostId || Date.now().toString(),
      title: title.trim(),
      content,
      description: description.trim(),
      tags,
      date,
      createdAt: currentPostId ? savedPosts.find(p => p.id === currentPostId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let newPosts: BlogPost[];
    if (currentPostId) {
      newPosts = savedPosts.map(p => p.id === currentPostId ? post : p);
    } else {
      newPosts = [post, ...savedPosts];
      setCurrentPostId(post.id);
    }

    savePosts(newPosts);
    alert('文章已保存！');
  };

  // 新建文章
  const newPost = () => {
    if (title || content || description || tags.length > 0) {
      if (!confirm('当前有未保存的内容，确定要新建文章吗？')) {
        return;
      }
    }
    
    setTitle('');
    setContent('');
    setDescription('');
    setTags([]);
    setCurrentTag('');
    setDate(new Date().toISOString().split('T')[0]);
    setCurrentPostId(null);
    setIsPreview(false);
  };

  // 加载文章
  const loadPost = (post: BlogPost) => {
    setTitle(post.title);
    setContent(post.content);
    setDescription(post.description);
    setTags(post.tags);
    setDate(post.date);
    setCurrentPostId(post.id);
    setIsPreview(false);
  };

  // 删除文章
  const deletePost = (postId: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      const newPosts = savedPosts.filter(p => p.id !== postId);
      savePosts(newPosts);
      
      if (currentPostId === postId) {
        newPost();
      }
    }
  };

  // 导出文章为MDX格式
  const exportPost = () => {
    if (!title.trim()) {
      alert('请先输入文章标题');
      return;
    }

    const frontmatter = `---
title: '${title}'
date: '${date}'
description: '${description || title}'
tags: [${tags.map(tag => `'${tag}'`).join(', ')}]
---

`;

    const mdxContent = frontmatter + content;
    const blob = new Blob([mdxContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')}.mdx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 简单的Markdown渲染
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic my-4">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* 头部工具栏 */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">博客编辑器</h1>
              {currentPostId && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                  编辑中
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={newPost}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                <Plus size={16} />
                新建
              </button>
              
              <button
                onClick={savePost}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <Save size={16} />
                保存
              </button>
              
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
              >
                {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                {isPreview ? '编辑' : '预览'}
              </button>
              
              <button
                onClick={exportPost}
                className="flex items-center gap-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-colors"
              >
                <Download size={16} />
                导出
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-colors"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏 - 文章列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={18} />
                已保存文章 ({savedPosts.length})
              </h2>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {savedPosts.map(post => (
                  <div
                    key={post.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      currentPostId === post.id 
                        ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    onClick={() => loadPost(post)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 dark:text-white text-sm truncate">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {new Date(post.date).toLocaleDateString('zh-CN')}
                        </p>
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 2 && (
                              <span className="text-xs text-slate-400">+{post.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePost(post.id);
                        }}
                        className="ml-2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {savedPosts.length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">还没有保存的文章</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 主编辑区域 */}
          <div className="lg:col-span-3">
            {/* 文章元信息 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    文章标题 *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入文章标题..."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    发布日期
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  文章描述
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="简短描述文章内容..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  标签
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="添加标签..."
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    添加
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm"
                    >
                      <Tag size={12} />
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 编辑器主体 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
              {/* 编辑器工具栏 */}
              {!isPreview && (
                <div className="border-b border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => insertText('**', '**')}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      title="粗体"
                    >
                      <Bold size={16} />
                    </button>
                    
                    <button
                      onClick={() => insertText('*', '*')}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      title="斜体"
                    >
                      <Italic size={16} />
                    </button>
                    
                    <button
                      onClick={() => insertText('[', '](url)')}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      title="链接"
                    >
                      <Link2 size={16} />
                    </button>
                    
                    <button
                      onClick={() => insertText('`', '`')}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      title="行内代码"
                    >
                      <Code size={16} />
                    </button>
                    
                    <button
                      onClick={() => insertText('> ')}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      title="引用"
                    >
                      <Quote size={16} />
                    </button>
                    
                    <button
                      onClick={() => insertText('- ')}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      title="列表"
                    >
                      <List size={16} />
                    </button>
                    
                    <button
                      onClick={() => insertText('![图片描述](', ')')}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      title="图片"
                    >
                      <Image size={16} />
                    </button>
                    
                    <button
                      onClick={() => insertText('## ')}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      title="标题"
                    >
                      <Hash size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* 编辑/预览区域 */}
              <div className="p-6">
                {isPreview ? (
                  /* 预览模式 */
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                      {title || '文章标题'}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(date).toLocaleDateString('zh-CN')}
                      </span>
                      {tags.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Tag size={14} />
                          {tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className="text-slate-700 dark:text-slate-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: '<p class="mb-4">' + renderMarkdown(content || '在此输入文章内容...') + '</p>' 
                      }} 
                    />
                  </div>
                ) : (
                  /* 编辑模式 */
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          文章内容 (支持 Markdown)
                        </label>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {content.length} 字符
                        </span>
                      </div>
                      
                      <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`# 开始写作...

使用 Markdown 语法来格式化你的内容：

## 二级标题

**粗体文本** 和 *斜体文本*

- 列表项
- 另一个列表项

\`行内代码\` 和代码块：

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

> 这是一个引用

[链接文本](https://example.com)

![图片描述](图片URL)`}
                        className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white font-mono text-sm resize-none"
                      />
                    </div>
                    
                    {/* Markdown 快速提示 */}
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-md p-3">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Markdown 快速语法：
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span><code># </code> 一级标题</span>
                        <span><code>## </code> 二级标题</span>
                        <span><code>**粗体**</code> 粗体</span>
                        <span><code>*斜体*</code> 斜体</span>
                        <span><code>`代码`</code> 行内代码</span>
                        <span><code>- </code> 列表</span>
                        <span><code>{'>'} </code> 引用</span>
                        <span><code>[链接](url)</code> 链接</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 设置面板 */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">编辑器设置</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">数据管理</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const data = JSON.stringify(savedPosts, null, 2);
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `blog-backup-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                    >
                      备份所有文章
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm('确定要清空所有文章吗？此操作无法撤销！')) {
                          savePosts([]);
                          newPost();
                        }
                      }}
                      className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                    >
                      清空所有文章
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">使用提示</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p>• 支持完整的 Markdown 语法</p>
                    <p>• 可导出为 MDX 格式文件</p>
                    <p>• 自动保存到浏览器本地</p>
                    <p>• 支持实时预览效果</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 状态栏 */}
        <div className="fixed bottom-4 right-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg px-3 py-2 text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              {isPreview ? '预览模式' : '编辑模式'} | 字数: {content.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;