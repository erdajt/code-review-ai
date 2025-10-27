'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types'
import { storage } from '@/lib/storage'
import { api } from '@/lib/api'

interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = storage.getUser()
    if (storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const response = await api.auth.login(username, password)
    const userData = { userId: response.user_id, token: response.token, username }
    setUser(userData)
    storage.setUser(userData)
  }

  const register = async (username: string, password: string) => {
    const response = await api.auth.register(username, password)
    const userData = { userId: response.user_id, token: response.token, username }
    setUser(userData)
    storage.setUser(userData)
  }

  const logout = () => {
    setUser(null)
    storage.setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

