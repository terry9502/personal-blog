'use client'
import { useEffect, useState } from 'react'
import { ChevronRight, List } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 只从文章内容区域获取标题，排除其他区域
    const articleElement = document.querySelector('article')
    if (!articleElement) return

    const elements = Array.from(articleElement.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter(elem => {
        // 确保标题有内容
        return elem.textContent && elem.textContent.trim().length > 0
      })
      .map((elem, index) => {
        // 如果没有id，创建一个
        if (!elem.id) {
          const headingText = elem.textContent?.trim() || ''
          const id = `heading-${index}-${headingText
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fff]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 50)}`
          elem.id = id
        }
        
        return {
          id: elem.id,
          text: elem.textContent?.trim() || '',
          level: parseInt(elem.tagName.charAt(1))
        }
      })
      .filter(heading => 
        // 过滤掉一些不需要的标题
        !heading.text.includes('相关文章') &&
        !heading.text.includes('推荐') &&
        !heading.text.includes('评论') &&
        !heading.text.includes('Comments') &&
        heading.text.length > 0
      )

    setHeadings(elements)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id)
        }
      },
      { 
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    )

    elements.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80 // 固定导航栏高度
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      setIsOpen(false) // 移动端点击后关闭
    }
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* 移动端触发按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-3 shadow-lg transition-colors"
        aria-label="显示目录"
      >
        <List size={20} className="text-slate-700 dark:text-slate-300" />
      </button>

      {/* 桌面端固定目录 */}
      <div className="hidden xl:block fixed right-8 top-1/2 transform -translate-y-1/2 z-30">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg p-4 max-w-64 max-h-96 overflow-y-auto shadow-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm flex items-center">
            <List size={16} className="mr-2" />
            文章目录
          </h4>
          <nav className="space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left py-2 px-3 text-xs rounded transition-all duration-200 ${
                  activeId === heading.id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 border-l-2 border-blue-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                style={{ paddingLeft: `${(heading.level - 1) * 0.75 + 0.75}rem` }}
              >
                <div className="flex items-center">
                  {activeId === heading.id && (
                    <ChevronRight size={12} className="mr-1 flex-shrink-0" />
                  )}
                  <span className="truncate leading-tight">{heading.text}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 移动端覆盖层 */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-lg p-6 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center">
                <List size={18} className="mr-2" />
                文章目录
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <nav className="space-y-2">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`block w-full text-left py-2 px-3 text-sm rounded transition-colors ${
                    activeId === heading.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  style={{ paddingLeft: `${(heading.level - 1) * 0.75 + 0.75}rem` }}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}