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
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const data = await authAPI.getCurrentUser()
        setUser(data.user)
        setIsAuthenticated(true)
        setIsAdmin(data.user.role === 'admin')
      } catch (error) {
        console.error('Failed to load user:', error)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      setIsAdmin(data.user.role === 'admin')
      
      // Redirect based on user role
      if (data.user.role === 'designer') {
        navigate('/designer-dashboard')
      } else if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/account')
      }
      
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
      localStorage.setItem('token', data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      setIsAdmin(data.user.role === 'admin')
      
      // Redirect based on user role
      if (data.user.role === 'designer') {
        navigate('/designer-dashboard')
      } else if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/account')
      }
      
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
      localStorage.setItem('token', data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      setIsAdmin(data.user.role === 'admin')

      if (data.user.role === 'designer') {
        navigate('/designer-dashboard')
      } else if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/account')
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Google login failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
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