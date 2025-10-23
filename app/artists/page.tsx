import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { artistsQuery } from '@/sanity/lib/queries'
import { Artist } from '@/sanity/lib/types'
import { ArtistCardInteractive } from '@/components/artist-card-interactive'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black py-16">
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
              <ArtistCardInteractive key={artist._id} artist={artist} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
