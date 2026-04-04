import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthCallbackPage() {
  const { googleLogin } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const errorParam = params.get('error')

    if (errorParam) {
      setError('Google sign-in was cancelled or failed.')
      setTimeout(() => navigate('/login'), 3000)
      return
    }

    if (!code) {
      navigate('/login')
      return
    }

    const redirectUri = `${window.location.origin}/auth/callback`
    googleLogin({ code, redirect_uri: redirectUri }).then((result) => {
      if (!result.success) {
        setError(result.error || 'Google login failed')
        setTimeout(() => navigate('/login'), 3000)
      }
    })
  }, [])

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#721c24' }}>{error} Redirecting to login…</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Signing you in with Google…</p>
    </div>
  )
}

export default AuthCallbackPage
