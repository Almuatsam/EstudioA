import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, favoritesAPI, downloadsAPI } from '../services/api'
import GenderIcon from '../components/GenderIcon'
import PasswordChangeModal from '../components/PasswordChangeModal'
import ConfirmationModal from '../components/ConfirmationModal'
import Toast from '../components/Toast'
import LoadingSpinner from '../components/LoadingSpinner'

function UserAccountPage() {
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  
  // Profile state
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    gender: ''
  })
  const [originalProfile, setOriginalProfile] = useState({})
  
  // Favorites state
  const [favorites, setFavorites] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  
  // Downloads state
  const [downloads, setDownloads] = useState([])
  const [downloadsLoading, setDownloadsLoading] = useState(false)
  
  // Modal states
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  
  // Toast state
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadUserProfile()
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
      
      // Update user in auth context
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
      // Track download
      await downloadsAPI.trackDownload(pattern.id)
      
      // Download file
      const link = document.createElement('a')
      link.href = `http://127.0.0.1:5000${pattern.pdf_file}`
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
    <div className="min-h-screen bg-pattern-soft">
      
      {/* Account Header Card */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div 
            style={{ backgroundColor: '#8FA9B6' }}
            className="rounded-2xl p-8 md:p-10 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              
              {/* Avatar */}
              <GenderIcon gender={user?.gender} size="large" />
              
              {/* User Info */}
              <div className="flex-1">
                <h2 
                  style={{ color: '#1F2F3A' }}
                  className="text-2xl md:text-3xl font-bold mb-2"
                >
                  {user?.full_name || user?.username}
                </h2>
                <p 
                  style={{ color: '#6E8594' }}
                  className="text-base md:text-lg"
                >
                  {user?.email}
                </p>
              </div>
              
              {/* Edit Button */}
              <button
                onClick={() => setActiveTab('profile')}
                style={{ backgroundColor: '#5C768A' }}
                className="px-6 py-3 text-white rounded-xl font-bold hover:opacity-90 hover:scale-105 transition-all shadow-lg"
              >
                Edit Profile
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          
          <div className="flex flex-row justify-center gap-3 md:gap-4">
            <button
              onClick={() => setActiveTab('profile')}
              style={{ 
                backgroundColor: activeTab === 'profile' ? '#8FA9B6' : 'transparent',
                color: activeTab === 'profile' ? '#1F2F3A' : '#6E8594'
              }}
              className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-xl transition-all hover:opacity-80"
            >
              Profile
            </button>
            
            <button
              onClick={() => setActiveTab('downloads')}
              style={{ 
                backgroundColor: activeTab === 'downloads' ? '#8FA9B6' : 'transparent',
                color: activeTab === 'downloads' ? '#1F2F3A' : '#6E8594'
              }}
              className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-xl transition-all hover:opacity-80"
            >
              Downloads
            </button>
            
            <button
              onClick={() => setActiveTab('favorites')}
              style={{ 
                backgroundColor: activeTab === 'favorites' ? '#8FA9B6' : 'transparent',
                color: activeTab === 'favorites' ? '#1F2F3A' : '#6E8594'
              }}
              className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-xl transition-all hover:opacity-80"
            >
              Favorites
            </button>
          </div>

        </div>
      </section>

      {/* Tab Content */}
      <section className="px-4 md:px-6 lg:px-8 pb-16 md:pb-20">
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-2xl p-8 md:p-10 shadow-lg"
            >
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-2xl md:text-3xl font-bold mb-8"
              >
                Edit Your Profile
              </h3>

              {/* Full Name */}
              <div className="mb-6">
                <label 
                  style={{ color: '#1F2F3A' }}
                  className="block text-sm font-medium mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                  style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Email */}
              <div className="mb-6">
                <label 
                  style={{ color: '#1F2F3A' }}
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Gender */}
              <div className="mb-6">
                <label 
                  style={{ color: '#1F2F3A' }}
                  className="block text-sm font-medium mb-2"
                >
                  Gender
                </label>
                <select
                  value={profileData.gender}
                  onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                  style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Change Password Button */}
              <div className="mb-8">
                <label 
                  style={{ color: '#1F2F3A' }}
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <button
                  onClick={() => setPasswordModalOpen(true)}
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #5C768A',
                    color: '#5C768A'
                  }}
                  className="w-full px-6 py-3 rounded-lg font-bold hover:opacity-80 transition-all"
                >
                  Change Password
                </button>
              </div>

              {/* Save Changes Button */}
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                style={{ backgroundColor: '#5C768A' }}
                className="w-full md:w-auto mx-auto block px-10 py-4 text-white rounded-xl font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        )}

        {/* DOWNLOADS TAB */}
        {activeTab === 'downloads' && (
          <div className="max-w-7xl mx-auto">
            
            <h2 
              style={{ color: '#1F2F3A' }}
              className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
            >
              My Downloads
            </h2>

            {downloadsLoading ? (
              <div className="py-20">
                <LoadingSpinner size="large" text="Loading downloads..." />
              </div>
            ) : downloads.length === 0 ? (
              <div 
                style={{ backgroundColor: '#8FA9B6' }}
                className="rounded-2xl p-16 text-center shadow-lg"
              >
                <div className="text-6xl mb-4">📥</div>
                <p 
                  style={{ color: '#6E8594' }}
                  className="text-xl mb-6"
                >
                  No Downloads Yet
                </p>
                <p 
                  style={{ color: '#6E8594' }}
                  className="mb-6"
                >
                  Start exploring patterns!
                </p>
                <Link
                  to="/browse"
                  style={{ backgroundColor: '#5C768A' }}
                  className="inline-block px-8 py-4 text-white rounded-xl font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg"
                >
                  Browse Patterns
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {downloads.map((pattern) => (
                  <div
                    key={pattern.id}
                    style={{ backgroundColor: '#8FA9B6' }}
                    className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all"
                  >
                    {/* Image */}
                    <div 
                      style={{ backgroundColor: '#D9CDB8' }}
                      className="h-56 md:h-64 flex items-center justify-center"
                    >
                      {pattern.preview_image ? (
                        <img 
                          src={`http://127.0.0.1:5000${pattern.preview_image}`}
                          alt={pattern.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6E8594" strokeWidth="2">
                          <path d="M3 3h18v18H3z"/>
                          <path d="M9 9h6v6H9z"/>
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 
                        style={{ color: '#1F2F3A' }}
                        className="font-bold text-lg mb-2"
                      >
                        {pattern.title}
                      </h3>
                      <p 
                        style={{ color: '#6E8594' }}
                        className="text-sm mb-2"
                      >
                        {pattern.category?.name}
                      </p>
                      <p 
                        style={{ color: '#6E8594' }}
                        className="text-xs mb-4"
                      >
                        Downloaded: {new Date(pattern.downloaded_at).toLocaleDateString()}
                      </p>

                      {/* Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleDownloadAgain(pattern)}
                          style={{ backgroundColor: '#5C768A' }}
                          className="w-full px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-all"
                        >
                          Download Again
                        </button>
                        <Link
                          to={`/pattern/${pattern.id}`}
                          style={{ 
                            backgroundColor: 'transparent',
                            border: '1px solid #5C768A',
                            color: '#5C768A'
                          }}
                          className="block w-full px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-all text-center"
                        >
                          View Pattern
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
          <div className="max-w-7xl mx-auto">
            
            <h2 
              style={{ color: '#1F2F3A' }}
              className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
            >
              My Favorites
            </h2>

            {favoritesLoading ? (
              <div className="py-20">
                <LoadingSpinner size="large" text="Loading favorites..." />
              </div>
            ) : favorites.length === 0 ? (
              <div 
                style={{ backgroundColor: '#8FA9B6' }}
                className="rounded-2xl p-16 text-center shadow-lg"
              >
                <div className="text-6xl mb-4">❤️</div>
                <p 
                  style={{ color: '#6E8594' }}
                  className="text-xl mb-6"
                >
                  No Favorites Yet
                </p>
                <p 
                  style={{ color: '#6E8594' }}
                  className="mb-6"
                >
                  Save patterns you love!
                </p>
                <Link
                  to="/browse"
                  style={{ backgroundColor: '#5C768A' }}
                  className="inline-block px-8 py-4 text-white rounded-xl font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg"
                >
                  Browse Patterns
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {favorites.map((pattern) => (
                  <div
                    key={pattern.id}
                    style={{ backgroundColor: '#8FA9B6' }}
                    className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all"
                  >
                    {/* Image */}
                    <div 
                      style={{ backgroundColor: '#D9CDB8' }}
                      className="h-56 md:h-64 flex items-center justify-center"
                    >
                      {pattern.preview_image ? (
                        <img 
                          src={`http://127.0.0.1:5000${pattern.preview_image}`}
                          alt={pattern.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6E8594" strokeWidth="2">
                          <path d="M3 3h18v18H3z"/>
                          <path d="M9 9h6v6H9z"/>
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 
                        style={{ color: '#1F2F3A' }}
                        className="font-bold text-lg mb-2"
                      >
                        {pattern.title}
                      </h3>
                      <p 
                        style={{ color: '#6E8594' }}
                        className="text-sm mb-4"
                      >
                        {pattern.category?.name}
                      </p>

                      {/* Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleRemoveFavorite(pattern.id)}
                          style={{ backgroundColor: '#EF5350' }}
                          className="w-full px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-all"
                        >
                          Remove from Favorites
                        </button>
                        <Link
                          to={`/pattern/${pattern.id}`}
                          style={{ 
                            backgroundColor: 'transparent',
                            border: '1px solid #5C768A',
                            color: '#5C768A'
                          }}
                          className="block w-full px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-all text-center"
                        >
                          View Pattern
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

      {/* Toast */}
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