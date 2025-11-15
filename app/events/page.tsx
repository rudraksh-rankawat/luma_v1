'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { EventCard } from '@/components/event-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const search = searchParams.get('search') || ''
  const date = searchParams.get('date') || ''

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (date) params.append('date', date)

        const res = await fetch(`${baseUrl}/events?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setEvents(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to fetch events:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [search, date])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchValue = formData.get('search') as string
    const dateValue = formData.get('date') as string

    const params = new URLSearchParams()
    if (searchValue) params.append('search', searchValue)
    if (dateValue) params.append('date', dateValue)

    router.push(`/events?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Discover Events</h1>
          <p className="text-muted-foreground">Find and explore amazing events happening near you</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8 p-6 bg-card rounded-lg border border-border shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Events</label>
              <Input
                type="text"
                name="search"
                placeholder="e.g., workshop, conference..."
                defaultValue={search}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="date"
                name="date"
                defaultValue={date}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/events')}
            >
              Clear
            </Button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No events found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
