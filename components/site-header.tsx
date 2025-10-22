"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HeaderMarquee } from "./header-marquee"

export function SiteHeader() {
  const pathname = usePathname()

  const leftLinks = [
    { href: "/work", label: "Work" },
    { href: "/artists", label: "Artists" },
  ]

  const rightLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10 shadow-[0_1px_0_0_rgba(255,255,255,0.08)]">
      <div className="hidden lg:block px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          <nav className="flex items-center gap-6 w-[250px]">
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-opacity whitespace-nowrap ${
                  pathname === link.href ? "opacity-100 underline underline-offset-4" : "opacity-70 hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 flex items-center justify-center min-w-0">
            <HeaderMarquee />
          </div>

          <nav className="flex items-center gap-6 w-[250px] justify-end">
            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-opacity whitespace-nowrap ${
                  pathname === link.href ? "opacity-100 underline underline-offset-4" : "opacity-70 hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="lg:hidden px-4 py-3">
        <div className="flex flex-col gap-3">
          <div className="overflow-hidden">
            <HeaderMarquee />
          </div>

          <nav className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            {[...leftLinks, ...rightLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs sm:text-sm tracking-wide transition-opacity whitespace-nowrap ${
                  pathname === link.href ? "opacity-100 underline underline-offset-4" : "opacity-70 hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
