import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { artistsQuery } from '@/sanity/lib/queries'
import { Artist } from '@/sanity/lib/types'
import { urlFor } from '@/sanity/lib/image'

export const metadata: Metadata = {
  title: 'Artists | Particle Sphere',
  description: 'Discover our talented artists and their creative works.',
}

// Revalidation ISR - rafraîchit toutes les 60 secondes
export const revalidate = 60

async function getArtists(): Promise<Artist[]> {
  try {
    const artists = await client.fetch<Artist[]>(artistsQuery)
    return artists
  } catch (error) {
    console.error('Error fetching artists:', error)
    return []
  }
}

export default async function ArtistsPage() {
  const artists = await getArtists()

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Artists</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Explore the creative minds behind our curated collection of works.
          </p>
        </div>

        {artists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No artists found. Add some in the{' '}
              <Link href="/studio" className="text-primary hover:underline">
                Sanity Studio
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <Link
                key={artist._id}
                href={`/artists/${artist.slug.current}`}
                className="group relative overflow-hidden rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-300"
              >
                {/* Image */}
                {artist.image && (
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={urlFor(artist.image).width(800).height(800).url()}
                      alt={artist.image.alt || artist.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {artist.name}
                  </h3>
                  {artist.excerpt && (
                    <p className="text-gray-400 line-clamp-2">{artist.excerpt}</p>
                  )}
                  
                  {/* Social Links */}
                  <div className="flex gap-4 mt-4 text-sm text-gray-500">
                    {artist.instagram && (
                      <span className="hover:text-primary transition-colors">
                        @{artist.instagram}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
