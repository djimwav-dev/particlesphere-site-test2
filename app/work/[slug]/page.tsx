import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import exampleWork from "@/data/work/exemple.json"

const allProjects = [exampleWork]

export const dynamic = "error"

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }))
}

export default function WorkDetailPage({ params }: { params: { slug: string } }) {
  const project = allProjects.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au Work
        </Link>

        <div className="aspect-video relative rounded-2xl overflow-hidden mb-8">
          <Image src={project.cover || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-sm">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-white/60 mb-8">{new Date(project.date).toLocaleDateString()}</p>

        <p className="text-lg text-white/80 mb-8 leading-relaxed">{project.description}</p>

        {project.links && project.links.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-4">Liens</h2>
            {project.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
