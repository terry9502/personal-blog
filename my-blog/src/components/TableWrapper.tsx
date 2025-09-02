'use client'

import React from 'react'

interface TableWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function TableWrapper({ children, className = '' }: TableWrapperProps) {
  return (
    <div className={`overflow-x-auto my-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <div className="min-w-full">
        {children}
      </div>
    </div>
  )
}