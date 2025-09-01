'use client'
import { useState, useEffect } from 'react'
import { X, ZoomIn } from 'lucide-react'

// 简化的图片模态框组件
function ImageModal({ src, alt, isOpen, onClose }: { src: string; alt: string; isOpen: boolean; onClose: () => void }) {
  console.log('ImageModal rendered with:', { src, alt, isOpen })

  // ESC键关闭
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log('Key pressed in modal:', e.key)
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      console.log('Modal opened, adding event listener')
      document.addEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      console.log('Modal cleanup')
      document.removeEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center">
      {/* 关闭按钮 */}
      <button
        onClick={() => {
          console.log('Close button clicked')
          onClose()
        }}
        className="absolute top-4 right-4 text-white bg-black bg-opacity-80 p-3 rounded-full hover:bg-opacity-100 transition-all z-10"
        title="关闭 (ESC)"
      >
        <X size={24} />
      </button>

      {/* 背景点击关闭 */}
      <div 
        className="w-full h-full flex items-center justify-center cursor-pointer"
        onClick={(e) => {
          console.log('Modal background clicked')
          onClose()
        }}
      >
        {/* 图片 */}
        <img
          src={src}
          alt={alt}
          className="max-w-[90vw] max-h-[90vh] object-contain select-none"
          onClick={(e) => {
            console.log('Modal image clicked, preventing close')
            e.stopPropagation()
          }}
        />
      </div>

      {/* 图片描述 */}
      {alt && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg text-sm max-w-2xl text-center">
          {alt}
        </div>
      )}

      {/* 使用提示 */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs p-3 rounded-lg">
        <div>ESC: 关闭</div>
      </div>
    </div>
  )
}

interface ClickableImageProps {
  src: string
  alt: string
  className?: string
}

export default function ClickableImage({ src, alt, className = '' }: ClickableImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  console.log('ClickableImage rendering with:', { src, alt, className })
  console.log('Modal state:', isModalOpen)

  return (
    <>
      <span className="block my-6 text-center group">
        <div className="relative inline-block">
          <img 
            src={src} 
            alt={alt || ''} 
            className={`rounded-lg shadow-md max-w-full h-auto mx-auto dark:brightness-90 cursor-pointer transition-all duration-300 group-hover:brightness-110 group-hover:scale-[1.02] block ${className}`}
            loading="lazy"
            onClick={(e) => {
              console.log('=== MAIN IMAGE CLICKED ===')
              console.log('图片被点击了！', src)
              console.log('Event:', e)
              console.log('Current modal state:', isModalOpen)
              e.preventDefault()
              e.stopPropagation()
              setIsModalOpen(true)
              console.log('Modal should open now')
            }}
            onError={(e) => {
              console.error('Image load error for:', src)
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', src)
            }}
          />
          
          {/* 放大图标提示 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-20 rounded-lg pointer-events-none">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg">
              <ZoomIn size={24} className="text-slate-700 dark:text-slate-300" />
            </div>
          </div>
        </div>
        
        {alt && (
          <span className="block text-sm text-slate-500 dark:text-slate-400 mt-2 italic">
            {alt} (点击查看大图)
          </span>
        )}
      </span>

      {/* 图片放大模态框 */}
      <ImageModal
        src={src}
        alt={alt}
        isOpen={isModalOpen}
        onClose={() => {
          console.log('Modal closing...')
          setIsModalOpen(false)
        }}
      />
    </>
  )
}