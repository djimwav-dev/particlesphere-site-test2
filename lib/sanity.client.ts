import { createClient } from '@sanity/client'

export const writeClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2025-10-18',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})
