import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { designerAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import Toast from '../components/Toast'
import './DesignerDashboardPage.css'

function DesignerDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState(null)
  const [patterns, setPatterns] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'designer') {
      navigate('/')
      return
    }
    loadDashboardData()
  }, [isAuthenticated, user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [statsData, patternsData] = await Promise.all([
        designerAPI.getStats(),
        designerAPI.getMyPatterns()
      ])
      
      setStats(statsData.stats)
      setPatterns(patternsData.patterns || [])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      showToast('Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const handleDeletePattern = async (patternId) => {
    if (!window.confirm('Are you sure you want to delete this pattern?')) {
      return
    }
    
    try {
      await designerAPI.deletePattern(patternId)
      setPatterns(patterns.filter(p => p.id !== patternId))
      showToast('Pattern deleted successfully', 'success')
      loadDashboardData()
    } catch (error) {
      console.error('Failed to delete pattern:', error)
      showToast('Failed to delete pattern', 'error')
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'designer-status-approved'
      case 'pending':
        return 'designer-status-pending'
      case 'rejected':
        return 'designer-status-rejected'
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="designer-loading">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="designer-page">
      
      <div className="designer-header">
        <div>
          <h1 className="display-2">Designer Dashboard</h1>
          <p className="body-large text-secondary">Manage your patterns and track performance</p>
        </div>
        <Link to="/upload">
          <Button variant="primary" size="large">
            Upload New Pattern
          </Button>
        </Link>
      </div>

      {/* STATS SECTION */}
      <section className="designer-stats-section">
        <div className="designer-stats-grid">
          
          <div className="designer-stat-card">
            <div className="designer-stat-icon">📐</div>
            <div className="designer-stat-content">
              <div className="designer-stat-value">{stats?.total_patterns || 0}</div>
              <div className="designer-stat-label">Total Patterns</div>
            </div>
          </div>

          <div className="designer-stat-card">
            <div className="designer-stat-icon">✅</div>
            <div className="designer-stat-content">
              <div className="designer-stat-value">{stats?.approved_patterns || 0}</div>
              <div className="designer-stat-label">Approved</div>
            </div>
          </div>

          <div className="designer-stat-card">
            <div className="designer-stat-icon">⏳</div>
            <div className="designer-stat-content">
              <div className="designer-stat-value">{stats?.pending_patterns || 0}</div>
              <div className="designer-stat-label">Pending</div>
            </div>
          </div>

          <div className="designer-stat-card">
            <div className="designer-stat-icon">📥</div>
            <div className="designer-stat-content">
              <div className="designer-stat-value">{stats?.total_downloads || 0}</div>
              <div className="designer-stat-label">Downloads</div>
            </div>
          </div>

        </div>
      </section>

      {/* MY PATTERNS SECTION */}
      <section className="designer-section">
        <h2 className="h1 mb-6">My Patterns</h2>

        {patterns.length === 0 ? (
          <div className="designer-empty">
            <div className="designer-empty-icon">📐</div>
            <h3 className="h2 mb-4">No Patterns Yet</h3>
            <p className="body text-secondary mb-6">Upload your first pattern to get started!</p>
            <Link to="/upload">
              <Button variant="primary" size="large">
                Upload Pattern
              </Button>
            </Link>
          </div>
        ) : (
          <div className="designer-table-container">
            <table className="designer-table">
              <thead>
                <tr>
                  <th>Pattern</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Downloads</th>
                  <th>Views</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patterns.map((pattern) => (
                  <tr key={pattern.id}>
                    <td>
                      <div className="designer-table-pattern">
                        <div className="designer-table-pattern-image">
                          {pattern.preview_image ? (
                            <img 
                              src={`http://127.0.0.1:5000${pattern.preview_image}`}
                              alt={pattern.title}
                            />
                          ) : (
                            <span>📐</span>
                          )}
                        </div>
                        <span className="designer-table-pattern-title">{pattern.title}</span>
                      </div>
                    </td>
                    <td>{pattern.category?.name || 'N/A'}</td>
                    <td>
                      <span className={`designer-status-badge ${getStatusBadgeClass(pattern.status)}`}>
                        {pattern.status}
                      </span>
                    </td>
                    <td>{pattern.download_count || 0}</td>
                    <td>{pattern.view_count || 0}</td>
                    <td>{new Date(pattern.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="designer-table-actions">
                        {pattern.status === 'approved' && (
                          <Link to={`/pattern/${pattern.id}`}>
                            <Button variant="primary" size="small">
                              View
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleDeletePattern(pattern.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  )
}

export default DesignerDashboardPage