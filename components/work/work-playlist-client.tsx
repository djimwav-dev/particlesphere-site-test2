"use client"

import { useMemo } from "react"
import { useAudio } from "@/components/audio/audio-context"
import { Play } from "lucide-react"

export type WorkPlaylistProps = {
  workId: string
  workTitle: string
  artistName?: string
  coverUrl?: string
  tracks: Array<{
    id: string
    title: string
    url: string
    duration?: number
  }>
}

export function WorkPlaylistClient(props: WorkPlaylistProps) {
  const audio = useAudio()
  const playlist = useMemo(() => ({
    id: props.workId,
    title: props.workTitle,
    coverUrl: props.coverUrl,
    tracks: props.tracks.map((t, idx) => ({
      id: t.id || `${props.workId}-${idx}`,
      title: t.title,
      url: t.url,
      duration: t.duration,
      artist: props.artistName,
      coverUrl: props.coverUrl,
    })),
  }), [props])

  if (!props.tracks.length) {
    return (
      <div className="p-6 bg-white/5 rounded-xl text-sm text-white/70">
        Aucune piste intégrée pour ce projet.
      </div>
    )
  }

  return (
    <div className="p-6 bg-white/5 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Lecteur</h3>
        <button
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white text-black text-sm"
          onClick={() => audio.loadPlaylist(playlist, 0)}
        >
          <Play className="w-4 h-4" /> Lire tout
        </button>
      </div>
      <ul className="space-y-2">
        {props.tracks.map((t, i) => (
          <li key={t.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs text-white/50 w-6 tabular-nums">{String(i+1).padStart(2, "0")}</span>
              <span className="truncate">{t.title}</span>
            </div>
            <button
              className="px-2 py-1 rounded hover:bg-white/10"
              onClick={() => audio.loadPlaylist(playlist, i)}
              aria-label={`Lire ${t.title}`}
            >
              <Play className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
