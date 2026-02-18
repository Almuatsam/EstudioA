import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login') // 'login' or 'register'
  
  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  })

  const handleLogin = (e) => {
    e.preventDefault()
    console.log('Login:', loginData)
    // TODO: Connect to backend API later
    // For now, just redirect to dashboard
    alert('Login functionality will be connected to backend API')
    navigate('/dashboard')
  }

  const handleRegister = (e) => {
    e.preventDefault()
    console.log('Register:', registerData)
    // TODO: Connect to backend API later
    alert('Registration functionality will be connected to backend API')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div 
        style={{ backgroundColor: '#8FA9B6' }}
        className="w-full max-w-md rounded-xl p-8"
      >
        
        {/* Logo/Title */}
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('login')}
            style={{ 
              backgroundColor: activeTab === 'login' ? '#5C768A' : 'transparent',
              color: activeTab === 'login' ? 'white' : '#1F2F3A'
            }}
            className="flex-1 py-3 rounded-lg font-medium transition-all"
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
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
            
            {/* Username/Email */}
            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Username or Email
              </label>
              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your username or email"
              />
            </div>

            {/* Password */}
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

            {/* Submit Button */}
            <button
              type="submit"
              style={{ backgroundColor: '#5C768A' }}
              className="w-full py-3 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Login
            </button>

            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <a 
                href="#"
                style={{ color: '#6E8594' }}
                className="text-sm hover:opacity-70"
              >
                Forgot password?
              </a>
            </div>

          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister}>
            
            {/* Full Name */}
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

            {/* Username */}
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

            {/* Email */}
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

            {/* Password */}
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
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Create a password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{ backgroundColor: '#5C768A' }}
              className="w-full py-3 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Create Account
            </button>

            {/* Terms */}
            <p 
              style={{ color: '#6E8594' }}
              className="text-xs text-center mt-4"
            >
              By creating an account, you agree to our Terms of Service
            </p>

          </form>
        )}

        {/* Switch Tab Link */}
        <div className="text-center mt-6">
          {activeTab === 'login' ? (
            <p style={{ color: '#6E8594' }} className="text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => setActiveTab('register')}
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
                onClick={() => setActiveTab('login')}
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