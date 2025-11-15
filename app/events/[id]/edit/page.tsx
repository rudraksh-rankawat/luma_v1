'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Navbar } from '@/components/navbar'
import { EventForm } from '@/components/event-form'
import { Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

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

export default function EditEventPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
        const res = await fetch(`${baseUrl}/events/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.user_id !== user?.id) {
            setError('You do not have permission to edit this event')
          } else {
            setEvent(data)
          }
        } else {
          setError('Event not found')
        }
      } catch (err) {
        setError('Failed to load event')
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchEvent()
    }
  }, [params.id, user, authLoading])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span className="text-destructive">{error}</span>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
          <p className="text-muted-foreground mt-2">Update the event details below</p>
        </div>
        {event && <EventForm initialEvent={event} />}
      </div>
    </div>
  )
}
