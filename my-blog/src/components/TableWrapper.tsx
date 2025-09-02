// src/components/TableWrapper.tsx - 增强版本
'use client'

import React from 'react'

interface TableWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function TableWrapper({ children, className = '' }: TableWrapperProps) {
  return (
    <div className={`table-container overflow-x-auto my-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <style jsx>{`
        .table-container {
          display: block !important;
          width: 100% !important;
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }
        
        .table-container table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 0 !important;
          background-color: white !important;
          display: table !important;
          table-layout: auto !important;
          border: 1px solid #e5e7eb !important;
        }
        
        .table-container thead {
          display: table-header-group !important;
          background-color: #f9fafb !important;
        }
        
        .table-container tbody {
          display: table-row-group !important;
          background-color: white !important;
        }
        
        .table-container tr {
          display: table-row !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
        
        .table-container th {
          display: table-cell !important;
          padding: 12px 16px !important;
          text-align: left !important;
          font-weight: 600 !important;
          font-size: 0.875rem !important;
          color: #374151 !important;
          border: 1px solid #e5e7eb !important;
          background-color: #f9fafb !important;
          vertical-align: middle !important;
        }
        
        .table-container td {
          display: table-cell !important;
          padding: 12px 16px !important;
          font-size: 0.875rem !important;
          color: #1f2937 !important;
          border: 1px solid #e5e7eb !important;
          vertical-align: top !important;
          background-color: transparent !important;
        }
        
        .table-container tbody tr:nth-child(even) {
          background-color: #f9fafb !important;
        }
        
        .table-container tbody tr:hover {
          background-color: #f3f4f6 !important;
          transition: background-color 0.15s ease-in-out !important;
        }
        
        /* 深色模式样式 */
        :global(.dark) .table-container table {
          background-color: #111827 !important;
          border-color: #4b5563 !important;
        }
        
        :global(.dark) .table-container thead {
          background-color: #1f2937 !important;
        }
        
        :global(.dark) .table-container th {
          color: #d1d5db !important;
          border-color: #4b5563 !important;
          background-color: #1f2937 !important;
        }
        
        :global(.dark) .table-container td {
          color: #e5e7eb !important;
          border-color: #4b5563 !important;
        }
        
        :global(.dark) .table-container tbody tr:nth-child(even) {
          background-color: #1f2937 !important;
        }
        
        :global(.dark) .table-container tbody tr:hover {
          background-color: #374151 !important;
        }
        
        /* 移动端优化 */
        @media (max-width: 768px) {
          .table-container {
            font-size: 0.75rem !important;
          }
          
          .table-container table {
            min-width: 500px !important;
          }
          
          .table-container th,
          .table-container td {
            padding: 8px 12px !important;
            font-size: 0.75rem !important;
          }
        }
        
        /* 确保表格元素不被隐藏 */
        .table-container table,
        .table-container thead,
        .table-container tbody,
        .table-container tr,
        .table-container th,
        .table-container td {
          display: revert !important;
        }
        
        /* 防止其他CSS干扰 */
        .table-container * {
          box-sizing: border-box !important;
        }
      `}</style>
      <div className="min-w-full">
        {children}
      </div>
    </div>
  )
}