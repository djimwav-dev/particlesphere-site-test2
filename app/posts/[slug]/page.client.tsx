"use client"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

interface Post {
  slug: string
  title: string
  date: string
  cover: string | null
  tags: string[] | null
  content: string
}

interface PostPageClientProps {
  post: Post | undefined
}

export default function PostPageClient({ post }: PostPageClientProps) {
  if (!post) {
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

        {post.cover && (
          <div className="aspect-video relative rounded-2xl overflow-hidden mb-8">
            <Image src={post.cover || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <header className="mb-8">
          <div className="text-sm text-white/40 mb-4">
            {new Date(post.date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/10">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  )
}
