import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-12">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">我</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">关于我</h1>
          <p className="text-xl text-slate-600">
            软件工程专业学生 · 全栈开发爱好者
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">👋 你好</h2>
            <p className="text-slate-700 leading-relaxed">
              我是一名软件工程专业的学生，对编程和技术充满热情。我喜欢探索新技术，
              解决复杂问题，并通过代码创造有价值的产品。这个博客是我记录学习历程、
              分享技术心得和展示项目成果的地方。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">💻 技术栈</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-3">前端开发</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• React & Next.js</li>
                  <li>• Vue.js</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-3">后端开发</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Node.js</li>
                  <li>• Python</li>
                  <li>• Java</li>
                  <li>• MySQL & MongoDB</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">🎯 目标</h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">▸</span>
                成为一名优秀的全栈开发工程师
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">▸</span>
                持续学习新技术，保持技术敏感度
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">▸</span>
                通过博客分享知识，帮助更多人
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">▸</span>
                参与开源项目，回馈技术社区
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">📬 联系我</h2>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:your@email.com" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📧 邮件联系
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:text-slate-900 transition-colors"
              >
                💻 GitHub
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}