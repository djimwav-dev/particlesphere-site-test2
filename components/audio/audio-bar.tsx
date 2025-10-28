"use client"

import { useMemo } from "react"
import { useAudio } from "./audio-context"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function AudioBar() {
  const {
    state: { playlist, currentIndex, playing, currentTime, duration, volume },
    toggle,
    prev,
    next,
    seek,
    setVolume,
  } = useAudio()

  const track = useMemo(() => playlist?.tracks[currentIndex], [playlist, currentIndex])

  if (!playlist || !track) return null

  const fmt = (s: number) => {
    if (!Number.isFinite(s)) return "0:00"
    const m = Math.floor(s / 60)
    const ss = Math.floor(s % 60)
    return `${m}:${ss.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 py-3 grid grid-cols-12 items-center gap-4">
        {/* Left: Title */}
        <div className="col-span-12 md:col-span-4 flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-md bg-white/5 flex items-center justify-center select-none">
            {/* optional cover circle could be here */}
          </div>
          <div className="truncate">
            <div className="truncate font-medium">{track.title}</div>
            {track.artist && (
              <div className="truncate text-xs text-white/60">{track.artist}</div>
            )}
          </div>
        </div>

        {/* Middle: Controls + progress */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-4">
            <button onClick={prev} className="p-2 rounded hover:bg-white/10" aria-label="Précédent">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={toggle} className="p-2 rounded hover:bg-white/10" aria-label={playing ? "Pause" : "Lecture"}>
              {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button onClick={next} className="p-2 rounded hover:bg-white/10" aria-label="Suivant">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums text-white/60 w-10 text-right">{fmt(currentTime)}</span>
            <Slider
              value={[Number.isFinite(currentTime) ? currentTime : 0]}
              max={Number.isFinite(duration) && duration > 0 ? duration : 100}
              step={1}
              onValueChange={(v) => seek(v[0] ?? 0)}
              className="w-full"
            />
            <span className="text-xs tabular-nums text-white/60 w-10">{fmt(duration)}</span>
          </div>
        </div>

        {/* Right: Volume */}
        <div className="col-span-12 md:col-span-3 flex items-center justify-end gap-2">
          <Volume2 className="w-4 h-4" />
          <Slider
            value={[Math.round(volume * 100)]}
            max={100}
            step={1}
            onValueChange={(v) => setVolume((v[0] ?? 100) / 100)}
            className="w-32"
          />
        </div>
      </div>
    </div>
  )
}
