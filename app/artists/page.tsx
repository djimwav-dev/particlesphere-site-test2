import { ArtistCard } from "@/components/artist-card"
import exampleArtist from "@/data/artists/exemple.json"

const allArtists = [exampleArtist]

export default function ArtistsPage() {
  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">Artists</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allArtists.map((artist) => (
            <ArtistCard key={artist.slug} name={artist.name} slug={artist.slug} photo={artist.photo} bio={artist.bio} />
          ))}
        </div>
      </div>
    </div>
  )
}
