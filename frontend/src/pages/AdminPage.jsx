import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import Toast from '../components/Toast'
import { PatternPlaceholder, Users, Clock, Download, Heart } from '../components/Icons'
import './AdminPage.css'

const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://127.0.0.1:5000'

function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState(null)
  const [pendingPatterns, setPendingPatterns] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)       // 'downloads' | 'favorites' | null
  const [modalData, setModalData] = useState([])
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/')
      return
    }
    loadAdminData()
  }, [isAuthenticated, user])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      
      const [statsData, patternsData, usersData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getPendingPatterns(),
        adminAPI.getUsers()
      ])
      
      setStats(statsData.stats)
      setPendingPatterns(patternsData.patterns || [])
      setUsers(usersData.users || [])
    } catch (error) {
      console.error('Failed to load admin data:', error)
      showToast('Failed to load admin data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const openModal = async (type) => {
    setModal(type)
    setModalData([])
    setModalLoading(true)
    try {
      if (type === 'downloads') {
        const data = await adminAPI.getDownloadsDetails()
        setModalData(data.downloads || [])
      } else {
        const data = await adminAPI.getFavoritesDetails()
        setModalData(data.favorites || [])
      }
    } catch (e) {
      console.error('Failed to load modal data:', e)
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => {
    setModal(null)
    setModalData([])
  }

  const handleApprovePattern = async (patternId) => {
    try {
      await adminAPI.approvePattern(patternId)
      setPendingPatterns(pendingPatterns.filter(p => p.id !== patternId))
      showToast('Pattern approved successfully!', 'success')
      loadAdminData()
    } catch (error) {
      console.error('Failed to approve pattern:', error)
      showToast('Failed to approve pattern', 'error')
    }
  }

  const handleRejectPattern = async (patternId) => {
    try {
      await adminAPI.rejectPattern(patternId)
      setPendingPatterns(pendingPatterns.filter(p => p.id !== patternId))
      showToast('Pattern rejected', 'success')
      loadAdminData()
    } catch (error) {
      console.error('Failed to reject pattern:', error)
      showToast('Failed to reject pattern', 'error')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }
    
    try {
      await adminAPI.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
      showToast('User deleted successfully', 'success')
      loadAdminData()
    } catch (error) {
      console.error('Failed to delete user:', error)
      showToast('Failed to delete user', 'error')
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <LoadingSpinner size="large" text="Loading admin panel..." />
      </div>
    )
  }

  return (
    <div className="admin-page">
      
      <div className="admin-header">
        <h1 className="display-2">Admin Dashboard</h1>
        <p className="body-large text-secondary">Platform Management & Analytics</p>
      </div>

      {/* STATS SECTION */}
      <section className="admin-stats-section">
        <div className="admin-stats-grid">
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon"><Users width={28} height={28} /></div>
            <div className="admin-stat-content">
              <div className="admin-stat-value">{stats?.total_users || 0}</div>
              <div className="admin-stat-label">Total Users</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon"><PatternPlaceholder width={28} height={28} /></div>
            <div className="admin-stat-content">
              <div className="admin-stat-value">{stats?.total_patterns || 0}</div>
              <div className="admin-stat-label">Total Patterns</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon"><Clock width={28} height={28} /></div>
            <div className="admin-stat-content">
              <div className="admin-stat-value">{stats?.pending_patterns || 0}</div>
              <div className="admin-stat-label">Pending Approval</div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card--clickable" onClick={() => openModal('downloads')}>
            <div className="admin-stat-icon"><Download width={28} height={28} /></div>
            <div className="admin-stat-content">
              <div className="admin-stat-value">{stats?.total_downloads || 0}</div>
              <div className="admin-stat-label">Total Downloads</div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card--clickable" onClick={() => openModal('favorites')}>
            <div className="admin-stat-icon"><Heart width={28} height={28} /></div>
            <div className="admin-stat-content">
              <div className="admin-stat-value">{stats?.total_favorites || 0}</div>
              <div className="admin-stat-label">Total Favorites</div>
            </div>
          </div>

        </div>
      </section>

      {/* PENDING PATTERNS SECTION */}
      <section className="admin-section">
        <h2 className="h1 mb-6">Pending Pattern Approvals</h2>

        {pendingPatterns.length === 0 ? (
          <div className="admin-empty">
            <p className="body text-secondary">No patterns pending approval</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pattern</th>
                  <th>Designer</th>
                  <th>Category</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingPatterns.map((pattern) => (
                  <tr key={pattern.id}>
                    <td>
                      <div className="admin-table-pattern">
                        <div className="admin-table-pattern-image">
                          {pattern.preview_image ? (
                            <img 
                              src={`${BACKEND_URL}${pattern.preview_image}`}
                              alt={pattern.title}
                            />
                          ) : (
                            <PatternPlaceholder width={32} height={32} />
                          )}
                        </div>
                        <span className="admin-table-pattern-title">{pattern.title}</span>
                      </div>
                    </td>
                    <td>{pattern.designer_name}</td>
                    <td>{pattern.category?.name || 'N/A'}</td>
                    <td>{new Date(pattern.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-table-actions">
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleApprovePattern(pattern.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleRejectPattern(pattern.id)}
                        >
                          Reject
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

      {/* USERS SECTION */}
      <section className="admin-section">
        <h2 className="h1 mb-6">User Management</h2>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`admin-role-badge admin-role-${u.role}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    {u.id !== user?.id && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* DETAIL MODAL */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="h2">
                {modal === 'downloads' ? 'Download Details' : 'Favorite Details'}
              </h2>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="admin-modal-body">
              {modalLoading ? (
                <div className="admin-modal-loading">
                  <LoadingSpinner size="medium" text="Loading..." />
                </div>
              ) : modalData.length === 0 ? (
                <p className="body text-secondary" style={{ textAlign: 'center', padding: '2rem' }}>
                  No records found.
                </p>
              ) : (
                <div className="admin-table-container" style={{ boxShadow: 'none', padding: 0 }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Pattern</th>
                        <th>{modal === 'downloads' ? 'Downloaded At' : 'Favorited At'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalData.map((row, i) => (
                        <tr key={i}>
                          <td>{row.user_name}</td>
                          <td>{row.user_email}</td>
                          <td>{row.pattern_title}</td>
                          <td>
                            {new Date(modal === 'downloads' ? row.downloaded_at : row.created_at)
                              .toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminPage