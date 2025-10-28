"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { worksQuery } from '@/sanity/lib/queries'
import { Work } from '@/sanity/lib/types'
import { urlFor } from '@/sanity/lib/image'
import { Play } from 'lucide-react'
import { useAudio } from '@/components/audio/audio-context'

export default function WorkPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const audio = useAudio()

  useEffect(() => {
    async function fetchWorks() {
      try {
        const data = await client.fetch<Work[]>(worksQuery)
        setWorks(data)
      } catch (error) {
        console.error('Error fetching works:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWorks()
  }, [])

  // Filtrer les œuvres par catégorie
  const filteredWorks = selectedCategory
    ? works.filter((work) => work.category === selectedCategory)
    : works

  // Extraire toutes les catégories uniques
  const allCategories = Array.from(
    new Set(works.map((work) => work.category).filter(Boolean))
  ).sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-16 flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Projets</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Découvrez nos projets audio : mix, mastering, sound design, enregistrement et production.
          </p>
        </div>

        {/* Categories Filter */}
        {allCategories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                  selectedCategory === null 
                    ? 'bg-white text-black shadow-lg' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                Toutes
              </button>
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                    selectedCategory === category 
                      ? 'bg-white text-black shadow-lg' 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredWorks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {selectedCategory 
                ? `Aucun projet dans la catégorie "${selectedCategory}".`
                : 'Aucun projet trouvé. Ajoutez-en dans le '}
              {!selectedCategory && (
                <Link href="/studio" className="text-primary hover:underline">
                  Sanity Studio
                </Link>
              )}
              {!selectedCategory && '.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorks.map((work) => (
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
                  {/* Play overlay if tracks exist */}
                  {work.tracks && work.tracks.length > 0 && (
                    <button
                      className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const playlist = {
                          id: work._id,
                          title: work.title,
                          coverUrl: urlFor(work.mainImage).width(400).height(400).url(),
                          tracks: work.tracks!.map((t, idx) => ({
                            id: t._key || `${work._id}-${idx}`,
                            title: t.title,
                            artist: work.artist?.name,
                            coverUrl: urlFor(work.mainImage).width(400).height(400).url(),
                            url: t.url,
                            duration: t.duration,
                          })),
                        }
                        audio.loadPlaylist(playlist, 0)
                      }}
                      aria-label={`Lire ${work.title}`}
                    >
                      <span className="inline-flex items-center justify-center rounded-full bg-white text-black w-14 h-14 shadow-lg">
                        <Play className="w-6 h-6 ml-0.5" />
                      </span>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {work.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-2">
                    {work.artist.name}
                    {work.year && ` • ${work.year}`}
                    {work.category && ` • ${work.category}`}
                  </p>

                  {work.description && (
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {work.description}
                    </p>
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
