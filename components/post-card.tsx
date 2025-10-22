import Link from "next/link"
import Image from "next/image"

interface PostCardProps {
  post: {
    title: string
    slug: string
    date: string
    cover?: string
    tags?: string[]
    excerpt?: string
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all hover:scale-[1.02]"
    >
      {post.cover && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={post.cover || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <div className="text-xs text-white/40 mb-2">
          {new Date(post.date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
        {post.excerpt && <p className="text-sm text-white/60 line-clamp-2">{post.excerpt}</p>}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/10">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
