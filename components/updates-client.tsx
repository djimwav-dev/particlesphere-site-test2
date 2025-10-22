"use client"

import { useState, useMemo } from "react"
import { PostCard } from "./post-card"
import { EventCard } from "./event-card"

interface Post {
  title: string
  slug: string
  date: string
  cover?: string
  tags?: string[]
  excerpt?: string
  type: "post"
}

interface Event {
  title: string
  slug: string
  date: string
  location?: string
  link?: string
  cover?: string
  excerpt?: string
  type: "event"
}

type Update = Post | Event

interface UpdatesClientProps {
  updates: Update[]
}

export function UpdatesClient({ updates }: UpdatesClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "events">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUpdates = useMemo(() => {
    let filtered = updates

    // Filter by tab
    if (activeTab === "articles") {
      filtered = filtered.filter((u) => u.type === "post")
    } else if (activeTab === "events") {
      filtered = filtered.filter((u) => u.type === "event")
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((u) => u.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return filtered
  }, [updates, activeTab, searchQuery])

  return (
    <div>
      {/* Tabs and Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "all" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("articles")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "articles" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "events" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Events
          </button>
        </div>

        <input
          type="search"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>

      {/* Results */}
      {filteredUpdates.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">Aucun résultat trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUpdates.map((update) =>
            update.type === "post" ? (
              <PostCard key={update.slug} post={update} />
            ) : (
              <EventCard key={update.slug} event={update} />
            ),
          )}
        </div>
      )}
    </div>
  )
}
