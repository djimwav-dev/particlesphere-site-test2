import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AudioProvider } from "@/components/audio/audio-context"
import { AudioBar } from "@/components/audio/audio-bar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "WIDEANGLEVISION — WAV Studio Paris",
  description: "Studio d'enregistrement, mix & mastering — Paris",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} font-sans bg-black text-white antialiased`}>
        <AudioProvider>
          <SiteHeader />
          <Suspense>{children}</Suspense>
          <SiteFooter />
          <AudioBar />
        </AudioProvider>
      </body>
    </html>
  )
}
