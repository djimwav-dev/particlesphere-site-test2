import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Désactivé pour ISR et revalidation
  perspective: 'published', // Seulement le contenu publié
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})

// Client pour les previews (si besoin plus tard)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts', // Inclut les brouillons
  token: process.env.SANITY_API_READ_TOKEN, // Token pour les previews
})
