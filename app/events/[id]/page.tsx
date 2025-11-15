'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Clock, User, AlertCircle, Loader2 } from 'lucide-react'

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

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
        const res = await fetch(`${baseUrl}/events/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setEvent(data)
        } else {
          setError('Event not found')
        }
      } catch (err) {
        setError('Failed to load event')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      setIsDeleting(true)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
      const token = localStorage.getItem('authToken')

      const res = await fetch(`${baseUrl}/events/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (res.ok) {
        router.push('/events')
      } else {
        setError('Failed to delete event')
      }
    } catch (err) {
      setError('Failed to delete event')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span className="text-destructive">{error || 'Event not found'}</span>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isOwner = user && event.user_id === user.id
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>

        <div className="rounded-lg overflow-hidden mb-6 h-96 bg-muted">
          <img
            src={event.image_url || "/placeholder.svg"}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{event.name}</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Date</p>
                    <p className="text-sm font-semibold">{eventDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Time</p>
                    <p className="text-sm font-semibold">{event.start_time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Location</p>
                    <p className="text-sm font-semibold truncate">{event.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About this event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground whitespace-pre-wrap">{event.description}</p>

              {event.organizer && (
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Organized by <span className="font-semibold">{event.organizer}</span></span>
                </div>
              )}

              {event.max_attendees && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Max attendees:</span> {event.max_attendees}
                </p>
              )}
            </CardContent>
          </Card>

          {isOwner && (
            <div className="flex gap-3">
              <Button
                onClick={() => router.push(`/events/${event.id}/edit`)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Edit Event
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant="destructive"
                className="flex-1"
              >
                {isDeleting ? 'Deleting...' : 'Delete Event'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
