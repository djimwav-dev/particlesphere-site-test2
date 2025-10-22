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
    year,
    projectType,
    category,
    description,
    selectedWork,
    showOnHomepage,
    publishedAt
  }
`

// Récupérer les works pour "Selected Work"
export const selectedWorksQuery = `
  *[_type == "work" && selectedWork == true] | order(publishedAt desc) {
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
    year,
    projectType,
    category,
    selectedWork,
    publishedAt
  }
`

// Récupérer les works pour la homepage
export const homepageWorksQuery = `
  *[_type == "work" && showOnHomepage == true] | order(publishedAt desc) [0...6] {
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
    year,
    category,
    showOnHomepage,
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
    year,
    projectType,
    category,
    description,
    audioLinks[] {
      platform,
      url
    },
    videoUrl,
    selectedWork,
    showOnHomepage,
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
  *[_type == "work" && category == $category] | order(publishedAt desc) {
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
    year,
    category,
    publishedAt
  }
`

