import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const data = await authAPI.getCurrentUser()
      setUser(data.user)
      setIsAuthenticated(true)
      setIsAdmin(data.user.role === 'admin')
    } catch {
      // Token invalid or expired — clear it so we don't retry on next load
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    } finally {
      setLoading(false)
    }
  }

  const _applyAuth = (userData, accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken)
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
    setUser(userData)
    setIsAuthenticated(true)
    setIsAdmin(userData.role === 'admin')
  }

  const _redirectByRole = (role) => {
    if (role === 'designer') navigate('/designer-dashboard')
    else if (role === 'admin') navigate('/admin')
    else navigate('/account')
  }

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials)
      _applyAuth(data.user, data.access_token, data.refresh_token)
      _redirectByRole(data.user.role)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      }
    }
  }

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData)
      _applyAuth(data.user, data.access_token, data.refresh_token)
      _redirectByRole(data.user.role)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      }
    }
  }

  const googleLogin = async ({ code, redirect_uri }) => {
    try {
      const data = await authAPI.googleLogin({ code, redirect_uri })
      _applyAuth(data.user, data.access_token, data.refresh_token)
      _redirectByRole(data.user.role)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Google login failed'
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch {
      // clear state regardless of network failure
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      isAdmin,
      loading,
      login,
      register,
      googleLogin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
