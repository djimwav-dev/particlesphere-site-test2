'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Artist } from '@/sanity/lib/types'
import { urlFor } from '@/sanity/lib/image'

interface ArtistCardInteractiveProps {
  artist: Artist
}

export function ArtistCardInteractive({ artist }: ArtistCardInteractiveProps) {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Future: trigger audio player
    console.log(`Play tracks for ${artist.name}`)
  }

  return (
    <Link
      href={`/artists/${artist.slug.current}`}
      className="group relative overflow-hidden rounded-lg transition-all duration-300 pb-4"
    >
      {/* Image */}
      {artist.image && (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
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
      <div className="mt-2 flex items-center justify-between gap-4 px-1">
        <div className="flex items-baseline gap-3 flex-1 min-w-0 flex-wrap">
          <h3 className="text-3xl font-bold group-hover:text-primary transition-colors leading-none">
            {artist.name}
          </h3>
          {artist.musicalGenres && artist.musicalGenres.length > 0 && (
            <div className="flex flex-wrap gap-2 -translate-y-1.5">
              {artist.musicalGenres.slice(0, 2).map((genre) => (
                <span
                  key={genre._id}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium border border-white/20 rounded-md bg-white/5 text-white/80"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 flex items-center justify-center transition-all"
          aria-label={`Play ${artist.name}'s tracks`}
          onClick={handlePlayClick}
        >
          <svg
            className="w-5 h-5 text-white ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </Link>
  )
}
