import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Sécurisation simple par secret en query string
    const secret = req.nextUrl.searchParams.get('secret')
    
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { ok: false, error: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Parser le body pour connaître le type de contenu modifié
    let body: { _type?: string; slug?: { current?: string } } = {}
    try {
      body = await req.json()
    } catch {
      // Si pas de body, on revalide tout par défaut
    }

    // Revalidation basée sur le type de document
    if (body._type) {
      switch (body._type) {
        case 'artist':
          // Revalider la liste des artistes
          revalidatePath('/artists')
          // Revalider la page spécifique si on a le slug
          if (body.slug?.current) {
            revalidatePath(`/artists/${body.slug.current}`)
          }
          // Revalider aussi work car il affiche les artistes
          revalidatePath('/work')
          break

        case 'work':
          // Revalider la liste des œuvres
          revalidatePath('/work')
          // Revalider la page spécifique si on a le slug
          if (body.slug?.current) {
            revalidatePath(`/work/${body.slug.current}`)
          }
          break

        case 'post':
          // Revalider les posts
          revalidatePath('/updates')
          revalidatePath('/posts')
          if (body.slug?.current) {
            revalidatePath(`/posts/${body.slug.current}`)
          }
          break

        case 'category':
          // Revalider toutes les pages principales
          revalidatePath('/artists')
          revalidatePath('/work')
          revalidatePath('/posts')
          break

        default:
          // Pour les autres types, revalider les pages principales
          revalidatePath('/artists')
          revalidatePath('/work')
      }
    } else {
      // Si pas de type spécifié, revalider les pages principales
      revalidatePath('/artists')
      revalidatePath('/work')
    }

    return NextResponse.json({
      ok: true,
      revalidated: true,
      timestamp: new Date().toISOString(),
      type: body._type || 'all',
    })
  } catch (err: any) {
    console.error('Error revalidating:', err)
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    )
  }
}
