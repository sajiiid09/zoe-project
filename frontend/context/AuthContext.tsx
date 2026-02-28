"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Store {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  banner: string | null
  approvalStatus: string
  rejectionNote: string | null
  isActive: boolean
}

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  profilePicture: string | null
  role: string
  vendorFeePaid: boolean
  addresses: unknown[]
  store: Store | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; requiresPayment?: boolean }>
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = "decormade-token"
const USER_KEY = "decormade-user"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const persistSession = (newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  const fetchProfile = useCallback(async (savedToken: string) => {
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })

      if (!res.ok) {
        clearSession()
        return
      }

      const data = await res.json()

      if (data.success && data.user) {
        setUser(data.user)
        setToken(savedToken)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      } else {
        clearSession()
      }
    } catch {
      clearSession()
    }
  }, [])

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)

    if (savedToken) {
      fetchProfile(savedToken).finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [fetchProfile])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.success && data.token) {
        persistSession(data.token, data.user)
        return { success: true }
      }

      // 402: vendor must pay before full access
      if (data.requiresPayment && data.token) {
        persistSession(data.token, data.user)
        return { success: false, requiresPayment: true, message: data.message }
      }

      return { success: false, message: data.message || "Login failed" }
    } catch {
      return { success: false, message: "Network error" }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      })

      const data = await res.json()

      if (data.success && data.token) {
        persistSession(data.token, data.user)
        return { success: true }
      }

      return { success: false, message: data.message || "Registration failed" }
    } catch {
      return { success: false, message: "Network error" }
    }
  }

  const logout = () => {
    clearSession()
  }

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    if (savedToken) {
      await fetchProfile(savedToken)
    }
  }, [fetchProfile])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
