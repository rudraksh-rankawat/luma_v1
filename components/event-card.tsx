import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Clock } from 'lucide-react'

interface Event {
  id: number
  name: string
  description: string
  location: string
  date: string
  start_time: string
  end_time?: string
  image_url: string
  max_attendees?: number
  organizer?: string
  user_id: number
}

export function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        <div className="relative h-48 bg-muted overflow-hidden">
          <img
            src={event.image_url || "/placeholder.svg"}
            alt={event.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="pt-4">
          <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2">{event.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{event.start_time}{event.end_time ? ` - ${event.end_time}` : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
