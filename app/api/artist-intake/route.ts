import { NextResponse } from 'next/server'
import { writeClient } from '../../../lib/sanity.client'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  const formData = await req.formData()
  const artistName = formData.get('artistName') as string | null
  const email = formData.get('email') as string | null
  const bio = formData.get('bio') as string | null
  const soundLink = formData.get('soundLink') as string | null
  const links = formData
    .getAll('links')
    .filter((v): v is string => typeof v === 'string')
  const avatarEntry = formData.get('avatar')
  const consentRaw = formData.get('consent')

  // Validation minimale
  if (!artistName || !email || !bio || !soundLink) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  if (!(avatarEntry instanceof Blob)) {
    return NextResponse.json({ error: 'Avatar manquant ou invalide' }, { status: 400 })
  }

  const consentStr = typeof consentRaw === 'string' ? consentRaw : ''
  const consent = ['on', 'true', '1', 'yes'].includes(consentStr.toLowerCase())

  // ...validation logic...

  // Upload image to Sanity
  const asset = await writeClient.assets.upload('image', avatarEntry)

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
  await resend.emails.send({
    from: 'no-reply@wideanglevision.fr',
    to: ['contact@wideanglevision.fr', 'djim.wav@gmail.com'],
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
