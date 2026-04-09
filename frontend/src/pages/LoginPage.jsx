import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import logoOutline from '../assets/logo-outline.svg'
import './LoginPage.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function LoginPage() {
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleError, setGoogleError] = useState('')

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'user'
  })

  const handleGoogleClick = () => {
    setGoogleError('')
    if (!GOOGLE_CLIENT_ID) {
      setGoogleError('Google login is not configured — add VITE_GOOGLE_CLIENT_ID to frontend/.env')
      return
    }
    const redirectUri = `${window.location.origin}/auth/callback`
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(loginData)
    
    if (!result.success) {
      setError(result.error)
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await register(registerData)
    
    if (!result.success) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        
        <div className="login-header">
          <img src={logoOutline} alt="EstudioA" className="login-logo" />
          <p className="body text-secondary">AI-Powered Pattern Platform</p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="login-tabs">
          <button
            onClick={() => {
              setActiveTab('login')
              setError('')
            }}
            className={`login-tab ${activeTab === 'login' ? 'login-tab-active' : ''}`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab('register')
              setError('')
            }}
            className={`login-tab ${activeTab === 'register' ? 'login-tab-active' : ''}`}
          >
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="login-form">
            
            <Input
              label="Username"
              type="text"
              required
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              placeholder="Enter your username"
            />

            <Input
              label="Password"
              type="password"
              required
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="login-form">
            
            <Input
              label="Full Name"
              type="text"
              required
              value={registerData.full_name}
              onChange={(e) => setRegisterData({...registerData, full_name: e.target.value})}
              placeholder="Enter your full name"
            />

            <Input
              label="Username"
              type="text"
              required
              value={registerData.username}
              onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
              placeholder="Choose a username"
            />

            <Input
              label="Email"
              type="email"
              required
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              required
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              placeholder="Create a password"
            />

            {/* Role Selection */}
            <div className="login-role-selection">
              <label className="input-label">I am a:</label>
              
              <div className="login-role-options">
                <label className={`login-role-option ${registerData.role === 'user' ? 'login-role-option-active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={registerData.role === 'user'}
                    onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                  />
                  <div className="login-role-content">
                    <div className="login-role-title">User</div>
                    <div className="login-role-desc">Browse and download patterns</div>
                  </div>
                </label>

                <label className={`login-role-option ${registerData.role === 'designer' ? 'login-role-option-active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="designer"
                    checked={registerData.role === 'designer'}
                    onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                  />
                  <div className="login-role-content">
                    <div className="login-role-title">Designer</div>
                    <div className="login-role-desc">Upload and share my patterns</div>
                  </div>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

          </form>
        )}

        {/* Google Sign-In — only shown when VITE_GOOGLE_CLIENT_ID is set */}
        {GOOGLE_CLIENT_ID && (
          <>
            <div className="login-divider">
              <span>or continue with</span>
            </div>
            <button
              type="button"
              className="login-google-btn"
              onClick={handleGoogleClick}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
            {googleError && (
              <p className="login-google-error">{googleError}</p>
            )}
          </>
        )}

        {/* Switch Tab Link */}
        <div className="login-footer">
          {activeTab === 'login' ? (
            <p className="body-small text-secondary">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setActiveTab('register')
                  setError('')
                }}
                className="login-link"
              >
                Register here
              </button>
            </p>
          ) : (
            <p className="body-small text-secondary">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setActiveTab('login')
                  setError('')
                }}
                className="login-link"
              >
                Login here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

export default LoginPage