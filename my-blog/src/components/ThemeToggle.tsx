'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (theme === 'light') {
            setTheme('dark')
          } else if (theme === 'dark') {
            setTheme('system')
          } else {
            setTheme('light')
          }
        }}
        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
        title={`当前: ${theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '系统'}`}
      >
        {theme === 'light' && <Sun size={18} className="text-yellow-500" />}
        {theme === 'dark' && <Moon size={18} className="text-blue-400" />}
        {theme === 'system' && <Monitor size={18} className="text-slate-600" />}
      </button>
    </div>
  )
}