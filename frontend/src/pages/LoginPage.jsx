import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import './LoginPage.css'

function LoginPage() {
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
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
          <h1 className="h1">EstudioA</h1>
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