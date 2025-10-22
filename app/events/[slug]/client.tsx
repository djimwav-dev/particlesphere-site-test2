"use client"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import showcaseEvent from "@/data/events/showcase.json"

const events = [showcaseEvent]

export default function EventPageClient({ params }: { params: { slug: string } }) {
  const event = events.find((e) => e.slug === params.slug)

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/updates"
          className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors"
        >
          ← Retour aux updates
        </Link>

        {event.cover && (
          <div className="aspect-video relative rounded-2xl overflow-hidden mb-8">
            <Image src={event.cover || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
          </div>
        )}

        <header className="mb-8">
          <div className="text-sm text-white/40 mb-4">
            📅{" "}
            {new Date(event.date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
          {event.location && <p className="text-lg text-white/60 mb-4">📍 {event.location}</p>}
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Réserver / RSVP
            </a>
          )}
        </header>

        {event.excerpt && (
          <div className="prose prose-invert prose-lg max-w-none">
            <p>{event.excerpt}</p>
          </div>
        )}
      </article>
    </div>
  )
}
