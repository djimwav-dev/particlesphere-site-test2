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
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'soundLink',
      title: 'Sound/Music Link',
      type: 'url',
      description: 'Link to SoundCloud, Bandcamp, or other music platform',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Additional Links',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Social media, website, or portfolio links',
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
