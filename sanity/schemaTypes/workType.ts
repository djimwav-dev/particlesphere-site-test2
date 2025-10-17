import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const workType = defineType({
  name: 'work',
  title: 'Projet Audio',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL du projet',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Art',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          description: 'Important pour le SEO et l\'accessibilité',
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artist',
      title: 'Artiste',
      type: 'reference',
      to: [{ type: 'artist' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Année',
      type: 'string',
      description: 'Année de sortie',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Type de projet',
      type: 'string',
      options: {
        list: [
          { title: 'EP', value: 'ep' },
          { title: 'Album', value: 'album' },
          { title: 'Single', value: 'single' },
          { title: 'Autre', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Mix', value: 'mix' },
          { title: 'Mastering', value: 'mastering' },
          { title: 'Sound Design', value: 'sound-design' },
          { title: 'Enregistrement', value: 'recording' },
          { title: 'Production', value: 'production' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Courte description du projet',
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: 'audioLinks',
      title: 'Liens Audio',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Plateforme',
              type: 'string',
              options: {
                list: [
                  { title: 'Spotify', value: 'spotify' },
                  { title: 'Apple Music', value: 'apple-music' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'SoundCloud', value: 'soundcloud' },
                  { title: 'Bandcamp', value: 'bandcamp' },
                  { title: 'Deezer', value: 'deezer' },
                  { title: 'Autre', value: 'other' },
                ],
              },
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
            },
            prepare({ platform, url }) {
              return {
                title: platform || 'Lien',
                subtitle: url,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Vidéo (YouTube/Vimeo)',
      type: 'url',
      description: 'Lien YouTube ou Vimeo pour intégration sur la page',
    }),
    defineField({
      name: 'selectedWork',
      title: 'Selected Work',
      type: 'boolean',
      description: 'Afficher dans la section "Selected Work"',
      initialValue: false,
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Afficher sur la homepage',
      type: 'boolean',
      description: 'Afficher ce projet sur la page d\'accueil',
      initialValue: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      artist: 'artist.name',
      media: 'mainImage',
      year: 'year',
      category: 'category',
    },
    prepare(selection) {
      const { title, artist, year, category } = selection
      return {
        ...selection,
        subtitle: `${artist} • ${category} • ${year}`,
      }
    },
  },
  orderings: [
    {
      title: 'Titre, A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Date de publication, Récent',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Année, Récent',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
})
