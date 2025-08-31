// src/components/OptimizedImage.tsx
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width = 800, 
  height = 600,
  className = "" 
}: OptimizedImageProps) {
  return (
    <div className="my-6 text-center">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-lg shadow-md max-w-full h-auto mx-auto dark:brightness-90 ${className}`}
        loading="lazy"
      />
      {alt && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 italic">
          {alt}
        </p>
      )}
    </div>
  )
}