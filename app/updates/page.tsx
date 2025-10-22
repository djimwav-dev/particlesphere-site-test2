"use client"

import { UpdatesClient } from "@/components/updates-client"
import showcaseEvent from "@/data/events/showcase.json"

// Mock post data since MDX doesn't work well with static export in browser runtime
const examplePosts = [
  {
    title: "Bienvenue sur notre nouveau site",
    slug: "hello-world",
    date: "2024-01-15",
    cover: "/studio-recording-session.jpg",
    tags: ["Annonce", "Studio"],
    excerpt: "Découvrez notre nouveau site web et toutes les nouveautés du studio.",
    type: "post" as const,
  },
]

export default function UpdatesPage() {
  const allUpdates = [...examplePosts, { ...showcaseEvent, type: "event" as const }].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Updates</h1>
          <p className="text-white/60 text-lg">Actualités, articles et événements du studio</p>
        </header>

        <UpdatesClient updates={allUpdates} />
      </div>
    </div>
  )
}
