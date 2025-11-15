'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Navbar } from '@/components/navbar'
import { EventForm } from '@/components/event-form'

export default function NewEventPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create a New Event</h1>
          <p className="text-muted-foreground mt-2">Fill in the details below to create your event</p>
        </div>
        <EventForm />
      </div>
    </div>
  )
}
