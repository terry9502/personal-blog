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
    const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter(elem => elem.id) // 只包含有id的标题
      .map(elem => ({
        id: elem.id,
        text: elem.textContent || '',
        level: parseInt(elem.tagName.charAt(1))
      }))

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
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg p-4 max-w-64 max-h-96 overflow-y-auto shadow-sm">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">目录</h4>
          <nav className="space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left py-1 px-2 text-xs rounded transition-colors ${
                  activeId === heading.id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                style={{ paddingLeft: `${(heading.level - 1) * 0.5 + 0.5}rem` }}
              >
                <div className="flex items-center">
                  {activeId === heading.id && (
                    <ChevronRight size={14} className="mr-1 flex-shrink-0" />
                  )}
                  <span className="truncate">{heading.text}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 移动端覆盖层 */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-lg p-6 max-h-96 overflow-y-auto">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">目录</h4>
            <nav className="space-y-2">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className="block w-full text-left py-2 px-2 text-sm rounded transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  style={{ paddingLeft: `${(heading.level - 1) * 0.5 + 0.5}rem` }}
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