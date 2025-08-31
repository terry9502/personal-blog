'use client'
import { useState } from 'react'
import { Rss, Copy, Check, ExternalLink } from 'lucide-react'

export default function RSSSubscribe() {
  const [copied, setCopied] = useState(false)
  const rssUrl = 'https://niutr.cn/rss.xml'

  const copyRSSUrl = async () => {
    try {
      await navigator.clipboard.writeText(rssUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  const popularRssReaders = [
    { name: 'Feedly', url: `https://feedly.com/i/subscription/feed/${encodeURIComponent(rssUrl)}`, color: 'bg-green-600 hover:bg-green-700' },
    { name: 'Inoreader', url: `https://www.inoreader.com/?add_feed=${encodeURIComponent(rssUrl)}`, color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'NewsBlur', url: `https://newsblur.com/?url=${encodeURIComponent(rssUrl)}`, color: 'bg-yellow-600 hover:bg-yellow-700' },
    { name: 'The Old Reader', url: `https://theoldreader.com/feeds/subscribe?url=${encodeURIComponent(rssUrl)}`, color: 'bg-red-600 hover:bg-red-700' }
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center mb-4">
        <Rss className="text-orange-500 mr-2" size={24} />
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">RSS 订阅</h3>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        通过RSS订阅，第一时间获取博客更新通知。支持所有主流RSS阅读器。
      </p>

      {/* RSS地址复制 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          RSS Feed 地址：
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={rssUrl}
            readOnly
            className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:outline-none"
          />
          <button
            onClick={copyRSSUrl}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-1"
            title="复制RSS地址"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span className="text-xs">已复制</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span className="text-xs">复制</span>
              </>
            )}
          </button>
          <a
            href={rssUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-1"
            title="直接查看RSS"
          >
            <ExternalLink size={16} />
            <span className="text-xs">查看</span>
          </a>
        </div>
      </div>

      {/* 快速订阅按钮 */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">快速订阅到：</h4>
        <div className="grid grid-cols-2 gap-2">
          {popularRssReaders.map((reader) => (
            <a
              key={reader.name}
              href={reader.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-2 text-white text-sm rounded-lg transition-colors text-center flex items-center justify-center gap-1 ${reader.color}`}
            >
              <ExternalLink size={14} />
              {reader.name}
            </a>
          ))}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">💡 如何使用RSS？</h5>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <li>• 选择一个RSS阅读器（如Feedly、Inoreader等）</li>
          <li>• 复制上面的RSS地址</li>
          <li>• 在阅读器中添加新的订阅源</li>
          <li>• 粘贴RSS地址完成订阅</li>
        </ul>
      </div>
    </div>
  )
}