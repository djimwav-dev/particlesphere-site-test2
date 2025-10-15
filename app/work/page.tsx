"use client"

import { useState, useMemo } from "react"
import { ProjectCard } from "@/components/project-card"
import { Search } from "lucide-react"

// Import work data
import exampleWork from "@/data/work/exemple.json"

const allProjects = [exampleWork]

export default function WorkPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allProjects.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [])

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = !selectedTag || project.tags.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [searchQuery, selectedTag])

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Work</h1>

        {/* Search and Filters */}
        <div className="mb-12 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                !selectedTag ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              Tous
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedTag === tag ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
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

        {filteredProjects.length === 0 && <div className="text-center py-16 text-white/60">Aucun projet trouvé</div>}
      </div>
    </div>
  )
}
