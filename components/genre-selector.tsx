'use client'

import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Trash2 } from 'lucide-react'

interface Genre {
  _id: string
  name: string
}

interface GenreSelectorProps {
  value: string[]
  onChange: (genres: string[]) => void
}

export function GenreSelector({ value, onChange }: GenreSelectorProps) {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>(value)
  const [newGenre, setNewGenre] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [portalCode, setPortalCode] = useState<string | null>(null)

  // Charger les genres existants depuis Sanity
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/genres')
        if (response.ok) {
          const data = await response.json()
          setGenres(data)
        }
      } catch (error) {
        console.error('Error fetching genres:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchGenres()
  }, [])

  // Récupérer le code portail depuis l'URL (si présent), pour autoriser les actions admin
  useEffect(() => {
    try {
      const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      const code = search?.get('code')
      if (code) setPortalCode(code)
    } catch (e) {
      // ignore
    }
  }, [])

  // Mettre à jour le parent quand la sélection change
  useEffect(() => {
    onChange(selectedGenres)
  }, [selectedGenres, onChange])

  const toggleGenre = (genreName: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreName)
        ? prev.filter((g) => g !== genreName)
        : [...prev, genreName]
    )
  }

  const addNewGenre = () => {
    if (newGenre.trim() && !selectedGenres.includes(newGenre.trim())) {
      const trimmedGenre = newGenre.trim()
      setSelectedGenres((prev) => [...prev, trimmedGenre])
      
      // Ajouter à la liste locale pour affichage immédiat
      if (!genres.find(g => g.name.toLowerCase() === trimmedGenre.toLowerCase())) {
        setGenres((prev) => [...prev, { _id: `temp-${Date.now()}`, name: trimmedGenre }])
      }
      
      setNewGenre('')
    }
  }

  const removeGenre = (genreName: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genreName))
  }

  const deleteGenreFromList = async (genreId: string, genreName: string) => {
    if (!portalCode) {
      alert('Suppression non autorisée (code portail manquant).')
      return
    }
    const confirm = window.confirm(`Supprimer définitivement le genre « ${genreName} » ?`)
    if (!confirm) return
    try {
      const res = await fetch(`/api/genres/${genreId}`, {
        method: 'DELETE',
        headers: { 'x-portal-code': portalCode },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const msg = data?.error || 'Échec de la suppression.'
        alert(msg)
        return
      }
      // Retirer de la liste locale et de la sélection si présent
      setGenres((prev) => prev.filter((g) => g._id !== genreId))
      setSelectedGenres((prev) => prev.filter((g) => g !== genreName))
    } catch (e) {
      console.error(e)
      alert('Erreur réseau pendant la suppression.')
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Chargement des genres...</div>
  }

  return (
    <div className="space-y-4">
      {/* Genres sélectionnés */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedGenres.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              role="button"
              tabIndex={0}
              title={`Retirer « ${genre} »`}
              onClick={() => removeGenre(genre)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  removeGenre(genre)
                }
              }}
              className="gap-1 cursor-pointer select-none hover:bg-secondary/80"
            >
              {genre}
              <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-sm bg-secondary-foreground/10 text-secondary-foreground/80">
                <X aria-hidden className="h-3 w-3" />
              </span>
              <span className="sr-only">Retirer {genre}</span>
            </Badge>
          ))}
          <button
            type="button"
            onClick={() => setSelectedGenres([])}
            className="ml-1 text-xs px-2 py-1 rounded-md border border-border text-foreground/70 hover:bg-muted"
          >
            Tout effacer
          </button>
        </div>
      )}

      {/* Liste des genres disponibles */}
      <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {genres.map((genre) => (
            <div key={genre._id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleGenre(genre.name)}
                className={`flex-1 text-left px-3 py-2 text-sm rounded-md border transition-colors ${
                  selectedGenres.includes(genre.name)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-input'
                }`}
              >
                {genre.name}
              </button>
              {portalCode && (
                <button
                  type="button"
                  title={`Supprimer « ${genre.name} »`}
                  onClick={() => deleteGenreFromList(genre._id, genre.name)}
                  className="shrink-0 p-2 rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ajouter un nouveau genre */}
      <div className="space-y-2">
        <Label htmlFor="newGenre">Ajouter un nouveau genre</Label>
        <div className="flex gap-2">
          <Input
            id="newGenre"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addNewGenre()
              } else if (e.key === 'Escape') {
                setNewGenre('')
              } else if (e.key === 'Backspace' && newGenre.length === 0 && selectedGenres.length > 0) {
                // Raccourci: supprimer rapidement le dernier badge sélectionné
                setSelectedGenres((prev) => prev.slice(0, -1))
              }
            }}
            placeholder="Ex: Afrobeat, Lo-fi, etc."
          />
          <button
            type="button"
            onClick={addNewGenre}
            disabled={!newGenre.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
