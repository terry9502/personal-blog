export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            欢迎来到我的博客
          </h1>
          <p className="text-xl text-slate-600">
            这是一个使用 Next.js 和 Tailwind CSS 构建的博客
          </p>
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">测试样式</h2>
            <p className="text-gray-600">
              如果你能看到这个带有样式的页面，说明 Tailwind CSS 配置成功！
            </p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              测试按钮
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}