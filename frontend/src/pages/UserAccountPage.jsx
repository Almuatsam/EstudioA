import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, favoritesAPI, downloadsAPI } from '../services/api'
import GenderIcon from '../components/GenderIcon'
import PasswordChangeModal from '../components/PasswordChangeModal'
import ConfirmationModal from '../components/ConfirmationModal'
import Toast from '../components/Toast'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import Input from '../components/Input'
import { PatternPlaceholder, Download, Heart } from '../components/Icons'
import './UserAccountPage.css'

const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://127.0.0.1:5000'

function UserAccountPage() {
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    gender: ''
  })
  const [originalProfile, setOriginalProfile] = useState({})
  
  const [favorites, setFavorites] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  
  const [downloads, setDownloads] = useState([])
  const [downloadsLoading, setDownloadsLoading] = useState(false)
  
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadUserProfile()
  }, [])

  useEffect(() => {
    if (activeTab === 'favorites') {
      loadFavorites()
    } else if (activeTab === 'downloads') {
      loadDownloads()
    }
  }, [activeTab])

  const loadUserProfile = async () => {
    try {
      const data = await userAPI.getProfile()
      const profile = {
        full_name: data.user.full_name || '',
        email: data.user.email || '',
        gender: data.user.gender || ''
      }
      setProfileData(profile)
      setOriginalProfile(profile)
    } catch (error) {
      console.error('Failed to load profile:', error)
      showToast('Failed to load profile', 'error')
    }
  }

  const loadFavorites = async () => {
    try {
      setFavoritesLoading(true)
      const data = await favoritesAPI.getFavorites()
      setFavorites(data.favorites || [])
    } catch (error) {
      console.error('Failed to load favorites:', error)
      showToast('Failed to load favorites', 'error')
    } finally {
      setFavoritesLoading(false)
    }
  }

  const loadDownloads = async () => {
    try {
      setDownloadsLoading(true)
      const data = await downloadsAPI.getHistory()
      setDownloads(data.downloads || [])
    } catch (error) {
      console.error('Failed to load downloads:', error)
      showToast('Failed to load downloads', 'error')
    } finally {
      setDownloadsLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const getChanges = () => {
    const changes = []
    if (profileData.full_name !== originalProfile.full_name) {
      changes.push(`Full Name: ${originalProfile.full_name} → ${profileData.full_name}`)
    }
    if (profileData.email !== originalProfile.email) {
      changes.push(`Email: ${originalProfile.email} → ${profileData.email}`)
    }
    if (profileData.gender !== originalProfile.gender) {
      const genderMap = { male: 'Male', female: 'Female', other: 'Other', '': 'Not specified' }
      changes.push(`Gender: ${genderMap[originalProfile.gender] || 'Not specified'} → ${genderMap[profileData.gender] || 'Not specified'}`)
    }
    return changes
  }

  const handleSaveProfile = () => {
    const changes = getChanges()
    if (changes.length === 0) {
      showToast('No changes to save', 'warning')
      return
    }
    setConfirmModalOpen(true)
  }

  const confirmSaveProfile = async () => {
    try {
      setLoading(true)
      await userAPI.updateProfile(profileData)
      setOriginalProfile(profileData)
      
      if (setUser) {
        setUser(prev => ({ ...prev, ...profileData }))
      }
      
      showToast('Profile updated successfully!', 'success')
    } catch (error) {
      console.error('Failed to update profile:', error)
      showToast(error.response?.data?.error || 'Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (patternId) => {
    try {
      await favoritesAPI.removeFavorite(patternId)
      setFavorites(favorites.filter(f => f.id !== patternId))
      showToast('Removed from favorites', 'success')
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      showToast('Failed to remove favorite', 'error')
    }
  }

  const handleDownloadAgain = async (pattern) => {
    try {
      await downloadsAPI.trackDownload(pattern.id)
      
      const link = document.createElement('a')
      link.href = `${BACKEND_URL}${pattern.pdf_file}`
      link.download = `${pattern.title}.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      showToast('Download started!', 'success')
    } catch (error) {
      console.error('Download failed:', error)
      showToast('Download failed', 'error')
    }
  }

  return (
    <div className="account-page">
      
      {/* Header Card */}
      <section className="account-header-section">
        <div className="account-header-card">
          <div className="account-header-content">
            
            <GenderIcon gender={user?.gender} size="large" />
            
            <div className="account-header-info">
              <h2 className="h1">{user?.full_name || user?.username}</h2>
              <p className="body text-secondary">{user?.email}</p>
            </div>
            
            <Button
              variant="primary"
              size="medium"
              onClick={() => setActiveTab('profile')}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="account-tabs-section">
        <div className="account-tabs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`account-tab ${activeTab === 'profile' ? 'account-tab-active' : ''}`}
          >
            Profile
          </button>
          
          <button
            onClick={() => setActiveTab('downloads')}
            className={`account-tab ${activeTab === 'downloads' ? 'account-tab-active' : ''}`}
          >
            Downloads
          </button>
          
          <button
            onClick={() => setActiveTab('favorites')}
            className={`account-tab ${activeTab === 'favorites' ? 'account-tab-active' : ''}`}
          >
            Favorites
          </button>
        </div>
      </section>

      {/* Tab Content */}
      <section className="account-content-section">
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="account-profile">
            <div className="account-card">
              <h3 className="h2 mb-8">Edit Your Profile</h3>

              <div className="account-form">
                <Input
                  label="Full Name"
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                />

                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />

                <div className="input-container">
                  <label className="input-label">Gender</label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                    className="input"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="account-password-section">
                  <label className="input-label">Password</label>
                  <Button
                    variant="secondary"
                    size="medium"
                    fullWidth
                    onClick={() => setPasswordModalOpen(true)}
                  >
                    Change Password
                  </Button>
                </div>

                <Button
                  variant="primary"
                  size="large"
                  onClick={handleSaveProfile}
                  loading={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* DOWNLOADS TAB */}
        {activeTab === 'downloads' && (
          <div className="account-downloads">
            <h2 className="h1 mb-8 text-center">My Downloads</h2>

            {downloadsLoading ? (
              <div className="account-loading">
                <LoadingSpinner size="large" text="Loading downloads..." />
              </div>
            ) : downloads.length === 0 ? (
              <div className="account-empty">
                <div className="account-empty-icon"><Download width={48} height={48} /></div>
                <h3 className="h2 mb-4">No Downloads Yet</h3>
                <p className="body text-secondary mb-6">Start exploring patterns!</p>
                <Link to="/browse">
                  <Button variant="primary" size="large">
                    Browse Patterns
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="account-grid">
                {downloads.map((pattern, i) => (
                  <div key={`${pattern.id}-${i}`} className="account-pattern-card">
                    <div className="account-pattern-image">
                      {pattern.preview_image ? (
                        <img 
                          src={`${BACKEND_URL}${pattern.preview_image}`}
                          alt={pattern.title}
                        />
                      ) : (
                        <PatternPlaceholder width={40} height={40} />
                      )}
                    </div>

                    <div className="account-pattern-content">
                      <h3 className="h4">{pattern.title}</h3>
                      <p className="body-small text-secondary mb-2">
                        {pattern.category?.name}
                      </p>
                      <p className="caption text-muted mb-4">
                        Downloaded: {new Date(pattern.downloaded_at).toLocaleDateString()}
                      </p>

                      <div className="account-pattern-actions">
                        <Button
                          variant="primary"
                          size="small"
                          fullWidth
                          onClick={() => handleDownloadAgain(pattern)}
                        >
                          Download Again
                        </Button>
                        <Link to={`/pattern/${pattern.id}`}>
                          <Button variant="secondary" size="small" fullWidth>
                            View Pattern
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="account-favorites">
            <h2 className="h1 mb-8 text-center">My Favorites</h2>

            {favoritesLoading ? (
              <div className="account-loading">
                <LoadingSpinner size="large" text="Loading favorites..." />
              </div>
            ) : favorites.length === 0 ? (
              <div className="account-empty">
                <div className="account-empty-icon"><Heart width={48} height={48} /></div>
                <h3 className="h2 mb-4">No Favorites Yet</h3>
                <p className="body text-secondary mb-6">Save patterns you love!</p>
                <Link to="/browse">
                  <Button variant="primary" size="large">
                    Browse Patterns
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="account-grid">
                {favorites.map((pattern) => (
                  <div key={pattern.id} className="account-pattern-card">
                    <div className="account-pattern-image">
                      {pattern.preview_image ? (
                        <img 
                          src={`${BACKEND_URL}${pattern.preview_image}`}
                          alt={pattern.title}
                        />
                      ) : (
                        <PatternPlaceholder width={40} height={40} />
                      )}
                    </div>

                    <div className="account-pattern-content">
                      <h3 className="h4">{pattern.title}</h3>
                      <p className="body-small text-secondary mb-4">
                        {pattern.category?.name}
                      </p>

                      <div className="account-pattern-actions">
                        <Button
                          variant="primary"
                          size="small"
                          fullWidth
                          onClick={() => handleRemoveFavorite(pattern.id)}
                        >
                          Remove from Favorites
                        </Button>
                        <Link to={`/pattern/${pattern.id}`}>
                          <Button variant="secondary" size="small" fullWidth>
                            View Pattern
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </section>

      {/* Modals */}
      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={(msg) => showToast(msg, 'success')}
        onError={(msg) => showToast(msg, 'error')}
      />

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmSaveProfile}
        title="Confirm Changes"
        message="Are you sure you want to update your profile information?"
        changes={getChanges()}
        confirmText="Yes, Save Changes"
      />

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

export default UserAccountPage