export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container mx-auto px-6 py-8">
        <p className="text-center text-sm text-white/60">© {currentYear} WAV Studio — Paris</p>
      </div>
    </footer>
  )
}
