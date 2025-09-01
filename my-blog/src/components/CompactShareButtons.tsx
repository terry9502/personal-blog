'use client'
import { useState, useEffect } from 'react'
import { 
  MessageCircle, 
  Twitter, 
  Facebook, 
  Copy, 
  Check,
  Heart
} from 'lucide-react'
import {
  ShareData,
  shareToWeibo,
  shareToTwitter,
  shareToFacebook,
  copyToClipboard,
  isWeChatBrowser,
  trackShare
} from '@/lib/socialShare'

interface CompactShareButtonsProps {
  title: string
  description: string
  url?: string
  className?: string
}

export default function CompactShareButtons({ 
  title, 
  description, 
  url, 
  className = '' 
}: CompactShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [liked, setLiked] = useState(false)

  useEffect(() => {
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

  const handleWeChatShare = () => {
    if (isWeChatBrowser()) {
      alert('请点击右上角"..."按钮分享到朋友圈或发送给朋友')
    } else {
      // 复制链接提示用户在微信中打开
      handleCopy()
      alert('链接已复制！请在微信中粘贴分享')
    }
  }

  const handleShare = (platform: string, shareFunction: () => void) => {
    shareFunction()
    trackShare(platform, currentUrl)
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* 点赞按钮 */}
      <button
        onClick={() => setLiked(!liked)}
        className={`inline-flex items-center px-3 py-2 rounded-lg transition-all ${
          liked 
            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900 dark:text-red-400' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
        }`}
      >
        <Heart size={16} className={`mr-1 ${liked ? 'fill-current' : ''}`} />
        <span className="text-sm">{liked ? '已赞' : '点赞'}</span>
      </button>

      {/* 分享按钮组 */}
      <div className="flex items-center space-x-2">
        {/* 微信分享 */}
        <button
          onClick={handleWeChatShare}
          className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
          title="分享到微信"
        >
          <MessageCircle size={16} />
        </button>

        {/* 微博分享 */}
        <button
          onClick={() => handleShare('weibo', () => shareToWeibo(shareData))}
          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
          title="分享到微博"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.06 12.21c-.26-.21-.44-.48-.53-.79-.09-.31-.07-.64.06-.94.26-.6.28-1.26.07-1.87-.22-.6-.65-1.12-1.21-1.44-.56-.32-1.21-.42-1.84-.28-.32.07-.64.19-.92.37-.28.18-.52.42-.69.71-.17.29-.26.61-.26.94 0 .33.09.65.26.94.17.29.41.53.69.71.28.18.6.3.92.37.32.07.65.05.96-.06.31-.11.58-.29.78-.54.2-.25.33-.54.37-.85.04-.31-.01-.62-.14-.9zm-8.85 5.97c-2.27 0-4.11-1.19-4.11-2.66s1.84-2.66 4.11-2.66 4.11 1.19 4.11 2.66-1.84 2.66-4.11 2.66zm0-4.33c-1.36 0-2.46.75-2.46 1.67s1.1 1.67 2.46 1.67 2.46-.75 2.46-1.67-1.1-1.67-2.46-1.67z"/>
          </svg>
        </button>

        {/* Twitter分享 */}
        <button
          onClick={() => handleShare('twitter', () => shareToTwitter(shareData))}
          className="p-2 bg-sky-100 text-sky-600 hover:bg-sky-200 rounded-lg transition-colors"
          title="分享到Twitter"
        >
          <Twitter size={16} />
        </button>

        {/* Facebook分享 */}
        <button
          onClick={() => handleShare('facebook', () => shareToFacebook(shareData))}
          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
          title="分享到Facebook"
        >
          <Facebook size={16} />
        </button>

        {/* 复制链接 */}
        <button
          onClick={handleCopy}
          className={`p-2 rounded-lg transition-colors ${
            copied 
              ? 'bg-green-100 text-green-600' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
          }`}
          title={copied ? '链接已复制' : '复制链接'}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  )
}