export default {
  name: 'artistSubmission',
  title: 'Artist Submissions',
  type: 'document',
  fields: [
    { name: 'artistName', title: 'Artist Name', type: 'string', validation: r => r.required() },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'soundLink', title: 'Main Audio Link', type: 'url' },
    { name: 'links', title: 'Links', type: 'array', of: [{ type: 'url' }] },
    { name: 'avatar', title: 'Avatar / Photo', type: 'image', options: { hotspot: true } },
    { name: 'status', title: 'Status', type: 'string', options: { list: ['new','review','published'] }, initialValue: 'new' },
    { name: 'notes', title: 'Internal Notes', type: 'text' },
    { name: 'userAgent', title: 'User Agent', type: 'string' },
    { name: 'ipHash', title: 'IP Hash', type: 'string' },
    { name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() },
    { name: 'consent', title: 'Consent (GDPR)', type: 'boolean' },
  ],
}
