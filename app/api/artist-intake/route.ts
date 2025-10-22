import { NextResponse } from 'next/server'
import { writeClient } from '../../../lib/sanity.client'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  const formData = await req.formData()
  
  // Récupération de tous les champs
  const artistName = formData.get('artistName') as string | null
  const realName = formData.get('realName') as string | null
  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null
  const location = formData.get('location') as string | null
  const bio = formData.get('bio') as string | null
  const genresStr = formData.get('genres') as string | null
  const projectType = formData.get('projectType') as string | null
  const soundLink = formData.get('soundLink') as string | null
  const instagram = formData.get('instagram') as string | null
  const spotify = formData.get('spotify') as string | null
  const youtube = formData.get('youtube') as string | null
  const otherLinks = formData.get('otherLinks') as string | null
  const sacemNumber = formData.get('sacemNumber') as string | null
  const pressKitLink = formData.get('pressKitLink') as string | null
  const pressKitFileEntry = formData.get('pressKitFile')
  const avatarEntry = formData.get('avatar')
  const consentRaw = formData.get('consent')

  // Validation des champs obligatoires
  if (!artistName || !email || !bio || !soundLink || !location || !projectType) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  // Validation conditionnelle SACEM
  if (sacemNumber && !realName) {
    return NextResponse.json({ 
      error: 'Le prénom et nom réel sont obligatoires si vous renseignez un numéro SACEM' 
    }, { status: 400 })
  }

  if (!(avatarEntry instanceof Blob)) {
    return NextResponse.json({ error: 'Photo de profil manquante ou invalide' }, { status: 400 })
  }

  const consentStr = typeof consentRaw === 'string' ? consentRaw : ''
  const consent = ['on', 'true', '1', 'yes'].includes(consentStr.toLowerCase())

  // Parser les genres
  let genres: string[] = []
  try {
    genres = genresStr ? JSON.parse(genresStr) : []
  } catch {
    return NextResponse.json({ error: 'Format des genres invalide' }, { status: 400 })
  }

  if (genres.length === 0) {
    return NextResponse.json({ error: 'Au moins un genre musical est requis' }, { status: 400 })
  }

  // Créer ou récupérer les références de genres dans Sanity
  const genreRefs = await Promise.all(
    genres.map(async (genreName) => {
      // Chercher si le genre existe déjà
      const existingGenre = await writeClient.fetch(
        `*[_type == "musicalGenre" && name == $name][0]`,
        { name: genreName }
      )

      if (existingGenre) {
        return {
          _type: 'reference',
          _ref: existingGenre._id,
        }
      }

      // Créer le nouveau genre
      const slug = genreName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const newGenre = await writeClient.create({
        _type: 'musicalGenre',
        name: genreName,
        slug: {
          _type: 'slug',
          current: slug,
        },
      })

      return {
        _type: 'reference',
        _ref: newGenre._id,
      }
    })
  )

  // Upload de l'avatar principal
  const avatarAsset = await writeClient.assets.upload('image', avatarEntry)

  // Upload du dossier de presse PDF si fourni
  let pressKitFileAsset = null
  if (pressKitFileEntry instanceof Blob && pressKitFileEntry.size > 0) {
    pressKitFileAsset = await writeClient.assets.upload('file', pressKitFileEntry)
  }

  // Upload des images supplémentaires
  const additionalImagesEntries = formData.getAll('additionalImages')
  const additionalImagesAssets = []
  
  for (const imgEntry of additionalImagesEntries) {
    if (imgEntry instanceof Blob && imgEntry.size > 0) {
      const asset = await writeClient.assets.upload('image', imgEntry)
      additionalImagesAssets.push({
        _type: 'image',
        asset: {
          _ref: asset._id,
          _type: 'reference',
        },
      })
    }
  }

  // Construire le tableau des liens supplémentaires
  const additionalLinks = [instagram, spotify, youtube, otherLinks]
    .filter((link): link is string => !!link && link.trim() !== '')

  // Créer le document de soumission
  const doc = {
    _type: 'artistSubmission',
    artistName,
    realName: realName || undefined,
    email,
    phone: phone || undefined,
    location,
    bio,
    musicalGenres: genreRefs,
    projectType,
    soundLink,
    instagram: instagram || undefined,
    spotify: spotify || undefined,
    youtube: youtube || undefined,
    links: additionalLinks.length > 0 ? additionalLinks : undefined,
    sacemNumber: sacemNumber || undefined,
    pressKitLink: pressKitLink || undefined,
    pressKitFile: pressKitFileAsset ? {
      _type: 'file',
      asset: {
        _ref: pressKitFileAsset._id,
        _type: 'reference',
      },
    } : undefined,
    avatar: {
      _type: 'image',
      asset: {
        _ref: avatarAsset._id,
        _type: 'reference',
      },
    },
    additionalImages: additionalImagesAssets.length > 0 ? additionalImagesAssets : undefined,
    consent,
  }

  await writeClient.create(doc)

  // Envoyer l'email de notification
  const genresText = genres.join(', ')
  
  await resend.emails.send({
    from: 'no-reply@wideanglevision.fr',
    to: ['contact@wideanglevision.fr', 'djim.wav@gmail.com'],
    subject: `Nouvelle soumission artiste — ${artistName}`,
    html: `
      <h2>Nouvelle soumission artiste</h2>
      <p><b>Nom d'artiste:</b> ${artistName}</p>
      ${realName ? `<p><b>Nom réel:</b> ${realName}</p>` : ''}
      <p><b>Email:</b> ${email}</p>
      ${phone ? `<p><b>Téléphone:</b> ${phone}</p>` : ''}
      <p><b>Localisation:</b> ${location}</p>
      <p><b>Genres:</b> ${genresText}</p>
      <p><b>Type de projet:</b> ${projectType}</p>
      <p><b>Lien principal:</b> <a href="${soundLink}">${soundLink}</a></p>
      ${instagram ? `<p><b>Instagram:</b> <a href="${instagram}">${instagram}</a></p>` : ''}
      ${spotify ? `<p><b>Spotify:</b> <a href="${spotify}">${spotify}</a></p>` : ''}
      ${youtube ? `<p><b>YouTube:</b> <a href="${youtube}">${youtube}</a></p>` : ''}
      ${sacemNumber ? `<p><b>Numéro SACEM:</b> ${sacemNumber}</p>` : ''}
      ${pressKitLink ? `<p><b>Press Kit:</b> <a href="${pressKitLink}">${pressKitLink}</a></p>` : ''}
      ${pressKitFileAsset ? `<p><b>Press Kit PDF:</b> Fichier joint</p>` : ''}
      <h3>Biographie</h3>
      <p>${bio.replace(/\n/g, '<br/>')}</p>
      <hr />
      <p style="font-size:12px;color:#999">
        —<br/>Wide Angle Vision<br/>
        <a href="https://wideanglevision.fr" style="color:#999">wideanglevision.fr</a><br/>
        contact@wideanglevision.fr
      </p>
    `,
  })

  return NextResponse.json({ ok: true })
}
