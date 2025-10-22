import showcaseEvent from "@/data/events/showcase.json"
import EventPageClient from "./client"

const events = [showcaseEvent]

export function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }))
}

export const dynamic = "error"

export default function EventPage({ params }: { params: { slug: string } }) {
  return <EventPageClient params={params} />
}
