import Link from "next/link"
import Image from "next/image"

interface ArtistCardProps {
  name: string
  slug: string
  photo: string
  bio: string
}

export function ArtistCard({ name, slug, photo, bio }: ArtistCardProps) {
  return (
    <Link
      href={`/artists/${slug}`}
      className="group block rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all hover:scale-[1.02] shadow-sm"
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={photo || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-sm text-white/70 line-clamp-2">{bio}</p>
      </div>
    </Link>
  )
}
