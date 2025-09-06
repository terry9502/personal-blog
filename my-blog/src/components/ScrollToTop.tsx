// src/components/ScrollToTop.tsx
'use client'

import { useState, useEffect } from 'react'

interface ScrollToTopProps {
  className?: string
}

export default function ScrollToTop({ className = '' }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset
      
      // 滚动超过300px时显示按钮
      setIsVisible(scrolled > 300)
    }

    // 添加滚动事件监听器
    window.addEventListener('scroll', toggleVisibility)
    
    // 初始检查
    toggleVisibility()
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {/* 回到顶部按钮 */}
      <button
        onClick={scrollToTop}
        className={`
          fixed right-6 bottom-6 w-12 h-12 md:w-14 md:h-14
          bg-gradient-to-br from-blue-500 to-purple-600
          hover:from-blue-600 hover:to-purple-700
          dark:from-blue-600 dark:to-purple-700
          dark:hover:from-blue-700 dark:hover:to-purple-800
          text-white rounded-full shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-900
          z-40 group
          ${isVisible 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
          }
          ${className}
        `}
        aria-label="回到顶部"
        title="回到顶部"
      >
        <svg 
          className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-y-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </button>
    </>
  )
}