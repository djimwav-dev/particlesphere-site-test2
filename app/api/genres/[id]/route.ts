import { NextResponse } from 'next/server'

// Suppression désactivée côté portail: gérer dans le Studio Sanity
export async function DELETE() {
  return NextResponse.json({
    error: 'Suppression désactivée. Merci de gérer les genres dans le Studio Sanity.'
  }, { status: 403 })
}
