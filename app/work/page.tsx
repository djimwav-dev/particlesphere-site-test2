import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { worksQuery } from '@/sanity/lib/queries'
import { Work } from '@/sanity/lib/types'
import { urlFor } from '@/sanity/lib/image'

export const metadata: Metadata = {
  title: 'Work | Particle Sphere',
  description: 'Explore our curated collection of creative works.',
}

// Revalidation ISR - rafraîchit toutes les 60 secondes
export const revalidate = 60

async function getWorks(): Promise<Work[]> {
  try {
    const works = await client.fetch<Work[]>(worksQuery)
    return works
  } catch (error) {
    console.error('Error fetching works:', error)
    return []
  }
}

export default async function WorkPage() {
  const works = await getWorks()

  // Extraire tous les tags uniques
  const allTags = Array.from(
    new Set(works.flatMap((work) => work.tags || []))
  ).sort()

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Work</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Explore our curated collection of creative works from talented artists.
          </p>
        </div>

        {/* Tags Filter - Client Component à ajouter si besoin */}
        {allTags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-sm bg-white/10 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {works.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No works found. Add some in the{' '}
              <Link href="/studio" className="text-primary hover:underline">
                Sanity Studio
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work) => (
              <Link
                key={work._id}
                href={`/work/${work.slug.current}`}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-4">
                  <Image
                    src={urlFor(work.mainImage).width(800).height(800).url()}
                    alt={work.mainImage.alt || work.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {work.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-2">
                    {work.artist.name}
                    {work.year && ` • ${work.year}`}
                  </p>

                  {work.excerpt && (
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {work.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {work.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded text-xs bg-white/5 text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
