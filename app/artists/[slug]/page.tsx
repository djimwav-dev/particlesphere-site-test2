import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { artistBySlugQuery, artistSlugsQuery } from '@/sanity/lib/queries'
import { Artist } from '@/sanity/lib/types'
import { urlFor } from '@/sanity/lib/image'

// Revalidation ISR
export const revalidate = 60

// Génération des pages statiques pour tous les artistes
export async function generateStaticParams() {
  const artists = await client.fetch<{ slug: string }[]>(artistSlugsQuery)
  return artists.map((artist) => ({
    slug: artist.slug,
  }))
}

// Génération des métadonnées dynamiques
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const artist = await client.fetch<Artist>(artistBySlugQuery, { slug })

  if (!artist) {
    return {
      title: 'Artist Not Found',
    }
  }

  return {
    title: `${artist.name} | Particle Sphere`,
    description: artist.excerpt || `Discover works by ${artist.name}`,
    openGraph: artist.image
      ? {
          images: [urlFor(artist.image).width(1200).height(630).url()],
        }
      : undefined,
  }
}

async function getArtist(slug: string) {
  const artist = await client.fetch<Artist>(artistBySlugQuery, { slug })
  return artist
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artist = await getArtist(slug)

  if (!artist) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/artists"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Artists
        </Link>

        {/* Header */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image */}
            {artist.image && (
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <Image
                  src={urlFor(artist.image).width(800).height(800).url()}
                  alt={artist.image.alt || artist.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {artist.name}
                </h1>
                {artist.excerpt && (
                  <p className="text-xl text-white/80">{artist.excerpt}</p>
                )}
              </div>

              {/* Bio */}
              {artist.bio && (
                <div className="prose prose-invert prose-lg max-w-none">
                  <PortableText value={artist.bio} />
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-4 pt-6">
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Visit Website
                  </a>
                )}
                {artist.instagram && (
                  <a
                    href={`https://instagram.com/${artist.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    @{artist.instagram}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Works */}
        {artist.works && artist.works.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artist.works.map((work: any) => (
                <Link
                  key={work._id}
                  href={`/work/${work.slug.current}`}
                  className="group"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-4">
                    <Image
                      src={urlFor(work.mainImage).width(600).height(600).url()}
                      alt={work.mainImage.alt || work.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {work.title}
                  </h3>
                  {work.year && (
                    <p className="text-gray-400 text-sm">{work.year}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
