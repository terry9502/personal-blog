'use client'
import { useState, useEffect } from 'react'
import { 
  Share2, 
  MessageCircle, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy, 
  Check,
  X,
  QrCode
} from 'lucide-react'
import {
  ShareData,
  shareToWeibo,
  shareToQzone,
  shareToTwitter,
  shareToFacebook,
  shareToLinkedIn,
  copyToClipboard,
  generateWeChatQR,
  isWeChatBrowser,
  isMobileDevice,
  trackShare
} from '@/lib/socialShare'

interface SocialShareProps {
  title: string
  description: string
  url?: string
  className?: string
}

export default function SocialShare({ title, description, url, className = '' }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showWeChatQR, setShowWeChatQR] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    // 获取当前页面URL
    const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
    setCurrentUrl(pageUrl)
  }, [url])

  const shareData: ShareData = {
    url: currentUrl,
    title,
    description,
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(currentUrl)
    if (success) {
      setCopied(true)
      trackShare('copy_link', currentUrl)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = (platform: string, shareFunction: () => void) => {
    shareFunction()
    trackShare(platform, currentUrl)
    setIsOpen(false)
  }

  const handleWeChatShare = () => {
    if (isWeChatBrowser()) {
      // 在微信浏览器中，提示用户使用右上角分享
      alert('请点击右上角"..."按钮分享到朋友圈或发送给朋友')
    } else {
      // 显示二维码供微信扫码
      setShowWeChatQR(true)
      trackShare('wechat_qr', currentUrl)
    }
  }

  const shareButtons = [
    {
      name: '微信',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      action: handleWeChatShare,
      key: 'wechat'
    },
    {
      name: '微博',
      icon: Share2,
      color: 'bg-red-500 hover:bg-red-600',
      action: () => handleShare('weibo', () => shareToWeibo(shareData)),
      key: 'weibo'
    },
    {
      name: 'QQ空间',
      icon: MessageCircle,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => handleShare('qzone', () => shareToQzone(shareData)),
      key: 'qzone'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => handleShare('twitter', () => shareToTwitter(shareData)),
      key: 'twitter'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => handleShare('facebook', () => shareToFacebook(shareData)),
      key: 'facebook'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      action: () => handleShare('linkedin', () => shareToLinkedIn(shareData)),
      key: 'linkedin'
    }
  ]

  return (
    <div className={`relative ${className}`}>
      {/* 分享触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        aria-label="分享文章"
      >
        <Share2 size={18} className="mr-2" />
        <span className="hidden sm:inline">分享文章</span>
        <span className="sm:hidden">分享</span>
      </button>

      {/* 分享面板 */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 min-w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                分享到社交平台
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* 分享按钮网格 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {shareButtons.map((button) => {
                const Icon = button.icon
                return (
                  <button
                    key={button.key}
                    onClick={button.action}
                    className={`flex flex-col items-center p-3 rounded-lg text-white transition-all ${button.color} hover:scale-105`}
                  >
                    <Icon size={20} className="mb-1" />
                    <span className="text-xs">{button.name}</span>
                  </button>
                )
              })}
            </div>

            {/* 复制链接 */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-2 text-green-600" />
                    <span className="text-sm text-green-600">链接已复制</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-2 text-slate-600 dark:text-slate-300" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">复制链接</span>
                  </>
                )}
              </button>
            </div>

            {/* 分享统计提示 */}
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
              感谢您的分享！❤️
            </div>
          </div>
        </div>
      )}

      {/* 微信二维码弹窗 */}
      {showWeChatQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                微信分享
              </h3>
              <button
                onClick={() => setShowWeChatQR(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img
                  src={generateWeChatQR(currentUrl)}
                  alt="微信分享二维码"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                用微信扫描二维码
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                将文章分享给微信好友或朋友圈
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 移动端优化：点击外部关闭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}