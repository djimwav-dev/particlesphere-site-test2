'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function PortalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/artist-intake', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setIsSuccess(true)
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Merci pour votre soumission !
          </h2>
          <p className="text-green-700">
            Nous avons bien reçu votre candidature et nous vous contacterons bientôt.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Portail Artiste</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Soumettez votre profil pour être considéré pour notre plateforme.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="artistName">Nom d'artiste *</Label>
          <Input
            id="artistName"
            name="artistName"
            required
            placeholder="Votre nom d'artiste"
          />
        </div>

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
          <Label htmlFor="bio">Biographie *</Label>
          <Textarea
            id="bio"
            name="bio"
            required
            rows={5}
            placeholder="Parlez-nous de vous et de votre parcours artistique..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="soundLink">Lien vers votre musique *</Label>
          <Input
            id="soundLink"
            name="soundLink"
            type="url"
            required
            placeholder="https://soundcloud.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="links">Liens supplémentaires (optionnel)</Label>
          <Input
            id="links"
            name="links"
            type="url"
            placeholder="https://instagram.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar">Photo de profil *</Label>
          <Input
            id="avatar"
            name="avatar"
            type="file"
            required
            accept="image/*"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="consent" name="consent" required />
          <Label htmlFor="consent" className="text-sm">
            J'accepte d'être contacté par Wide Angle Vision *
          </Label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
        </Button>
      </form>
    </div>
  )
}
