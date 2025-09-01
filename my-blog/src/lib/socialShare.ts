// src/lib/socialShare.ts

export interface ShareData {
  url: string
  title: string
  description: string
  image?: string
}

// 分享到微博
export function shareToWeibo(data: ShareData): void {
  const params = new URLSearchParams({
    url: data.url,
    title: `${data.title} - ${data.description}`,
    pic: data.image || '',
  })
  
  const shareUrl = `https://service.weibo.com/share/share.php?${params.toString()}`
  openShareWindow(shareUrl, 'weibo')
}

// 分享到QQ空间
export function shareToQzone(data: ShareData): void {
  const params = new URLSearchParams({
    url: data.url,
    title: data.title,
    desc: data.description,
    pics: data.image || '',
  })
  
  const shareUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?${params.toString()}`
  openShareWindow(shareUrl, 'qzone')
}

// 分享到Twitter
export function shareToTwitter(data: ShareData): void {
  const text = `${data.title} - ${data.description}`
  const params = new URLSearchParams({
    text,
    url: data.url,
  })
  
  const shareUrl = `https://twitter.com/intent/tweet?${params.toString()}`
  openShareWindow(shareUrl, 'twitter')
}

// 分享到Facebook
export function shareToFacebook(data: ShareData): void {
  const params = new URLSearchParams({
    u: data.url,
    t: data.title,
  })
  
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?${params.toString()}`
  openShareWindow(shareUrl, 'facebook')
}

// 分享到LinkedIn
export function shareToLinkedIn(data: ShareData): void {
  const params = new URLSearchParams({
    url: data.url,
    title: data.title,
    summary: data.description,
  })
  
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`
  openShareWindow(shareUrl, 'linkedin')
}

// 生成微信分享二维码
export function generateWeChatQR(url: string): string {
  // 使用免费的二维码API生成微信分享码
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
}

// 复制链接到剪贴板
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 兼容性方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

// 检测是否在微信浏览器中
export function isWeChatBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase()
  return /micromessenger/.test(ua)
}

// 检测是否在移动设备上
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 打开分享窗口
function openShareWindow(url: string, platform: string): void {
  const width = 600
  const height = 400
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2
  
  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
  
  window.open(url, `share_${platform}`, features)
}

// 分享统计（可选）
export function trackShare(platform: string, url: string): void {
  // 这里可以集成你的分析工具
  console.log(`分享到${platform}: ${url}`)
  
  // 示例：发送到Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'share', {
      method: platform,
      content_type: 'article',
      item_id: url
    })
  }
}