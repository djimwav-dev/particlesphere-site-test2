import Link from "next/link"
import Image from "next/image"

interface ProjectCardProps {
  title: string
  slug: string
  cover: string
  tags: string[]
  date: string
}

export function ProjectCard({ title, slug, cover, tags, date }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${slug}`}
      className="group block rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all hover:scale-[1.02] shadow-sm"
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={cover || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/10">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-white/60">{new Date(date).toLocaleDateString()}</p>
      </div>
    </Link>
  )
}
