import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PortableText } from '@portabletext/react'
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
    description: work.excerpt || `${work.title} by ${work.artist.name}`,
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
          Back to Work
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Main Image */}
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
                    <p className="text-sm text-gray-400">Artist</p>
                    <p className="text-lg font-semibold text-primary">
                      {work.artist.name}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Description */}
              {work.description && (
                <div className="prose prose-invert prose-lg max-w-none">
                  <PortableText value={work.description} />
                </div>
              )}

              {/* Gallery */}
              {work.gallery && work.gallery.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Gallery</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {work.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-lg"
                      >
                        <Image
                          src={urlFor(image).width(800).height(800).url()}
                          alt={image.alt || `${work.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Details */}
              <div className="p-6 bg-white/5 rounded-xl space-y-4">
                <h3 className="text-lg font-bold">Details</h3>
                
                {work.year && (
                  <div>
                    <p className="text-sm text-gray-400">Year</p>
                    <p className="font-medium">{work.year}</p>
                  </div>
                )}

                {work.medium && (
                  <div>
                    <p className="text-sm text-gray-400">Medium</p>
                    <p className="font-medium">{work.medium}</p>
                  </div>
                )}

                {work.dimensions && (
                  <div>
                    <p className="text-sm text-gray-400">Dimensions</p>
                    <p className="font-medium">{work.dimensions}</p>
                  </div>
                )}

                {work.available && work.price && (
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="font-medium text-primary">€{work.price.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {work.tags && work.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/10 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {work.categories && work.categories.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {work.categories.map((category) => (
                      <div
                        key={category._id}
                        className="px-3 py-2 bg-white/5 rounded-lg text-sm"
                      >
                        {category.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
