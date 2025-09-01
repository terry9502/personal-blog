'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      onClick={copyToClipboard}
      className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors opacity-0 group-hover:opacity-100"
      title={copied ? "已复制!" : "复制代码"}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}