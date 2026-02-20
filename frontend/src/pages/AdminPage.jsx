import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminAPI } from '../services/api'

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 
            style={{ color: '#1F2F3A' }}
            className="text-4xl font-bold mb-2"
          >
            Admin Dashboard
          </h1>
          <p style={{ color: '#6E8594' }}>
            Manage patterns, users, and platform settings
          </p>
        </div>

        {/* STATISTICS CARDS */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-xl p-6 text-center"
            >
              <div 
                style={{ color: '#1F2F3A' }}
                className="text-4xl font-bold mb-2"
              >
                {stats.total_users || 0}
              </div>
              <div style={{ color: '#6E8594' }} className="text-sm">
                Total Users
              </div>
            </div>

            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-xl p-6 text-center"
            >
              <div 
                style={{ color: '#1F2F3A' }}
                className="text-4xl font-bold mb-2"
              >
                {stats.total_patterns || 0}
              </div>
              <div style={{ color: '#6E8594' }} className="text-sm">
                Total Patterns
              </div>
            </div>

            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-xl p-6 text-center"
            >
              <div 
                style={{ color: '#1F2F3A' }}
                className="text-4xl font-bold mb-2"
              >
                {stats.total_downloads || 0}
              </div>
              <div style={{ color: '#6E8594' }} className="text-sm">
                Total Downloads
              </div>
            </div>

            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-xl p-6 text-center"
            >
              <div 
                style={{ color: '#1F2F3A' }}
                className="text-4xl font-bold mb-2"
              >
                {stats.total_views || 0}
              </div>
              <div style={{ color: '#6E8594' }} className="text-sm">
                Total Views
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          
          {/* SIDEBAR */}
          <aside className="w-64 flex-shrink-0">
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-xl p-6 sticky top-4"
            >
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('stats')}
                  style={{ 
                    backgroundColor: activeTab === 'stats' ? '#5C768A' : 'transparent',
                    color: activeTab === 'stats' ? 'white' : '#1F2F3A'
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all"
                >
                  Statistics
                </button>

                <button
                  onClick={() => setActiveTab('pending')}
                  style={{ 
                    backgroundColor: activeTab === 'pending' ? '#5C768A' : 'transparent',
                    color: activeTab === 'pending' ? 'white' : '#1F2F3A'
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all"
                >
                  Pending Patterns
                  {pendingPatterns.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      {pendingPatterns.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  style={{ 
                    backgroundColor: activeTab === 'users' ? '#5C768A' : 'transparent',
                    color: activeTab === 'users' ? 'white' : '#1F2F3A'
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all"
                >
                  Users
                </button>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1">
            
            {/* STATS TAB */}
            {activeTab === 'stats' && (
              <div>
                <h2 
                  style={{ color: '#1F2F3A' }}
                  className="text-3xl font-bold mb-6"
                >
                  Platform Overview
                </h2>

                <div 
                  style={{ backgroundColor: '#8FA9B6' }}
                  className="rounded-xl p-8"
                >
                  <p style={{ color: '#1F2F3A' }}>
                    Welcome to the admin panel, {user?.full_name || user?.username}!
                  </p>
                  <p style={{ color: '#6E8594' }} className="mt-4">
                    Use the sidebar to navigate between different admin functions.
                  </p>
                </div>
              </div>
            )}

            {/* PENDING PATTERNS TAB */}
            {activeTab === 'pending' && (
              <div>
                <h2 
                  style={{ color: '#1F2F3A' }}
                  className="text-3xl font-bold mb-6"
                >
                  Pending Pattern Approvals
                </h2>

                {loading ? (
                  <div className="text-center py-12">
                    <p style={{ color: '#6E8594' }}>Loading...</p>
                  </div>
                ) : pendingPatterns.length === 0 ? (
                  <div 
                    style={{ backgroundColor: '#8FA9B6' }}
                    className="rounded-xl p-8 text-center"
                  >
                    <p style={{ color: '#1F2F3A' }}>
                      No pending patterns to review
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPatterns.map((pattern) => (
                      <div
                        key={pattern.id}
                        style={{ backgroundColor: '#8FA9B6' }}
                        className="rounded-xl p-6"
                      >
                        <div className="flex gap-6">
                          <div 
                            style={{ backgroundColor: '#D9CDB8' }}
                            className="w-32 h-32 rounded-lg flex items-center justify-center flex-shrink-0"
                          >
                            {pattern.preview_image ? (
                              <img 
                                src={`http://127.0.0.1:5000${pattern.preview_image}`}
                                alt={pattern.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span style={{ color: '#6E8594' }} className="text-3xl">
                                📐
                              </span>
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 
                              style={{ color: '#1F2F3A' }}
                              className="text-xl font-bold mb-2"
                            >
                              {pattern.title}
                            </h3>
                            <p 
                              style={{ color: '#6E8594' }}
                              className="text-sm mb-3"
                            >
                              {pattern.description?.substring(0, 150)}...
                            </p>
                            <div 
                              style={{ color: '#6E8594' }}
                              className="text-sm space-y-1"
                            >
                              <div>Designer: {pattern.designer_name}</div>
                              <div>Category: {pattern.category?.name}</div>
                              <div>Difficulty: {pattern.difficulty?.name}</div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleApprove(pattern.id)}
                              style={{ backgroundColor: '#5C768A' }}
                              className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 whitespace-nowrap"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleReject(pattern.id)}
                              style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                              className="px-6 py-2 rounded-lg font-medium hover:opacity-90 whitespace-nowrap"
                            >
                              ✕ Reject
                            </button>
                            <Link
                              to={`/pattern/${pattern.id}`}
                              style={{ backgroundColor: 'transparent', color: '#5C768A', border: '1px solid #5C768A' }}
                              className="px-6 py-2 rounded-lg font-medium hover:opacity-90 text-center whitespace-nowrap"
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
                  className="text-3xl font-bold mb-6"
                >
                  User Management
                </h2>

                <div 
                  style={{ backgroundColor: '#8FA9B6' }}
                  className="rounded-xl overflow-hidden"
                >
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#5C768A' }}>
                      <tr>
                        <th className="px-6 py-3 text-left text-white font-medium">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-white font-medium">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-white font-medium">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-white font-medium">
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
                        >
                          <td 
                            style={{ color: '#1F2F3A' }}
                            className="px-6 py-4 font-medium"
                          >
                            {u.username}
                          </td>
                          <td 
                            style={{ color: '#6E8594' }}
                            className="px-6 py-4"
                          >
                            {u.email}
                          </td>
                          <td 
                            style={{ color: '#1F2F3A' }}
                            className="px-6 py-4 capitalize"
                          >
                            {u.role}
                          </td>
                          <td 
                            style={{ color: u.is_active ? '#2D5F2E' : '#8B0000' }}
                            className="px-6 py-4"
                          >
                            {u.is_active ? 'Active' : 'Inactive'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  )
}

export default AdminPage