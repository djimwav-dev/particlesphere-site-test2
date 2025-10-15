import Link from "next/link"
import Image from "next/image"

interface EventCardProps {
  event: {
    title: string
    slug: string
    date: string
    location?: string
    link?: string
    cover?: string
    excerpt?: string
  }
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all hover:scale-[1.02] border border-white/10"
    >
      {event.cover && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={event.cover || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <div className="text-xs text-white/40 mb-2">
          📅{" "}
          {new Date(event.date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
        {event.location && <p className="text-sm text-white/60 mb-1">📍 {event.location}</p>}
        {event.excerpt && <p className="text-sm text-white/60 line-clamp-2 mt-2">{event.excerpt}</p>}
      </div>
    </Link>
  )
}
