"use client"

const marqueeItems = [
  "WIDEANGLEVISION STUDIO",
  "SOUND DESIGN",
  "MIX",
  "MASTERING",
  "VOCAL PRODUCTION",
  "ARRANGEMENTS",
  "RECORDING",
  "LIVE STREAM",
  "CREATIVE HUB",
  "BEATMAKING",
  "IMMERSIVE SOUND",
  "SYNC",
]

export function HeaderMarquee() {
  const marqueeText = marqueeItems.join("   ") + "   "

  return (
    <div className="relative mx-auto max-w-screen overflow-hidden">
      <a href="/" className="block" aria-label="Return to home">
        <div className="relative whitespace-nowrap">
          <div className="inline-block animate-marquee hover:[animation-play-state:paused] text-white uppercase tracking-[0.2em] text-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.25)] font-sans font-black px-0 my-3.5 leading-7 md:text-3xl">
            {marqueeText}
            {marqueeText}
            {marqueeText}
          </div>
        </div>
      </a>
    </div>
  )
}
