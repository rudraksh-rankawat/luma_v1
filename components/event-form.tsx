'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

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

export function EventForm({ initialEvent }: { initialEvent?: Event }) {
  const [formData, setFormData] = useState({
    name: initialEvent?.name || '',
    description: initialEvent?.description || '',
    location: initialEvent?.location || '',
    date: initialEvent?.date || '',
    start_time: initialEvent?.start_time || '',
    end_time: initialEvent?.end_time || '',
    image_url: initialEvent?.image_url || '',
    max_attendees: initialEvent?.max_attendees || '',
    organizer: initialEvent?.organizer || '',
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate required fields
    if (!formData.name || !formData.description || !formData.location || !formData.date || !formData.start_time || !formData.image_url) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      const body = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time || undefined,
        image_url: formData.image_url,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
        organizer: formData.organizer || undefined,
      }

      const method = initialEvent ? 'PUT' : 'POST'
      const url = initialEvent ? `${baseUrl}/events/${initialEvent.id}` : `${baseUrl}/events`

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || `Failed to ${initialEvent ? 'update' : 'create'} event`)
      }

      const responseData = await res.json()
      // router.push(`/events/${responseData.id}`)
      router.push('/events')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Event Name *</label>
            <Input
              type="text"
              name="name"
              placeholder="e.g., Tech Conference 2025"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description *</label>
            <textarea
              name="description"
              placeholder="Describe your event..."
              value={formData.description}
              onChange={handleChange}
              className="w-full min-h-24 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location *</label>
            <Input
              type="text"
              name="location"
              placeholder="e.g., San Francisco, CA"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date *</label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start Time *</label>
              <Input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">End Time</label>
            <Input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Image URL *</label>
            <Input
              type="url"
              name="image_url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Max Attendees</label>
              <Input
                type="number"
                name="max_attendees"
                placeholder="e.g., 100"
                value={formData.max_attendees}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Organizer</label>
              <Input
                type="text"
                name="organizer"
                placeholder="Your name or organization"
                value={formData.organizer}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Saving...' : initialEvent ? 'Update Event' : 'Create Event'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
