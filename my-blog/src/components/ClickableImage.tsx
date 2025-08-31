'use client'
import { useState } from 'react'
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
  React.useEffect(() => {
    if (!isOpen) {
      resetTransform()
    }
  }, [isOpen])

  // ESC键关闭和快捷键
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
      document.addEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // 鼠标拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
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
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center">
      {/* 工具栏 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white rounded-lg p-2 flex items-center space-x-2 z-10">
        <button
          onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          title="缩小 (按键: -)"
        >
          <ZoomOut size={20} />
        </button>
        
        <span className="text-sm px-2 py-1 bg-white bg-opacity-10 rounded">
          {Math.round(scale * 100)}%
        </span>
        
        <button
          onClick={() => setScale(prev => Math.min(prev + 0.2, 3))}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          title="放大 (按键: +)"
        >
          <ZoomIn size={20} />
        </button>
        
        <button
          onClick={() => setRotation(prev => prev + 90)}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          title="旋转 (按键: R)"
        >
          <RotateCw size={20} />
        </button>
        
        <button
          onClick={resetTransform}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors text-sm"
          title="重置"
        >
          重置
        </button>
      </div>

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black bg-opacity-70 p-3 rounded-full hover:bg-opacity-90 transition-colors z-10"
        title="关闭 (按键: ESC)"
      >
        <X size={24} />
      </button>

      {/* 图片描述 */}
      {alt && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm max-w-2xl text-center">
          {alt}
        </div>
      )}

      {/* 图片容器 */}
      <div
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onClick={onClose}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-none max-h-none select-none transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (scale === 1) {
              setScale(2) // 单击放大
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
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

  return (
    <>
      <span className="block my-6 text-center group">
        <div className="relative inline-block">
          <img 
            src={src} 
            alt={alt || ''} 
            className={`rounded-lg shadow-md max-w-full h-auto mx-auto dark:brightness-90 cursor-pointer transition-all duration-300 group-hover:brightness-110 group-hover:scale-[1.02] block ${className}`}
            loading="lazy"
            onClick={() => {
              console.log('图片被点击了！', src)
              setIsModalOpen(true)
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
      <ImageModal
        src={src}
        alt={alt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}