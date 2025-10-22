'use client'

import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

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

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Chargement des genres...</div>
  }

  return (
    <div className="space-y-4">
      {/* Genres sélectionnés */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((genre) => (
            <Badge key={genre} variant="secondary" className="gap-1">
              {genre}
              <button
                type="button"
                onClick={() => removeGenre(genre)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Liste des genres disponibles */}
      <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {genres.map((genre) => (
            <button
              key={genre._id}
              type="button"
              onClick={() => toggleGenre(genre.name)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                selectedGenres.includes(genre.name)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted border-input'
              }`}
            >
              {genre.name}
            </button>
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
