'use client'
import { useState, useEffect } from 'react'
import { ChevronRight, List } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const headingElements = document.querySelectorAll('h1, h2, h3, h4')
    const headingsData: Heading[] = Array.from(headingElements).map((element, index) => {
      const id = element.id || `heading-${index}`
      if (!element.id) {
        element.id = id
      }
      return {
        id,
        text: element.textContent || '',
        level: parseInt(element.tagName.charAt(1))
      }
    })
    
    setHeadings(headingsData)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -80% 0%' }
    )

    headingElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const scrollToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    setIsOpen(false)
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* 移动端按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <List size={20} />
      </button>

      {/* 桌面端侧边栏 */}
      <div className="hidden xl:block fixed right-6 top-1/2 transform -translate-y-1/2 w-64 z-30">
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-4 max-h-96 overflow-y-auto">
          <h4 className="font-semibold text-slate-900 mb-3 text-sm">目录</h4>
          <nav>
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left py-2 px-2 text-sm rounded transition-colors ${
                  activeId === heading.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-6 max-h-96 overflow-y-auto">
            <h4 className="font-semibold text-slate-900 mb-4">目录</h4>
            <nav className="space-y-2">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className="block w-full text-left py-2 px-2 text-sm rounded transition-colors hover:bg-slate-50"
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