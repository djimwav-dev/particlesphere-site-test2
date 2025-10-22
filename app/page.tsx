"use client"

import dynamic from "next/dynamic"
import Link from "next/link"

const Scene = dynamic(() => import("@/components/scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/60 text-sm">Loading 3D Scene…</div>
    </div>
  ),
})

export default function Home() {
  return (
    <div className="relative">
      <section className="relative min-h-[80vh] w-full bg-black text-white overflow-hidden">
        {/* 3D Particle Sphere Background */}
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>

        <div className="absolute inset-x-0 bottom-10 z-10 flex items-center justify-center">
          <div className="rounded-2xl p-4 py-0">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/discover"
                aria-label="Découvrir nos projets sélectionnés"
                className="bg-white text-black rounded-xl px-5 py-3 font-medium hover:bg-neutral-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                Découvrir
              </Link>
              <Link
                href="/contact"
                aria-label="Nous contacter"
                className="border border-white/30 text-white rounded-xl px-5 py-3 font-medium hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
