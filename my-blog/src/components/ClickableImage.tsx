'use client'
import { useState, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

// 图片模态框组件
function ImageModal({ src, alt, isOpen, onClose }: { src: string; alt: string; isOpen: boolean; onClose: () => void }) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // 重置状态
  const resetTransform = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  // 关闭模态框时重置
  useEffect(() => {
    console.log('ImageModal useEffect - isOpen:', isOpen)
    if (!isOpen) {
      resetTransform()
    }
  }, [isOpen])

  // ESC键关闭和快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log('Key pressed in modal:', e.key)
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === '+' || e.key === '=') {
        setScale(prev => Math.min(prev + 0.2, 3))
      } else if (e.key === '-') {
        setScale(prev => Math.max(prev - 0.2, 0.5))
      } else if (e.key === 'r' || e.key === 'R') {
        setRotation(prev => prev + 90)
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

  // 鼠标拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('Mouse down, scale:', scale)
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    console.log('Wheel event, delta:', delta, 'current scale:', scale)
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3))
  }

  console.log('ImageModal rendering, isOpen:', isOpen, 'src:', src)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95">
      {/* 顶部工具栏 */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        <div className="bg-black bg-opacity-80 text-white rounded-lg px-3 py-2 text-sm">
          缩放: {Math.round(scale * 100)}%
        </div>
        
        <div className="flex bg-black bg-opacity-80 rounded-lg p-1">
          <button
            onClick={() => {
              console.log('Zoom out button clicked')
              setScale(prev => Math.max(prev - 0.2, 0.5))
            }}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-all"
            title="缩小"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={() => {
              console.log('Zoom in button clicked')
              setScale(prev => Math.min(prev + 0.2, 3))
            }}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-all"
            title="放大"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => {
              console.log('Rotate button clicked')
              setRotation(prev => prev + 90)
            }}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-all"
            title="旋转"
          >
            <RotateCw size={18} />
          </button>
        </div>

        <button
          onClick={() => {
            console.log('Close button clicked')
            onClose()
          }}
          className="p-2 bg-black bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all"
          title="关闭"
        >
          <X size={18} />
        </button>
      </div>

      {/* 主要显示区域 */}
      <div 
        className="w-full h-full flex items-center justify-center cursor-pointer"
        onClick={(e) => {
          console.log('Modal background clicked')
          onClose()
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-[90vw] max-h-[90vh] object-contain select-none transition-transform duration-300"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            cursor: scale > 1 ? 
              (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
          }}
          onClick={(e) => {
            e.stopPropagation()
            console.log('Modal image clicked, current scale:', scale)
            if (scale === 1) {
              console.log('Setting scale to 2')
              setScale(2)
            }
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      {/* 使用提示 */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-xs p-3 rounded-lg max-w-48">
        <div className="space-y-1">
          <div>ESC: 关闭</div>
          <div>滚轮: 缩放</div>
          <div>拖拽: 移动</div>
          <div>+/-: 缩放</div>
          <div>R: 旋转</div>
        </div>
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

  console.log('ClickableImage rendering with props:', { src, alt, className })
  console.log('Current modal state:', isModalOpen)

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
              console.log('=== IMAGE CLICKED ===')
              console.log('图片被点击了！', src)
              console.log('Event object:', e)
              console.log('Current modal state before click:', isModalOpen)
              setIsModalOpen(true)
              console.log('Modal state should now be true')
            }}
            onError={(e) => {
              console.error('Image load error:', e)
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', src)
            }}
          />
          
          {/* 放大图标提示 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-20 rounded-lg">
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
      {console.log('About to render ImageModal, isOpen:', isModalOpen)}
      <ImageModal
        src={src}
        alt={alt}
        isOpen={isModalOpen}
        onClose={() => {
          console.log('Modal onClose called')
          setIsModalOpen(false)
        }}
      />
    </>
  )
}