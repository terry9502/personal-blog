'use client'
import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Grid } from 'lucide-react'

interface ImageData {
  src: string
  alt: string
}

interface ImageGalleryModalProps {
  images: ImageData[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onIndexChange: (index: number) => void
}

export default function ImageGalleryModal({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onIndexChange 
}: ImageGalleryModalProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showThumbnails, setShowThumbnails] = useState(false)

  const currentImage = images[currentIndex]

  // 重置变换
  const resetTransform = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  // 切换图片时重置变换
  useEffect(() => {
    resetTransform()
  }, [currentIndex])

  // 关闭时重置
  useEffect(() => {
    if (!isOpen) {
      resetTransform()
      setShowThumbnails(false)
    }
  }, [isOpen])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          if (currentIndex > 0) {
            onIndexChange(currentIndex - 1)
          }
          break
        case 'ArrowRight':
          if (currentIndex < images.length - 1) {
            onIndexChange(currentIndex + 1)
          }
          break
        case '+':
        case '=':
          setScale(prev => Math.min(prev + 0.2, 3))
          break
        case '-':
          setScale(prev => Math.max(prev - 0.2, 0.5))
          break
        case 'r':
        case 'R':
          setRotation(prev => prev + 90)
          break
        case 'g':
        case 'G':
          setShowThumbnails(prev => !prev)
          break
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
  }, [isOpen, onClose, currentIndex, images.length, onIndexChange])

  // 拖拽处理
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

  // 下载当前图片
  const downloadCurrentImage = async () => {
    try {
      const response = await fetch(currentImage.src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = currentImage.alt || `image-${currentIndex + 1}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('图片下载失败:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95">
      {/* 顶部工具栏 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white rounded-lg p-3 flex items-center space-x-3 z-20">
        <button
          onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          title="缩小"
        >
          <ZoomOut size={18} />
        </button>
        
        <span className="text-sm px-3 py-1 bg-white bg-opacity-10 rounded min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        
        <button
          onClick={() => setScale(prev => Math.min(prev + 0.2, 3))}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          title="放大"
        >
          <ZoomIn size={18} />
        </button>
        
        <div className="w-px h-6 bg-white bg-opacity-30"></div>
        
        <button
          onClick={() => setRotation(prev => prev + 90)}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          title="旋转"
        >
          <RotateCw size={18} />
        </button>
        
        <button
          onClick={downloadCurrentImage}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          title="下载"
        >
          <Download size={18} />
        </button>
        
        <button
          onClick={() => setShowThumbnails(!showThumbnails)}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          title="缩略图"
        >
          <Grid size={18} />
        </button>
        
        <button
          onClick={resetTransform}
          className="px-3 py-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors text-xs"
          title="重置"
        >
          重置
        </button>
      </div>

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black bg-opacity-80 p-3 rounded-full hover:bg-opacity-100 transition-colors z-20"
        title="关闭 (ESC)"
      >
        <X size={24} />
      </button>

      {/* 左右切换按钮 */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-80 p-3 rounded-full hover:bg-opacity-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-20"
            title="上一张 (←)"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => onIndexChange(Math.min(images.length - 1, currentIndex + 1))}
            disabled={currentIndex === images.length - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-80 p-3 rounded-full hover:bg-opacity-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-20"
            title="下一张 (→)"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* 图片计数器 */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm z-20">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* 主图片 */}
      <div
        className="w-full h-full flex items-center justify-center"
        onClick={onClose}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onWheel={(e) => {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.1 : 0.1
          setScale(prev => Math.max(0.5, Math.min(3, prev + delta)))
        }}
      >
        <img
          src={currentImage?.src}
          alt={currentImage?.alt}
          className="max-w-[95vw] max-h-[95vh] object-contain select-none transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (scale === 1) {
              setScale(2)
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        />
      </div>

      {/* 缩略图栏 */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 rounded-lg p-3 max-w-4xl overflow-x-auto z-20">
          <div className="flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                  index === currentIndex 
                    ? 'border-blue-500' 
                    : 'border-white border-opacity-30 hover:border-opacity-60'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 图片描述 */}
      {currentImage?.alt && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg text-sm max-w-2xl text-center z-10">
          {currentImage.alt}
        </div>
      )}

      {/* 快捷键提示 */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs p-3 rounded-lg z-10">
        <div className="space-y-1 text-white text-opacity-80">
          <div>ESC: 关闭</div>
          <div>←→: 切换图片</div>
          <div>滚轮/+/-: 缩放</div>
          <div>拖拽: 移动图片</div>
          <div>R: 旋转</div>
          <div>G: 缩略图</div>
        </div>
      </div>
    </div>
  )
}