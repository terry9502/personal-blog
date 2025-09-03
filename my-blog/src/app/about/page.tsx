import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 transition-colors">
        <div className="text-center mb-12">
          <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden">
            <img 
              src="/avatar.jpg" 
              alt="Niutr" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">关于我</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            软件工程专业学生 · 全栈开发爱好者
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">👋 你好</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              我是 Niutr，一名软件工程专业的学生，对编程和技术充满热情。我喜欢探索新技术，  {/* ✅ 修改 */}
              解决复杂问题，并通过代码创造有价值的产品。这个博客是我记录学习历程、
              分享技术心得和展示项目成果的地方。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">💻 技术栈</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">前端开发</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>• React & Next.js</li>
                  <li>• Vue.js</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">后端开发</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>• Node.js</li>
                  <li>• Python</li>
                  <li>• Java</li>
                  <li>• MySQL & MongoDB</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">🎯 目标</h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">▸</span>
                成为一名优秀的全栈开发工程师
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">▸</span>
                持续学习新技术，保持技术敏感度
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">▸</span>
                参与开源项目，为社区做贡献
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">▸</span>
                通过技术解决实际问题，创造价值
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">📚 学习历程</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
                <h3 className="font-medium text-slate-900 dark:text-white">软件工程专业在读</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">2022年 - 至今</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">
                  系统学习软件开发理论和实践，参与多个课程项目
                </p>
              </div>
              <div className="border-l-4 border-green-500 dark:border-green-400 pl-4">
                <h3 className="font-medium text-slate-900 dark:text-white">自学前端开发</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">2023年</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">
                  深入学习 React、Next.js、TypeScript 等现代前端技术
                </p>
              </div>
              <div className="border-l-4 border-purple-500 dark:border-purple-400 pl-4">
                <h3 className="font-medium text-slate-900 dark:text-white">全栈项目实践</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">2024年</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">
                  独立完成多个全栈项目，包括这个个人博客网站
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">🎨 兴趣爱好</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              除了编程，我还喜欢阅读技术书籍、关注行业趋势、写作分享。
              我相信技术不仅是工具，更是改变世界的力量。希望能通过自己的努力，
              在技术领域不断成长，同时帮助更多人了解和喜欢上编程。
            </p>
          </section>

          <section className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">📧 联系我</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              如果你想和我交流技术、学习经验，或者有任何问题和建议，欢迎联系我：
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:your@email.com" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                📧 邮箱联系
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-slate-800 dark:bg-slate-600 hover:bg-slate-900 dark:hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                💻 GitHub
              </a>
              <Link 
                href="/blog" 
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-400 rounded-lg transition-colors"
              >
                📚 查看我的博客
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}