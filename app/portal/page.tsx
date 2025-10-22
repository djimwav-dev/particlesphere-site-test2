'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { GenreSelector } from '@/components/genre-selector'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function PortalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sacemNumber, setSacemNumber] = useState('')
  const [realName, setRealName] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([])
  const [pressKitType, setPressKitType] = useState<'link' | 'file'>('link')

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const previews: string[] = []
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          previews.push(reader.result as string)
          if (previews.length === files.length) {
            setAdditionalImagesPreview(previews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Validation: si SACEM est rempli, le nom réel est obligatoire
    if (sacemNumber && !realName.trim()) {
      setError('Le prénom et nom réel sont obligatoires si vous renseignez un numéro SACEM.')
      setIsSubmitting(false)
      return
    }

    // Validation: au moins un genre sélectionné
    if (selectedGenres.length === 0) {
      setError('Veuillez sélectionner au moins un genre musical.')
      setIsSubmitting(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    
    // Ajouter les genres au FormData
    formData.append('genres', JSON.stringify(selectedGenres))

    try {
      const response = await fetch('/api/artist-intake', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Submission failed')
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-green-950/50 border border-green-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            Merci pour votre soumission !
          </h2>
          <p className="text-green-200">
            Nous avons bien reçu votre profil et nous vous contacterons bientôt.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Portail Artiste</h1>
        <p className="text-lg text-muted-foreground">
          Créez votre profil artiste et rejoignez Wide Angle Vision.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Section 1: Informations personnelles */}
        <div className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-2xl font-semibold">Informations personnelles</h2>
            <p className="text-sm text-foreground/70 mt-1">Vos coordonnées et identité</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="artistName">Nom d'artiste *</Label>
                <Input
                  id="artistName"
                  name="artistName"
                  required
                  placeholder="Votre nom de scène"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="realName">
                  Prénom et nom réel {sacemNumber && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="realName"
                  name="realName"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder="John Doe"
                  required={!!sacemNumber}
                />
                {sacemNumber && (
                  <p className="text-xs text-foreground/60">
                    Obligatoire car vous avez renseigné un numéro SACEM
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ville / Pays *</Label>
              <Input
                id="location"
                name="location"
                required
                placeholder="Paris, France"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Profil artistique */}
        <div className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-2xl font-semibold">Profil artistique</h2>
            <p className="text-sm text-foreground/70 mt-1">Parlez-nous de votre univers</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Biographie *</Label>
              <Textarea
                id="bio"
                name="bio"
                required
                rows={5}
                placeholder="Parlez-nous de vous, votre parcours, vos influences..."
              />
            </div>

            <div className="space-y-2">
              <Label>Genre(s) musical(aux) *</Label>
              <GenreSelector 
                value={selectedGenres} 
                onChange={setSelectedGenres}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType">Type de projet *</Label>
              <Select name="projectType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="group">Groupe</SelectItem>
                  <SelectItem value="collective">Collectif</SelectItem>
                  <SelectItem value="dj">DJ</SelectItem>
                  <SelectItem value="producer">Producteur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 3: Contenu & Réseaux */}
        <div className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-2xl font-semibold">Contenu & Réseaux sociaux</h2>
            <p className="text-sm text-foreground/70 mt-1">Partagez vos liens et votre musique</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="soundLink">Lien principal vers votre musique *</Label>
              <Input
                id="soundLink"
                name="soundLink"
                type="url"
                required
                placeholder="https://soundcloud.com/..."
              />
              <p className="text-xs text-foreground/60">
                SoundCloud, Spotify, YouTube, Bandcamp, etc.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  type="url"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spotify">Spotify</Label>
                <Input
                  id="spotify"
                  name="spotify"
                  type="url"
                  placeholder="https://open.spotify.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  name="youtube"
                  type="url"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherLinks">Autres liens</Label>
              <Input
                id="otherLinks"
                name="otherLinks"
                type="url"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Section 4: Informations professionnelles */}
        <div className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-2xl font-semibold">Informations professionnelles</h2>
            <p className="text-sm text-foreground/70 mt-1">Optionnel</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sacemNumber">Numéro SACEM</Label>
              <Input
                id="sacemNumber"
                name="sacemNumber"
                value={sacemNumber}
                onChange={(e) => setSacemNumber(e.target.value)}
                placeholder="000000000"
              />
              {sacemNumber && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Le prénom et nom réel deviennent obligatoires
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label>Dossier de presse / EPK</Label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setPressKitType('link')}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    pressKitType === 'link'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Lien
                </button>
                <button
                  type="button"
                  onClick={() => setPressKitType('file')}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    pressKitType === 'file'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Fichier PDF
                </button>
              </div>

              {pressKitType === 'link' ? (
                <Input
                  id="pressKitLink"
                  name="pressKitLink"
                  type="url"
                  placeholder="https://..."
                />
              ) : (
                <Input
                  id="pressKitFile"
                  name="pressKitFile"
                  type="file"
                  accept=".pdf"
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>

        {/* Section 5: Médias */}
        <div className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-2xl font-semibold">Photos & visuels</h2>
            <p className="text-sm text-foreground/70 mt-1">Ajoutez votre photo de profil et des visuels</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar">Photo de profil *</Label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                required
                accept="image/*"
                onChange={handleAvatarChange}
                className="cursor-pointer"
              />
              {avatarPreview && (
                <div className="mt-2">
                  <img 
                    src={avatarPreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border border-border"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalImages">Photos supplémentaires (max 3)</Label>
              <Input
                id="additionalImages"
                name="additionalImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
                className="cursor-pointer"
              />
              {additionalImagesPreview.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {additionalImagesPreview.map((preview, idx) => (
                    <img 
                      key={idx}
                      src={preview} 
                      alt={`Preview ${idx + 1}`} 
                      className="w-24 h-24 object-cover rounded-lg border border-border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 6: Validation */}
        <div className="space-y-6">
          <div className="flex items-start space-x-2 p-4 rounded-lg border border-border">
            <Checkbox id="consent" name="consent" required className="mt-1" />
            <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
              J'accepte d'être contacté par Wide Angle Vision et je confirme que les informations 
              fournies sont exactes. *
            </Label>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-lg"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre mon profil'}
        </Button>
      </form>
    </div>
  )
}
