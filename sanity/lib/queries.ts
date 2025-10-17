// ============================================
// GROQ QUERIES FOR ARTISTS
// ============================================

// Récupérer tous les artistes
export const artistsQuery = `
  *[_type == "artist"] | order(publishedAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    name,
    slug,
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    excerpt,
    instagram,
    website,
    featured,
    publishedAt
  }
`

// Récupérer les artistes featured
export const featuredArtistsQuery = `
  *[_type == "artist" && featured == true] | order(publishedAt desc) [0...6] {
    _id,
    name,
    slug,
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    excerpt,
    featured,
    publishedAt
  }
`

// Récupérer un artiste par slug
export const artistBySlugQuery = `
  *[_type == "artist" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    name,
    slug,
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    bio,
    excerpt,
    instagram,
    website,
    featured,
    publishedAt,
    "works": *[_type == "work" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage {
        asset->{
          _id,
          url
        },
        alt
      },
      year,
      excerpt,
      featured,
      publishedAt
    }
  }
`

// Récupérer tous les slugs d'artistes (pour generateStaticParams)
export const artistSlugsQuery = `
  *[_type == "artist" && defined(slug.current)] {
    "slug": slug.current
  }
`

// ============================================
// GROQ QUERIES FOR WORKS
// ============================================

// Récupérer tous les works
export const worksQuery = `
  *[_type == "work"] | order(publishedAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    artist->{
      _id,
      name,
      slug
    },
    excerpt,
    year,
    medium,
    tags,
    featured,
    available,
    price,
    publishedAt
  }
`

// Récupérer les works featured
export const featuredWorksQuery = `
  *[_type == "work" && featured == true] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    artist->{
      _id,
      name,
      slug
    },
    excerpt,
    year,
    featured,
    publishedAt
  }
`

// Récupérer un work par slug
export const workBySlugQuery = `
  *[_type == "work" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    gallery[] {
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    artist->{
      _id,
      name,
      slug,
      image {
        asset->{
          _id,
          url
        },
        alt
      }
    },
    excerpt,
    description,
    year,
    medium,
    dimensions,
    tags,
    categories[]->{
      _id,
      title,
      slug
    },
    featured,
    available,
    price,
    publishedAt
  }
`

// Récupérer tous les slugs de works (pour generateStaticParams)
export const workSlugsQuery = `
  *[_type == "work" && defined(slug.current)] {
    "slug": slug.current
  }
`

// Récupérer des works par catégorie
export const worksByCategoryQuery = `
  *[_type == "work" && $categoryId in categories[]._ref] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    artist->{
      _id,
      name,
      slug
    },
    excerpt,
    year,
    publishedAt
  }
`

// Récupérer des works par tag
export const worksByTagQuery = `
  *[_type == "work" && $tag in tags] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    artist->{
      _id,
      name,
      slug
    },
    excerpt,
    year,
    tags,
    publishedAt
  }
`
