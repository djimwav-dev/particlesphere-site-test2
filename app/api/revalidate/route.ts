import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    )

    // Vérifier la signature si un secret est défini
    if (process.env.SANITY_REVALIDATE_SECRET && !isValidSignature) {
      const message = 'Invalid signature'
      return new NextResponse(JSON.stringify({ message, isValidSignature, body }), {
        status: 401,
      })
    }

    if (!body?._type) {
      const message = 'Bad Request'
      return new NextResponse(JSON.stringify({ message, body }), { status: 400 })
    }

    // Revalidation basée sur le type de document
    switch (body._type) {
      case 'artist':
        // Revalider la page artiste et la liste
        revalidatePath('/artists')
        if (body.slug?.current) {
          revalidatePath(`/artists/${body.slug.current}`)
        }
        // Revalider aussi la page work car elle affiche les artistes
        revalidatePath('/work')
        revalidateTag('artist')
        break

      case 'work':
        // Revalider la page work et la liste
        revalidatePath('/work')
        if (body.slug?.current) {
          revalidatePath(`/work/${body.slug.current}`)
        }
        revalidateTag('work')
        break

      case 'post':
        // Revalider les posts
        revalidatePath('/updates')
        revalidatePath('/posts')
        if (body.slug?.current) {
          revalidatePath(`/posts/${body.slug.current}`)
        }
        revalidateTag('post')
        break

      case 'category':
        // Revalider toutes les pages car les catégories peuvent être partout
        revalidatePath('/', 'layout')
        revalidateTag('category')
        break

      default:
        // Pour les autres types, revalider la homepage
        revalidatePath('/')
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (err: any) {
    console.error('Error revalidating:', err)
    return new NextResponse(JSON.stringify({ message: err.message }), {
      status: 500,
    })
  }
}
