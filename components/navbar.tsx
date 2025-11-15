'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  // Wait until AuthProvider loads localStorage
  if (isLoading) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className="border-b border-border bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/events" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              S
            </div>
            <span className="font-bold text-lg hidden sm:inline">SuperSquad</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
                <Link href="/events/new">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Create Event
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
