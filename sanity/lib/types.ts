import { PortableTextBlock } from 'sanity'

// Image type
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

// Artist type
export interface Artist {
  _id: string
  _type: 'artist'
  _createdAt: string
  _updatedAt: string
  name: string
  slug: {
    current: string
  }
  image?: SanityImage
  bio?: PortableTextBlock[]
  excerpt?: string
  website?: string
  instagram?: string
  featured?: boolean
  publishedAt: string
  works?: Work[] // Works by this artist (populated in queries)
}

// Audio Link type
export interface AudioLink {
  platform?: string
  url: string
}

// Work type
export interface Work {
  _id: string
  _type: 'work'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  mainImage: SanityImage
  artist: Artist
  year: string
  projectType: string
  category: string
  description?: string
  audioLinks?: AudioLink[]
  videoUrl?: string
  selectedWork?: boolean
  showOnHomepage?: boolean
  publishedAt: string
}

// Category type
export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: {
    current: string
  }
  description?: string
}

// Post type (déjà existant)
export interface Post {
  _id: string
  _type: 'post'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  author?: {
    name: string
    image?: SanityImage
  }
  mainImage?: SanityImage
  categories?: Category[]
  publishedAt: string
  body?: PortableTextBlock[]
}
