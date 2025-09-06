// src/lib/usePagination.ts
import { useMemo } from 'react'

export interface PaginationConfig {
  totalItems: number
  itemsPerPage: number
  currentPage: number
}

export interface PaginationResult<T> {
  paginatedData: T[]
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  startIndex: number
  endIndex: number
}

export function usePagination<T>(
  data: T[], 
  config: PaginationConfig
): PaginationResult<T> {
  const { totalItems, itemsPerPage, currentPage } = config

  const result = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    
    const paginatedData = data.slice(startIndex, endIndex)
    
    return {
      paginatedData,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex,
      endIndex
    }
  }, [data, totalItems, itemsPerPage, currentPage])

  return result
}

// 获取当前页码的工具函数
export function getCurrentPage(searchParams: URLSearchParams): number {
  const page = searchParams.get('page')
  const pageNum = page ? parseInt(page, 10) : 1
  return pageNum > 0 ? pageNum : 1
}

// 分页数据切片工具函数（用于服务端）
export function paginateData<T>(
  data: T[], 
  currentPage: number, 
  itemsPerPage: number
): {
  paginatedData: T[]
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  startIndex: number
  endIndex: number
} {
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  
  const paginatedData = data.slice(startIndex, endIndex)
  
  return {
    paginatedData,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex,
    endIndex
  }
}

// 生成分页元数据
export function generatePaginationMeta(
  currentPage: number,
  totalPages: number,
  totalItems: number,
  itemsPerPage: number
) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startItem,
    endItem,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  }
}