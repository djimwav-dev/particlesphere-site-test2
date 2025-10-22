import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const artistSubmissionType = defineType({
  name: 'artistSubmission',
  title: 'Artist Submission',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'artistName',
      title: 'Artist Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'realName',
      title: 'Real Name (First & Last)',
      type: 'string',
      description: 'Required if SACEM number is provided',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'City/Country',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'musicalGenres',
      title: 'Musical Genres',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'musicalGenre' }] }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Solo', value: 'solo' },
          { title: 'Group', value: 'group' },
          { title: 'Collective', value: 'collective' },
          { title: 'DJ', value: 'dj' },
          { title: 'Producer', value: 'producer' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'soundLink',
      title: 'Main Music Link',
      type: 'url',
      description: 'Link to SoundCloud, Spotify, YouTube, or other music platform',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
    }),
    defineField({
      name: 'spotify',
      title: 'Spotify',
      type: 'url',
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube',
      type: 'url',
    }),
    defineField({
      name: 'links',
      title: 'Other Links',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Additional social media, website, or portfolio links',
    }),
    defineField({
      name: 'sacemNumber',
      title: 'SACEM Number',
      type: 'string',
      description: 'Optional - If provided, real name becomes mandatory',
    }),
    defineField({
      name: 'pressKitLink',
      title: 'Press Kit Link',
      type: 'url',
      description: 'Link to your press kit or EPK',
    }),
    defineField({
      name: 'pressKitFile',
      title: 'Press Kit File',
      type: 'file',
      description: 'Upload your press kit or EPK as PDF',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'avatar',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'additionalImages',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (rule) => rule.max(3),
      description: 'Up to 3 additional photos',
    }),
    defineField({
      name: 'consent',
      title: 'Consent Given',
      type: 'boolean',
      description: 'Artist has given consent to be contacted',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Submission Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Reviewed', value: 'reviewed' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Private notes for admin use',
    }),
  ],
  preview: {
    select: {
      title: 'artistName',
      subtitle: 'email',
      media: 'avatar',
      status: 'status',
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title,
        subtitle: `${subtitle} • ${status}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Submitted Date, New',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Submitted Date, Old',
      name: 'submittedAtAsc',
      by: [{ field: 'submittedAt', direction: 'asc' }],
    },
    {
      title: 'Artist Name, A-Z',
      name: 'nameAsc',
      by: [{ field: 'artistName', direction: 'asc' }],
    },
  ],
})
