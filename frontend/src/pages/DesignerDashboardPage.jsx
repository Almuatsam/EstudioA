import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { patternsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function DesignerDashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [myPatterns, setMyPatterns] = useState([])
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalDownloads: 0,
    totalViews: 0,
    approvedPatterns: 0,
    pendingPatterns: 0,
    rejectedPatterns: 0
  })

  useEffect(() => {
    loadMyPatterns()
  }, [])

  const loadMyPatterns = async () => {
    try {
      setLoading(true)
      const data = await patternsAPI.getMyPatterns()
      setMyPatterns(data.patterns || [])
      
      // Calculate stats
      const approved = data.patterns.filter(p => p.is_approved).length
      const pending = data.patterns.filter(p => !p.is_approved && p.is_active).length
      const rejected = data.patterns.filter(p => !p.is_active).length
      const totalDownloads = data.patterns.reduce((sum, p) => sum + (p.download_count || 0), 0)
      const totalViews = data.patterns.reduce((sum, p) => sum + (p.view_count || 0), 0)
      
      setStats({
        totalUploads: data.patterns.length,
        totalDownloads,
        totalViews,
        approvedPatterns: approved,
        pendingPatterns: pending,
        rejectedPatterns: rejected
      })
    } catch (error) {
      console.error('Failed to load patterns:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for charts
  const downloadsOverTime = [
    { month: 'Jan', downloads: 12 },
    { month: 'Feb', downloads: 19 },
    { month: 'Mar', downloads: 25 },
    { month: 'Apr', downloads: 31 },
    { month: 'May', downloads: 38 },
    { month: 'Jun', downloads: 45 }
  ]

  const viewsOverTime = [
    { month: 'Jan', views: 45 },
    { month: 'Feb', views: 62 },
    { month: 'Mar', views: 78 },
    { month: 'Apr', views: 95 },
    { month: 'May', views: 112 },
    { month: 'Jun', views: 134 }
  ]

  const topPatterns = myPatterns
    .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
    .slice(0, 5)
    .map(p => ({
      name: p.title.substring(0, 15) + '...',
      downloads: p.download_count || 0
    }))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pattern-soft">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pattern-soft">
      
      {/* Hero Section - Extra spacious */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 md:mb-16">
            <div>
              <h1 
                style={{ color: '#1F2F3A' }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3"
              >
                Designer Dashboard
              </h1>
              <p 
                style={{ color: '#6E8594' }}
                className="text-lg md:text-xl"
              >
                Welcome back, {user?.full_name || user?.username}!
              </p>
            </div>
            <Link
              to="/upload"
              style={{ backgroundColor: '#5C768A' }}
              className="px-8 md:px-10 py-4 md:py-5 text-white rounded-xl font-bold text-lg md:text-xl hover:opacity-90 transition-all hover:scale-105 shadow-lg text-center"
            >
              + Upload Pattern
            </Link>
          </div>

          {/* Summary Cards - More spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-2xl p-8 md:p-10 shadow-lg hover:scale-105 transition-all"
            >
              <div 
                style={{ color: '#6E8594' }}
                className="text-sm md:text-base font-medium mb-3"
              >
                Total Uploads
              </div>
              <div 
                style={{ color: '#1F2F3A' }}
                className="text-5xl md:text-6xl font-bold mb-3"
              >
                {stats.totalUploads}
              </div>
              <div style={{ color: '#6E8594' }} className="text-sm">
                {stats.approvedPatterns} approved • {stats.pendingPatterns} pending
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
                {stats.totalDownloads}
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
                {stats.totalViews}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Charts Section - More breathing room */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <h2 
            style={{ color: '#1F2F3A' }}
            className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
          >
            Analytics Overview
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            
            {/* Downloads Over Time */}
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-2xl p-6 md:p-8 shadow-lg hover:scale-105 transition-all"
            >
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl md:text-2xl font-bold mb-6"
              >
                Downloads Over Time
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={downloadsOverTime}>
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
                  <Line 
                    type="monotone" 
                    dataKey="downloads" 
                    stroke="#5C768A" 
                    strokeWidth={4}
                    dot={{ fill: '#5C768A', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Views Over Time */}
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-2xl p-6 md:p-8 shadow-lg hover:scale-105 transition-all"
            >
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl md:text-2xl font-bold mb-6"
              >
                Views Over Time
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={viewsOverTime}>
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
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#5C768A" 
                    fill="#A9BFCA"
                    fillOpacity={0.6}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </section>

      {/* Most Popular Patterns Chart */}
      {topPatterns.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-2xl p-6 md:p-8 shadow-lg"
            >
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl md:text-2xl font-bold mb-6 text-center"
              >
                Most Popular Patterns
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topPatterns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#A9BFCA" />
                  <XAxis dataKey="name" stroke="#6E8594" style={{ fontSize: '14px' }} />
                  <YAxis stroke="#6E8594" style={{ fontSize: '14px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#E9DDC9', 
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                  />
                  <Bar dataKey="downloads" fill="#5C768A" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>
      )}

      {/* My Uploads Table Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          
          <h2 
            style={{ color: '#1F2F3A' }}
            className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
          >
            My Uploads
          </h2>

          <div 
            style={{ backgroundColor: '#8FA9B6' }}
            className="rounded-2xl p-6 md:p-8 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <span style={{ color: '#6E8594' }} className="text-base md:text-lg">
                {myPatterns.length} patterns
              </span>
            </div>

            {myPatterns.length === 0 ? (
              <div className="text-center py-16 md:py-20">
                <p style={{ color: '#6E8594' }} className="text-lg md:text-xl mb-6">
                  You haven't uploaded any patterns yet
                </p>
                <Link
                  to="/upload"
                  style={{ backgroundColor: '#5C768A' }}
                  className="inline-block px-8 py-4 text-white rounded-xl font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg"
                >
                  Upload Your First Pattern
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#5C768A' }}>
                      <th className="px-4 md:px-6 py-4 text-left text-white font-bold text-sm md:text-base">
                        Pattern
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-white font-bold text-sm md:text-base hidden md:table-cell">
                        Category
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-white font-bold text-sm md:text-base">
                        Status
                      </th>
                      <th className="px-4 md:px-6 py-4 text-center text-white font-bold text-sm md:text-base hidden sm:table-cell">
                        Downloads
                      </th>
                      <th className="px-4 md:px-6 py-4 text-center text-white font-bold text-sm md:text-base hidden sm:table-cell">
                        Views
                      </th>
                      <th className="px-4 md:px-6 py-4 text-center text-white font-bold text-sm md:text-base">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {myPatterns.map((pattern, index) => (
                      <tr 
                        key={pattern.id}
                        style={{ 
                          backgroundColor: index % 2 === 0 ? '#8FA9B6' : '#A9BFCA'
                        }}
                        className="hover:opacity-90 transition-opacity"
                      >
                        <td className="px-4 md:px-6 py-5">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div 
                              style={{ backgroundColor: '#D9CDB8' }}
                              className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                            >
                              {pattern.preview_image ? (
                                <img 
                                  src={`http://127.0.0.1:5000${pattern.preview_image}`}
                                  alt={pattern.title}
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                <span style={{ color: '#6E8594' }} className="text-2xl">📐</span>
                              )}
                            </div>
                            <div>
                              <div 
                                style={{ color: '#1F2F3A' }}
                                className="font-bold text-sm md:text-base mb-1"
                              >
                                {pattern.title}
                              </div>
                              <div 
                                style={{ color: '#6E8594' }}
                                className="text-xs md:text-sm"
                              >
                                {pattern.difficulty?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-5 hidden md:table-cell">
                          <span 
                            style={{ color: '#1F2F3A' }}
                            className="text-sm md:text-base"
                          >
                            {pattern.category?.name}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-5">
                          {pattern.is_approved ? (
                            <span 
                              style={{ backgroundColor: '#4CAF50', color: 'white' }}
                              className="px-3 py-1.5 rounded-full text-xs md:text-sm font-bold inline-block"
                            >
                              ✓ Approved
                            </span>
                          ) : pattern.is_active ? (
                            <span 
                              style={{ backgroundColor: '#FFA726', color: 'white' }}
                              className="px-3 py-1.5 rounded-full text-xs md:text-sm font-bold inline-block"
                            >
                              ⏳ Pending
                            </span>
                          ) : (
                            <span 
                              style={{ backgroundColor: '#EF5350', color: 'white' }}
                              className="px-3 py-1.5 rounded-full text-xs md:text-sm font-bold inline-block"
                            >
                              ✕ Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-4 md:px-6 py-5 text-center hidden sm:table-cell">
                          <span 
                            style={{ color: '#1F2F3A' }}
                            className="font-bold text-base md:text-lg"
                          >
                            {pattern.download_count || 0}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-5 text-center hidden sm:table-cell">
                          <span 
                            style={{ color: '#1F2F3A' }}
                            className="font-bold text-base md:text-lg"
                          >
                            {pattern.view_count || 0}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-5 text-center">
                          <Link
                            to={`/pattern/${pattern.id}`}
                            style={{ backgroundColor: '#5C768A' }}
                            className="inline-block px-4 py-2 text-white rounded-lg text-sm font-bold hover:opacity-90"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}

export default DesignerDashboardPage