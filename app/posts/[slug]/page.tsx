import PostPageClient from "./client"

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

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export const dynamic = "error"

export default function PostPage({ params }: { params: { slug: string } }) {
  return <PostPageClient params={params} />
}
