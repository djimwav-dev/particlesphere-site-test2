import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity.client'

// DELETE /api/genres/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const portalCode = req.headers.get('x-portal-code') || req.nextUrl.searchParams.get('code')
  const required = process.env.PORTAL_CODE

  if (!required) {
    return NextResponse.json({ error: 'Portal code not configured' }, { status: 500 })
  }

  if (!portalCode || portalCode !== required) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing genre id' }, { status: 400 })
  }

  try {
    await writeClient.delete(id)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    // Sanity renvoie une erreur si le document est référencé
    const message = (err && (err.message || err.toString())) as string
    if (message?.toLowerCase().includes('referenc')) {
      return NextResponse.json(
        { error: "Ce genre est référencé par d'autres documents et ne peut pas être supprimé." },
        { status: 409 }
      )
    }
    console.error('Error deleting genre:', err)
    return NextResponse.json({ error: 'Failed to delete genre' }, { status: 500 })
  }
}
