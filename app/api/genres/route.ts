import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET() {
  try {
    const genres = await client.fetch(
      `*[_type == "musicalGenre"] | order(name asc) {
        _id,
        name
      }`
    )
    
    return NextResponse.json(genres)
  } catch (error) {
    console.error('Error fetching genres:', error)
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 })
  }
}
