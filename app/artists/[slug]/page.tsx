import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import exampleArtist from "@/data/artists/exemple.json"

const allArtists = [exampleArtist]

export const dynamic = "error"

export async function generateStaticParams() {
  return allArtists.map((artist) => ({
    slug: artist.slug,
  }))
}

export default function ArtistDetailPage({ params }: { params: { slug: string } }) {
  const artist = allArtists.find((a) => a.slug === params.slug)

  if (!artist) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          href="/artists"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux Artists
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="aspect-square relative rounded-2xl overflow-hidden">
            <Image src={artist.photo || "/placeholder.svg"} alt={artist.name} fill className="object-cover" />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{artist.name}</h1>
            <p className="text-lg text-white/80 leading-relaxed">{artist.bio}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
