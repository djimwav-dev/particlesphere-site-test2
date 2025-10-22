"use client"

import { useMemo } from "react"
import { ProjectCard } from "@/components/project-card"

import exampleWork from "@/data/work/exemple.json"

const allProjects = [exampleWork]

export default function SelectedWorkPage() {
  const featuredProjects = useMemo(() => {
    return allProjects
      .filter((project) => project.featured === true)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [])

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Selected Work</h1>
          <p className="text-white/60 text-lg">Nos projets phares et collaborations marquantes</p>
        </header>

        {featuredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">Aucun projet sélectionné pour le moment.</p>
            <p className="text-white/30 text-sm mt-2">Les projets marqués comme "featured" apparaîtront ici.</p>
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
      </div>
    </div>
  )
}
