import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

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
    role: 'user'  // NEW: Default to 'user'
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
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-pattern-soft">
      <div 
        style={{ backgroundColor: '#8FA9B6' }}
        className="w-full max-w-md rounded-xl p-8"
      >
        
        <div className="text-center mb-8">
          <h1 
            style={{ color: '#1F2F3A' }}
            className="text-3xl font-bold"
          >
            EstudioA
          </h1>
          <p 
            style={{ color: '#6E8594' }}
            className="text-sm mt-2"
          >
            AI-Powered Pattern Platform
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            style={{ backgroundColor: '#f8d7da', color: '#721c24', borderColor: '#f5c6cb' }}
            className="p-3 rounded-lg mb-4 text-sm border"
          >
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('login')
              setError('')
            }}
            style={{ 
              backgroundColor: activeTab === 'login' ? '#5C768A' : 'transparent',
              color: activeTab === 'login' ? 'white' : '#1F2F3A'
            }}
            className="flex-1 py-3 rounded-lg font-medium transition-all"
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab('register')
              setError('')
            }}
            style={{ 
              backgroundColor: activeTab === 'register' ? '#5C768A' : 'transparent',
              color: activeTab === 'register' ? 'white' : '#1F2F3A'
            }}
            className="flex-1 py-3 rounded-lg font-medium transition-all"
          >
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            
            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-6">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#5C768A' }}
              className="w-full py-3 text-white rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </button>

          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister}>
            
            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                required
                value={registerData.full_name}
                onChange={(e) => setRegisterData({...registerData, full_name: e.target.value})}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                required
                value={registerData.username}
                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Choose a username"
              />
            </div>

            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                required
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Create a password"
              />
            </div>

            {/* NEW: Role Selection */}
            <div className="mb-6">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-3"
              >
                I am a:
              </label>
              
              <div className="space-y-3">
                {/* User Radio Button */}
                <label 
                  className="flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all"
                  style={{ 
                    backgroundColor: registerData.role === 'user' ? '#D9CDB8' : '#E9DDC9',
                    border: registerData.role === 'user' ? '2px solid #5C768A' : '2px solid transparent'
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={registerData.role === 'user'}
                    onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                    className="mt-1"
                    style={{ accentColor: '#5C768A' }}
                  />
                  <div className="flex-1">
                    <div style={{ color: '#1F2F3A' }} className="font-bold mb-1">
                      User
                    </div>
                    <div style={{ color: '#6E8594' }} className="text-sm">
                      Browse and download patterns
                    </div>
                  </div>
                </label>

                {/* Designer Radio Button */}
                <label 
                  className="flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all"
                  style={{ 
                    backgroundColor: registerData.role === 'designer' ? '#D9CDB8' : '#E9DDC9',
                    border: registerData.role === 'designer' ? '2px solid #5C768A' : '2px solid transparent'
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="designer"
                    checked={registerData.role === 'designer'}
                    onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                    className="mt-1"
                    style={{ accentColor: '#5C768A' }}
                  />
                  <div className="flex-1">
                    <div style={{ color: '#1F2F3A' }} className="font-bold mb-1">
                      Designer
                    </div>
                    <div style={{ color: '#6E8594' }} className="text-sm">
                      Upload and share my patterns
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#5C768A' }}
              className="w-full py-3 text-white rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>

          </form>
        )}

        {/* Switch Tab Link */}
        <div className="text-center mt-6">
          {activeTab === 'login' ? (
            <p style={{ color: '#6E8594' }} className="text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setActiveTab('register')
                  setError('')
                }}
                style={{ color: '#5C768A' }}
                className="font-medium hover:opacity-70"
              >
                Register here
              </button>
            </p>
          ) : (
            <p style={{ color: '#6E8594' }} className="text-sm">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setActiveTab('login')
                  setError('')
                }}
                style={{ color: '#5C768A' }}
                className="font-medium hover:opacity-70"
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