import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  const services = [
    "Enregistrement studio",
    "Mix & Mastering",
    "Production musicale",
    "Sound design",
    "Post-production",
  ]

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">About</h1>

        <div className="space-y-12">
          <div>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              WIDEANGLEVISION est un studio d'enregistrement, de mix et de mastering basé à Paris. Nous accompagnons les
              artistes dans la réalisation de leurs projets musicaux avec une approche créative et technique de haute
              qualité.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              Notre équipe passionnée met à votre disposition un environnement professionnel et des équipements de
              pointe pour donner vie à vos créations musicales.
            </p>
          </div>

          <div className="aspect-video relative rounded-2xl overflow-hidden">
            <Image src="/placeholder.jpg" alt="WAV Studio" fill className="object-cover" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Services</h2>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="flex items-center gap-3 text-lg text-white/80">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/work"
            className="inline-block px-8 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform"
          >
            Voir Work
          </Link>
        </div>
      </div>
    </div>
  )
}
