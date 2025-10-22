"use client"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

const posts = [
  {
    slug: "hello-world",
    title: "Bienvenue sur notre nouveau site",
    date: "2024-01-15",
    cover: "/studio-recording-session.jpg",
    tags: ["Annonce", "Studio"],
    content: `
      <p>Nous sommes ravis de vous présenter notre nouveau site web !</p>
      <p>Ce site a été conçu pour vous offrir une meilleure expérience et vous permettre de découvrir tous nos services de production musicale.</p>
      <h2>Nos services</h2>
      <ul>
        <li>Enregistrement studio</li>
        <li>Mixage et mastering</li>
        <li>Production vocale</li>
        <li>Sound design</li>
      </ul>
      <p>N'hésitez pas à nous contacter pour discuter de votre projet !</p>
    `,
  },
]

export default function PostPageClient({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug)

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
