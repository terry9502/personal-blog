'use client'
import { useState, useEffect } from 'react'

interface Heading {
  id: string
  text: string
  level: number
  element: Element
}

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [currentHeading, setCurrentHeading] = useState<string>('')
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const headingsData: Heading[] = Array.from(headingElements).map((element, index) => {
      const id = element.id || `heading-${index}`
      if (!element.id) {
        element.id = id
      }
      return {
        id,
        text: element.textContent || '',
        level: parseInt(element.tagName.charAt(1)),
        element
      }
    })
    
    setHeadings(headingsData)
  }, [])

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((scrollTop / docHeight) * 100, 100)
      setProgress(progress)

      const currentHeadingElement = headings
        .slice()
        .reverse()
        .find(heading => {
          const rect = heading.element.getBoundingClientRect()
          return rect.top <= 200
        })

      if (currentHeadingElement) {
        setCurrentHeading(currentHeadingElement.text)
      }
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [headings])

  return (
    <>
      {/* 进度条在导航栏内部底部 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-40 mt-16"> {/* 降低z-index，添加top margin */}
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* 当前标题提示 */}
      {currentHeading && progress > 5 && (
        <div className="fixed top-17 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200 z-40"> {/* 调整位置 */}
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-slate-600">
                <span>正在阅读:</span>
                <span className="font-medium text-slate-900 truncate max-w-md">
                  {currentHeading}
                </span>
              </div>
              <div className="text-slate-500 text-xs">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}