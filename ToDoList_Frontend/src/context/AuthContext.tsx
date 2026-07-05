import { createContext, useContext, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'

interface AuthContextValue {
  username: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(
    () => localStorage.getItem('username')
  )

  const persistSession = (token: string, name: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('username', name)
    setUsername(name)
  }

  const login = async (u: string, p: string) => {
    const res = await authService.login(u, p)
    persistSession(res.token, res.username)
  }

  const register = async (u: string, p: string) => {
    const res = await authService.register(u, p)
    persistSession(res.token, res.username)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setUsername(null)
  }

  return (
    <AuthContext.Provider
      value={{ username, isAuthenticated: !!username, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
