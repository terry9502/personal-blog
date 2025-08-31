// 创建一个测试页面：src/app/test-image/page.tsx
'use client'
import ClickableImage from '@/components/ClickableImage'

export default function TestImagePage() {
  console.log('TestImagePage rendering')
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">图片点击测试页面</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl mb-4">测试1：使用网络图片</h2>
          <ClickableImage 
            src="https://picsum.photos/600/400" 
            alt="随机测试图片" 
          />
        </div>
        
        <div>
          <h2 className="text-xl mb-4">测试2：使用占位图</h2>
          <ClickableImage 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='18' fill='%23999' text-anchor='middle' dy='.3em'%3E点击我测试%3C/text%3E%3C/svg%3E" 
            alt="SVG测试图片" 
          />
        </div>
        
        <div>
          <h2 className="text-xl mb-4">测试3：普通按钮测试</h2>
          <button 
            onClick={() => {
              console.log('普通按钮被点击了！')
              alert('普通按钮工作正常！')
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            点击测试按钮
          </button>
        </div>
      </div>
    </div>
  )
}