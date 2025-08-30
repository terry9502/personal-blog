import { getAllPosts } from '@/lib/blog'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json([])
  }

  const posts = getAllPosts()
  const filtered = posts.filter(post => 
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.description.toLowerCase().includes(query.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
    post.content.toLowerCase().includes(query.toLowerCase())
  )

  return NextResponse.json(filtered)
}