import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { workBySlugQuery, workSlugsQuery } from '@/sanity/lib/queries'
import { Work } from '@/sanity/lib/types'
import { urlFor } from '@/sanity/lib/image'

// Revalidation ISR
export const revalidate = 60

// Génération des pages statiques pour tous les works
export async function generateStaticParams() {
  const works = await client.fetch<{ slug: string }[]>(workSlugsQuery)
  return works.map((work) => ({
    slug: work.slug,
  }))
}

// Génération des métadonnées dynamiques
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const work = await client.fetch<Work>(workBySlugQuery, { slug })

  if (!work) {
    return {
      title: 'Work Not Found',
    }
  }

  return {
    title: `${work.title} | Particle Sphere`,
    description: work.description || `${work.title} by ${work.artist.name}`,
    openGraph: work.mainImage
      ? {
          images: [urlFor(work.mainImage).width(1200).height(630).url()],
        }
      : undefined,
  }
}

async function getWork(slug: string) {
  const work = await client.fetch<Work>(workBySlugQuery, { slug })
  return work
}

// Helper pour extraire l'ID YouTube/Vimeo
function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null
  
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  return null
}

// Helper pour obtenir l'icône de la plateforme
function getPlatformIcon(platform: string) {
  const icons: Record<string, string> = {
    'spotify': '🎵',
    'apple-music': '🍎',
    'youtube': '📺',
    'soundcloud': '☁️',
    'bandcamp': '🎸',
    'deezer': '💿',
  }
  return icons[platform] || '🔗'
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const work = await getWork(slug)

  if (!work) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux projets
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Cover Art */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-8">
            <Image
              src={urlFor(work.mainImage).width(1920).height(1080).url()}
              alt={work.mainImage.alt || work.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {work.title}
                </h1>
                
                {/* Artist */}
                <Link
                  href={`/artists/${work.artist.slug.current}`}
                  className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity mb-6"
                >
                  {work.artist.image && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={urlFor(work.artist.image).width(96).height(96).url()}
                        alt={work.artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Artiste</p>
                    <p className="text-lg font-semibold text-primary">
                      {work.artist.name}
                    </p>
                  </div>
                </Link>

                {/* Metadata Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {work.year && (
                    <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                      {work.year}
                    </span>
                  )}
                  {work.projectType && (
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm capitalize">
                      {work.projectType}
                    </span>
                  )}
                  {work.category && (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-sm capitalize">
                      {work.category.replace('-', ' ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {work.description && (
                <div className="text-gray-300 text-lg leading-relaxed">
                  {work.description}
                </div>
              )}

              {/* Audio Links */}
              {work.audioLinks && work.audioLinks.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Écouter</h2>
                  <div className="flex flex-wrap gap-3">
                    {work.audioLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <span className="text-xl">{getPlatformIcon(link.platform || '')}</span>
                        <span className="font-medium capitalize">
                          {link.platform || 'Lien'}
                        </span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Embed */}
              {work.videoUrl && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Vidéo</h2>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      src={getVideoEmbedUrl(work.videoUrl) || ''}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Details */}
              <div className="p-6 bg-white/5 rounded-xl space-y-4">
                <h3 className="text-lg font-bold">Détails</h3>
                
                {work.year && (
                  <div>
                    <p className="text-sm text-gray-400">Année</p>
                    <p className="font-medium">{work.year}</p>
                  </div>
                )}

                {work.projectType && (
                  <div>
                    <p className="text-sm text-gray-400">Type</p>
                    <p className="font-medium capitalize">{work.projectType}</p>
                  </div>
                )}

                {work.category && (
                  <div>
                    <p className="text-sm text-gray-400">Catégorie</p>
                    <p className="font-medium capitalize">
                      {work.category.replace('-', ' ')}
                    </p>
                  </div>
                )}
              </div>

              {work.artist && (
                <div className="p-6 bg-white/5 rounded-xl">
                  <h3 className="text-lg font-bold mb-4">Artiste</h3>
                  <Link
                    href={`/artists/${work.artist.slug.current}`}
                    className="group"
                  >
                    {work.artist.image && (
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-3 group-hover:opacity-80 transition-opacity">
                        <Image
                          src={urlFor(work.artist.image).width(400).height(400).url()}
                          alt={work.artist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p className="font-semibold text-primary group-hover:underline">
                      {work.artist.name}
                    </p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
