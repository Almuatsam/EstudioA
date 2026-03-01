import LoadingSpinner from '../components/LoadingSpinner'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminAPI } from '../services/api'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function AdminPage() {
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [pendingPatterns, setPendingPatterns] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdmin) {
      loadStats()
      loadPendingPatterns()
      loadUsers()
    }
  }, [isAdmin])

  const loadStats = async () => {
    try {
      const data = await adminAPI.getStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const loadPendingPatterns = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getPendingPatterns()
      setPendingPatterns(data.patterns || [])
    } catch (error) {
      console.error('Failed to load pending patterns:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const data = await adminAPI.getUsers()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const handleApprove = async (patternId) => {
    try {
      await adminAPI.approvePattern(patternId)
      alert('Pattern approved successfully!')
      loadPendingPatterns()
      loadStats()
    } catch (error) {
      alert('Failed to approve pattern')
      console.error(error)
    }
  }

  const handleReject = async (patternId) => {
    if (window.confirm('Are you sure you want to reject this pattern?')) {
      try {
        await adminAPI.rejectPattern(patternId)
        alert('Pattern rejected')
        loadPendingPatterns()
        loadStats()
      } catch (error) {
        alert('Failed to reject pattern')
        console.error(error)
      }
    }
  }

  // Mock data for charts
  const platformGrowth = [
    { month: 'Jan', users: 45, patterns: 23 },
    { month: 'Feb', users: 62, patterns: 35 },
    { month: 'Mar', users: 78, patterns: 48 },
    { month: 'Apr', users: 95, patterns: 62 },
    { month: 'May', users: 112, patterns: 78 },
    { month: 'Jun', users: 134, patterns: 95 }
  ]

  const userRoleData = [
    { name: 'Users', value: users.filter(u => u.role === 'user').length, color: '#5C768A' },
    { name: 'Designers', value: users.filter(u => u.role === 'designer').length, color: '#8FA9B6' },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#A9BFCA' }
  ]

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pattern-soft">
        <div className="text-center">
          <h1 style={{ color: '#1F2F3A' }} className="text-3xl font-bold mb-4">
            Access Denied
          </h1>
          <p style={{ color: '#6E8594' }} className="mb-6">
            You need admin privileges to access this page
          </p>
          <Link
            to="/"
            style={{ backgroundColor: '#5C768A' }}
            className="inline-block px-6 py-3 text-white rounded-lg font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pattern-soft">
      
      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-12 md:mb-16">
            <h1 
              style={{ color: '#1F2F3A' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3"
            >
              Admin Dashboard
            </h1>
            <p 
              style={{ color: '#6E8594' }}
              className="text-lg md:text-xl"
            >
              Manage patterns, users, and platform settings
            </p>
          </div>

          {/* Summary Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div 
                style={{ backgroundColor: '#8FA9B6' }}
                className="rounded-2xl p-8 md:p-10 shadow-lg hover:scale-105 transition-all"
              >
                <div 
                  style={{ color: '#6E8594' }}
                  className="text-sm md:text-base font-medium mb-3"
                >
                  Total Users
                </div>
                <div 
                  style={{ color: '#1F2F3A' }}
                  className="text-5xl md:text-6xl font-bold"
                >
                  {stats.total_users || 0}
                </div>
              </div>

              <div 
                style={{ backgroundColor: '#8FA9B6' }}
                className="rounded-2xl p-8 md:p-10 shadow-lg hover:scale-105 transition-all"
              >
                <div 
                  style={{ color: '#6E8594' }}
                  className="text-sm md:text-base font-medium mb-3"
                >
                  Total Patterns
                </div>
                <div 
                  style={{ color: '#1F2F3A' }}
                  className="text-5xl md:text-6xl font-bold"
                >
                  {stats.total_patterns || 0}
                </div>
              </div>

              <div 
                style={{ backgroundColor: '#8FA9B6' }}
                className="rounded-2xl p-8 md:p-10 shadow-lg hover:scale-105 transition-all"
              >
                <div 
                  style={{ color: '#6E8594' }}
                  className="text-sm md:text-base font-medium mb-3"
                >
                  Total Downloads
                </div>
                <div 
                  style={{ color: '#1F2F3A' }}
                  className="text-5xl md:text-6xl font-bold"
                >
                  {stats.total_downloads || 0}
                </div>
              </div>

              <div 
                style={{ backgroundColor: '#8FA9B6' }}
                className="rounded-2xl p-8 md:p-10 shadow-lg hover:scale-105 transition-all"
              >
                <div 
                  style={{ color: '#6E8594' }}
                  className="text-sm md:text-base font-medium mb-3"
                >
                  Total Views
                </div>
                <div 
                  style={{ color: '#1F2F3A' }}
                  className="text-5xl md:text-6xl font-bold"
                >
                  {stats.total_views || 0}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Charts Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <h2 
            style={{ color: '#1F2F3A' }}
            className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
          >
            Platform Analytics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            
            {/* Platform Growth */}
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-2xl p-6 md:p-8 shadow-lg hover:scale-105 transition-all"
            >
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl md:text-2xl font-bold mb-6"
              >
                Platform Growth
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={platformGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#A9BFCA" />
                  <XAxis dataKey="month" stroke="#6E8594" style={{ fontSize: '14px' }} />
                  <YAxis stroke="#6E8594" style={{ fontSize: '14px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#E9DDC9', 
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#5C768A" 
                    strokeWidth={3}
                    dot={{ fill: '#5C768A', r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="patterns" 
                    stroke="#243A4D" 
                    strokeWidth={3}
                    dot={{ fill: '#243A4D', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* User Roles Distribution */}
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-2xl p-6 md:p-8 shadow-lg hover:scale-105 transition-all"
            >
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl md:text-2xl font-bold mb-6"
              >
                User Roles Distribution
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#E9DDC9', 
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-4 mb-8 md:mb-12 justify-center">
            <button
              onClick={() => setActiveTab('pending')}
              style={{ 
                backgroundColor: activeTab === 'pending' ? '#5C768A' : '#8FA9B6',
                color: activeTab === 'pending' ? 'white' : '#1F2F3A'
              }}
              className="px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg"
            >
              Pending Patterns
              {pendingPatterns.length > 0 && (
                <span className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                  {pendingPatterns.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              style={{ 
                backgroundColor: activeTab === 'users' ? '#5C768A' : '#8FA9B6',
                color: activeTab === 'users' ? 'white' : '#1F2F3A'
              }}
              className="px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg"
            >
              User Management
            </button>
          </div>

          {/* Tab Content */}
          
          {/* PENDING PATTERNS TAB */}
          {activeTab === 'pending' && (
            <div>
              <h2 
                style={{ color: '#1F2F3A' }}
                className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
              >
                Pending Pattern Approvals
              </h2>

              {loading ? (
                <div className="py-20">
                  <LoadingSpinner size="large" text="Loading pending patterns..." />
                </div>
              ) : pendingPatterns.length === 0 ? (
                <div 
                  style={{ backgroundColor: '#8FA9B6' }}
                  className="rounded-2xl p-16 text-center shadow-lg"
                >
                  <p style={{ color: '#1F2F3A' }} className="text-xl">
                    No pending patterns to review
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingPatterns.map((pattern) => (
                    <div
                      key={pattern.id}
                      style={{ backgroundColor: '#8FA9B6' }}
                      className="rounded-2xl p-6 md:p-8 shadow-lg hover:scale-105 transition-all"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div 
                          style={{ backgroundColor: '#D9CDB8' }}
                          className="w-full md:w-40 h-40 rounded-xl flex items-center justify-center flex-shrink-0"
                        >
                          {pattern.preview_image ? (
                            <img 
                              src={`http://127.0.0.1:5000${pattern.preview_image}`}
                              alt={pattern.title}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <span style={{ color: '#6E8594' }} className="text-5xl">📐</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 
                            style={{ color: '#1F2F3A' }}
                            className="text-2xl font-bold mb-3"
                          >
                            {pattern.title}
                          </h3>
                          <p 
                            style={{ color: '#6E8594' }}
                            className="text-base mb-4"
                          >
                            {pattern.description?.substring(0, 200)}...
                          </p>
                          <div 
                            style={{ color: '#6E8594' }}
                            className="text-sm space-y-2"
                          >
                            <div><span className="font-bold">Designer:</span> {pattern.designer_name}</div>
                            <div><span className="font-bold">Category:</span> {pattern.category?.name}</div>
                            <div><span className="font-bold">Difficulty:</span> {pattern.difficulty?.name}</div>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-3">
                          <button
                            onClick={() => handleApprove(pattern.id)}
                            style={{ backgroundColor: '#4CAF50' }}
                            className="flex-1 md:flex-none px-6 py-3 text-white rounded-xl font-bold hover:opacity-90 shadow-lg"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleReject(pattern.id)}
                            style={{ backgroundColor: '#EF5350' }}
                            className="flex-1 md:flex-none px-6 py-3 text-white rounded-xl font-bold hover:opacity-90 shadow-lg"
                          >
                            ✕ Reject
                          </button>
                          <Link
                            to={`/pattern/${pattern.id}`}
                            style={{ backgroundColor: '#5C768A' }}
                            className="flex-1 md:flex-none px-6 py-3 text-white rounded-xl font-bold hover:opacity-90 text-center shadow-lg"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div>
              <h2 
                style={{ color: '#1F2F3A' }}
                className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
              >
                User Management
              </h2>

              <div 
                style={{ backgroundColor: '#8FA9B6' }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#5C768A' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-white font-bold text-base">
                          Username
                        </th>
                        <th className="px-6 py-4 text-left text-white font-bold text-base hidden md:table-cell">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-white font-bold text-base">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-white font-bold text-base">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, index) => (
                        <tr 
                          key={u.id}
                          style={{ 
                            backgroundColor: index % 2 === 0 ? '#8FA9B6' : '#A9BFCA'
                          }}
                          className="hover:opacity-90 transition-opacity"
                        >
                          <td 
                            style={{ color: '#1F2F3A' }}
                            className="px-6 py-5 font-bold"
                          >
                            {u.username}
                          </td>
                          <td 
                            style={{ color: '#6E8594' }}
                            className="px-6 py-5 hidden md:table-cell"
                          >
                            {u.email}
                          </td>
                          <td className="px-6 py-5">
                            <span 
                              style={{ 
                                backgroundColor: u.role === 'admin' ? '#EF5350' : u.role === 'designer' ? '#5C768A' : '#A9BFCA',
                                color: 'white'
                              }}
                              className="px-4 py-2 rounded-full text-sm font-bold capitalize"
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span 
                              style={{ 
                                backgroundColor: u.is_active ? '#4CAF50' : '#EF5350',
                                color: 'white'
                              }}
                              className="px-4 py-2 rounded-full text-sm font-bold"
                            >
                              {u.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  )
}

export default AdminPage