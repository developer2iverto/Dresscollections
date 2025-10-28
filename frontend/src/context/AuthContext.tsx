import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { postLogin, getMe, postRegister } from '../utils/api'

export interface Address {
  _id?: string
  type?: 'home' | 'work' | 'other'
  street: string
  city: string
  state: string
  zipCode: string
  country?: string
  isDefault?: boolean
}

interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'product_admin' | 'admin' | 'user' | 'author'
  avatar?: string
  firstName?: string
  lastName?: string
  phone?: string
  addresses?: Address[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<boolean>
  registerWithDetails: (firstName: string, lastName: string, email: string, phone: string, password: string) => Promise<boolean>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Export as a named function declaration instead of an arrow function for better HMR compatibility
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('userData')
        
        if (token && userData) {
          // Verify token with backend
          try {
            const me = await getMe()
            const parsedUser: User = {
              id: me.user._id,
              email: me.user.email,
              name: `${me.user.firstName || ''} ${me.user.lastName || ''}`.trim() || me.user.email,
              role: me.user.role,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(me.user.firstName || me.user.email)}&background=6366f1&color=fff`,
              firstName: me.user.firstName,
              lastName: me.user.lastName,
              phone: me.user.phone,
              addresses: me.user.addresses || []
            }
            localStorage.setItem('userData', JSON.stringify(parsedUser))
            setUser(parsedUser)
          } catch (e) {
            // invalid token
            localStorage.removeItem('authToken')
            localStorage.removeItem('userData')
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const res = await postLogin(email, password)
      const token: string = res.token
      const u = res.user
      const userObj: User = {
        id: u.id || u._id,
        email: u.email,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
        role: u.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName || u.email)}&background=6366f1&color=fff`,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        addresses: u.addresses || []
      }

      localStorage.setItem('authToken', token)
      localStorage.setItem('userData', JSON.stringify(userObj))
      setUser(userObj)
      return true
    } catch (error) {
      console.error('Login error:', error)
      // Offline/demo fallback: allow demo admin credentials without backend
      const isDemo = email.trim().toLowerCase() === 'admin@cms.com' && password.trim() === 'admin123'
      if (isDemo) {
        const token = `demo-${Date.now()}`
        const userObj: User = {
          id: 'demo-admin',
          email: 'admin@cms.com',
          name: 'Admin Demo',
          role: 'admin',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('Admin Demo')}&background=6366f1&color=fff`,
          firstName: 'Admin',
          lastName: 'Demo',
          phone: '+1000000000',
          addresses: []
        }
        localStorage.setItem('authToken', token)
        localStorage.setItem('userData', JSON.stringify(userObj))
        setUser(userObj)
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const [firstName, ...rest] = name.split(' ')
      const lastName = rest.join(' ')
      const res = await postRegister(firstName || name, lastName || 'User', email, '+1000000000', password)
      const token: string = res.token
      const u = res.user
      const userObj: User = {
        id: u.id || u._id,
        email: u.email,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
        role: (u.role === 'super_admin' || u.role === 'product_admin' || u.role === 'admin' ? u.role : 'author'),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName || u.email)}&background=6366f1&color=fff`,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        addresses: u.addresses || []
      }
      localStorage.setItem('authToken', token)
      localStorage.setItem('userData', JSON.stringify(userObj))
      setUser(userObj)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      throw error as Error
    } finally {
      setIsLoading(false)
    }
  }

  const registerWithDetails = async (firstName: string, lastName: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const res = await postRegister(firstName, lastName, email, phone, password)
      const token: string = res.token
      const u = res.user
      const userObj: User = {
        id: u.id || u._id,
        email: u.email,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
        role: (u.role === 'super_admin' || u.role === 'product_admin' || u.role === 'admin' ? u.role : 'author'),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName || u.email)}&background=6366f1&color=fff`,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        addresses: u.addresses || []
      }
      localStorage.setItem('authToken', token)
      localStorage.setItem('userData', JSON.stringify(userObj))
      setUser(userObj)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      throw error as Error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const me = await getMe()
      const parsedUser: User = {
        id: me.user._id,
        email: me.user.email,
        name: `${me.user.firstName || ''} ${me.user.lastName || ''}`.trim() || me.user.email,
        role: me.user.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(me.user.firstName || me.user.email)}&background=6366f1&color=fff`,
        firstName: me.user.firstName,
        lastName: me.user.lastName,
        phone: me.user.phone,
        addresses: me.user.addresses || []
      }
      localStorage.setItem('userData', JSON.stringify(parsedUser))
      setUser(parsedUser)
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    registerWithDetails,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}