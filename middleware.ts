import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = new URL(req.url)
  const pathname = url.pathname
  if (pathname.startsWith('/portal')) {
    const code = url.searchParams.get('code')
    const required = process.env.PORTAL_CODE
    if (!required || code !== required) {
      return NextResponse.rewrite(new URL('/404', req.url))
    }
  }
  return NextResponse.next()
}
