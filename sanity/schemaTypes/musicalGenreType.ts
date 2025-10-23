import { defineField, defineType } from 'sanity'

export const musicalGenreType = defineType({
  name: 'musicalGenre',
  title: 'Genre Musical',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du genre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
