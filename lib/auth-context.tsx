'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: number
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth from localStorage on mount
  // useEffect(() => {
  //   const savedToken = localStorage.getItem('authToken')
  //   const savedUser = localStorage.getItem('authUser')
  //   if (savedToken && savedUser) {
  //     setToken(savedToken)
  //     setUser(JSON.parse(savedUser))
  //   }
  //   setIsLoading(false)
  // }, [])

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('authUser')
  
    if (savedToken) {
      setToken(savedToken)
    }
  
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        setUser(JSON.parse(savedUser))
      } catch (err) {
        console.warn("Failed to parse saved user:", savedUser)
        localStorage.removeItem('authUser')
        setUser(null)
      }
    }
  
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Login failed')
    }

    const data = await res.json()
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('authUser', JSON.stringify(data.user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
