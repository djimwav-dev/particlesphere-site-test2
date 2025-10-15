"use client"

import { useMemo, useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { PostCard } from "@/components/post-card"
import { EventCard } from "@/components/event-card"

import exampleWork from "@/data/work/exemple.json"
import showcaseEvent from "@/data/events/showcase.json"

const allProjects = [exampleWork]

// Mock post data
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

type FilterType = "all" | "work" | "posts" | "events"

export default function DiscoverPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  const featuredProjects = useMemo(() => {
    return allProjects
      .filter((project) => project.featured === true)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [])

  const allUpdates = useMemo(() => {
    return [...examplePosts, { ...showcaseEvent, type: "event" as const }].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [])

  const filteredUpdates = useMemo(() => {
    if (activeFilter === "all") return allUpdates
    return allUpdates.filter((item) => item.type === (activeFilter === "posts" ? "post" : "event"))
  }, [allUpdates, activeFilter])

  const showWork = activeFilter === "all" || activeFilter === "work"
  const showUpdates = activeFilter === "all" || activeFilter === "posts" || activeFilter === "events"

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Découvrir</h1>
          <p className="text-white/60 text-lg">Projets sélectionnés et actualités du studio</p>
        </header>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-2">
          {[
            { value: "all" as const, label: "Tout" },
            { value: "work" as const, label: "Projets" },
            { value: "posts" as const, label: "Articles" },
            { value: "events" as const, label: "Événements" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === filter.value
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Featured Work Section */}
        {showWork && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Projets Sélectionnés</h2>
            {featuredProjects.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-lg">
                <p className="text-white/40">Aucun projet sélectionné pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    title={project.title}
                    slug={project.slug}
                    cover={project.cover}
                    tags={project.tags}
                    date={project.date}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Updates Section */}
        {showUpdates && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Actualités</h2>
            {filteredUpdates.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-lg">
                <p className="text-white/40">Aucune actualité pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpdates.map((item) =>
                  item.type === "post" ? (
                    <PostCard key={item.slug} post={item} />
                  ) : (
                    <EventCard key={item.slug} event={item} />
                  ),
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
