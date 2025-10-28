"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

export type Track = {
  id: string
  title: string
  artist?: string
  coverUrl?: string
  url: string
  duration?: number
}

export type Playlist = {
  id: string
  title?: string
  tracks: Track[]
  coverUrl?: string
}

type AudioState = {
  playlist: Playlist | null
  currentIndex: number
  playing: boolean
  volume: number
  currentTime: number
  duration: number
}

type AudioAPI = {
  state: AudioState
  loadPlaylist: (playlist: Playlist, startIndex?: number) => void
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (time: number) => void
  setVolume: (v: number) => void
}

const AudioContext = createContext<AudioAPI | null>(null)

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error("useAudio must be used within <AudioProvider>")
  return ctx
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Create a single audio element
  useEffect(() => {
    const el = new Audio()
    el.preload = "metadata"
    el.addEventListener("timeupdate", () => setCurrentTime(el.currentTime))
    el.addEventListener("durationchange", () => setDuration(el.duration || 0))
    el.addEventListener("ended", () => {
      // Auto-next
      if (playlist && currentIndex < playlist.tracks.length - 1) {
        setCurrentIndex((i) => i + 1)
      } else {
        setPlaying(false)
      }
    })
    audioRef.current = el
    return () => {
      el.pause()
      audioRef.current = null
    }
  }, [])

  // Load current track when playlist/index changes
  useEffect(() => {
    const el = audioRef.current
    if (!el || !playlist) return
    const track = playlist.tracks[currentIndex]
    if (!track) return
    el.src = track.url
    el.currentTime = 0
    setCurrentTime(0)
    // Autoplay if previously playing
    if (playing) {
      el.play().catch(() => setPlaying(false))
    }
  }, [playlist, currentIndex])

  // Apply play/pause to element
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = volume
    if (playing) {
      el.play().catch(() => setPlaying(false))
    } else {
      el.pause()
    }
  }, [playing, volume])

  const api: AudioAPI = useMemo(() => ({
    state: { playlist, currentIndex, playing, volume, currentTime, duration },
    loadPlaylist: (pl, startIndex = 0) => {
      setPlaylist(pl)
      setCurrentIndex(Math.max(0, Math.min(startIndex, pl.tracks.length - 1)))
      setPlaying(true)
    },
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    toggle: () => setPlaying((p) => !p),
    next: () => {
      if (!playlist) return
      setCurrentIndex((i) => Math.min(i + 1, playlist.tracks.length - 1))
      setPlaying(true)
    },
    prev: () => {
      if (!playlist) return
      setCurrentIndex((i) => Math.max(i - 1, 0))
      setPlaying(true)
    },
    seek: (t) => {
      const el = audioRef.current
      if (!el) return
      el.currentTime = t
      setCurrentTime(t)
    },
    setVolume: (v) => setVolume(Math.max(0, Math.min(1, v))),
  }), [playlist, currentIndex, playing, volume, currentTime, duration])

  return (
    <AudioContext.Provider value={api}>
      {children}
    </AudioContext.Provider>
  )
}
