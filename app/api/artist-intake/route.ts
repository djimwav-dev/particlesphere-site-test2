import { NextResponse } from 'next/server'
import { writeClient } from '../../../lib/sanity.client'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  const formData = await req.formData()
  const artistName = formData.get('artistName')
  const email = formData.get('email')
  const bio = formData.get('bio')
  const soundLink = formData.get('soundLink')
  const links = formData.getAll('links')
  const avatar = formData.get('avatar')
  const consent = formData.get('consent')

  // ...validation logic...

  // Upload image to Sanity
  const asset = await writeClient.assets.upload('image', avatar)

  // Create artistSubmission document
  const doc = {
    _type: 'artistSubmission',
    artistName,
    email,
    bio,
    soundLink,
    links,
    avatar: {
      _type: 'image',
      asset: {
        _ref: asset._id,
        _type: 'reference',
      },
    },
    consent,
  }
  await writeClient.create(doc)

  // Send email notification
  await resend.sendEmail({
    from: 'no-reply@wideanglevision.fr',
    to: 'contact@wideanglevision.fr',
    subject: `Nouvelle soumission artiste — ${artistName}`,
    html: `<p><b>Nom:</b> ${artistName}</p>
           <p><b>Email:</b> ${email}</p>
           <p><b>Lien:</b> <a href="${soundLink}">${soundLink}</a></p>
           <p>${bio}</p>
           <hr />
           <p style="font-size:12px;color:#999">
           —<br/>Wide Angle Vision<br/>
           <a href="https://wideanglevision.fr" style="color:#999">wideanglevision.fr</a><br/>
           contact@wideanglevision.fr
           </p>`,
  })

  return NextResponse.json({ ok: true })
}
