import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const artistType = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Artist Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the name',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'blockContent',
      description: 'Artist biography and description',
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief description for listings and previews',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Artist personal website',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram Handle',
      type: 'string',
      description: 'Instagram username (without @)',
      validation: (rule) => 
        rule.custom((value) => {
          if (value && value.startsWith('@')) {
            return 'Please enter username without @ symbol'
          }
          return true
        }),
    }),
    defineField({
      name: 'musicalGenres',
      title: 'Musical Genres',
      type: 'array',
      of: [
        { 
          type: 'reference', 
          to: [{ type: 'musicalGenre' }],
          options: {
            disableNew: false,
          },
        }
      ],
      description: 'Select musical genres for this artist',
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Artist',
      type: 'boolean',
      description: 'Display this artist prominently on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'excerpt',
    },
  },
  orderings: [
    {
      title: 'Name, A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Name, Z-A',
      name: 'nameDesc',
      by: [{ field: 'name', direction: 'desc' }],
    },
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
