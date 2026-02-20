import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { recommendationsAPI, patternsAPI } from '../services/api'

function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('recommendations')
  const [recommendations, setRecommendations] = useState([])
  const [myPatterns, setMyPatterns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
    loadMyPatterns()
  }, [])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      const data = await recommendationsAPI.getPersonalRecommendations(6)
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMyPatterns = async () => {
    try {
      // TODO: Add endpoint to get user's patterns
      // For now, just empty array
      setMyPatterns([])
    } catch (error) {
      console.error('Failed to load patterns:', error)
    }
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 
            style={{ color: '#1F2F3A' }}
            className="text-4xl font-bold mb-2"
          >
            Welcome back, {user?.full_name || user?.username}!
          </h1>
          <p style={{ color: '#6E8594' }}>
            Your personalized pattern dashboard
          </p>
        </div>

        <div className="flex gap-8">
          
          {/* SIDEBAR */}
          <aside className="w-64 flex-shrink-0">
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-xl p-6 sticky top-4"
            >
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('recommendations')}
                  style={{ 
                    backgroundColor: activeTab === 'recommendations' ? '#5C768A' : 'transparent',
                    color: activeTab === 'recommendations' ? 'white' : '#1F2F3A'
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all"
                >
                  For You
                </button>
                
                <button
                  onClick={() => setActiveTab('downloads')}
                  style={{ 
                    backgroundColor: activeTab === 'downloads' ? '#5C768A' : 'transparent',
                    color: activeTab === 'downloads' ? 'white' : '#1F2F3A'
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all"
                >
                  My Downloads
                </button>

                <button
                  onClick={() => setActiveTab('uploads')}
                  style={{ 
                    backgroundColor: activeTab === 'uploads' ? '#5C768A' : 'transparent',
                    color: activeTab === 'uploads' ? 'white' : '#1F2F3A'
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all"
                >
                  My Uploads
                </button>

                <Link
                  to="/browse"
                  style={{ backgroundColor: 'transparent', color: '#1F2F3A' }}
                  className="block w-full text-left px-4 py-3 rounded-lg font-medium hover:bg-opacity-50 transition-all"
                >
                  Browse All
                </Link>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1">
            
            {/* FOR YOU TAB */}
            {activeTab === 'recommendations' && (
              <div>
                <div className="mb-6">
                  <h2 
                    style={{ color: '#1F2F3A' }}
                    className="text-3xl font-bold mb-2"
                  >
                    Recommended For You
                  </h2>
                  <p style={{ color: '#6E8594' }}>
                    AI-powered suggestions based on your interests
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <p style={{ color: '#6E8594' }}>Loading recommendations...</p>
                  </div>
                ) : recommendations.length === 0 ? (
                  <div 
                    style={{ backgroundColor: '#8FA9B6' }}
                    className="rounded-xl p-8 text-center"
                  >
                    <p style={{ color: '#1F2F3A' }} className="mb-4">
                      No recommendations yet. Start exploring patterns to get personalized suggestions!
                    </p>
                    <Link
                      to="/browse"
                      style={{ backgroundColor: '#5C768A' }}
                      className="inline-block px-6 py-3 text-white rounded-lg font-medium hover:opacity-90"
                    >
                      Browse Patterns
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec) => (
                      <Link
                        key={rec.id}
                        to={`/pattern/${rec.id}`}
                        style={{ backgroundColor: '#8FA9B6' }}
                        className="rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <div 
                          style={{ backgroundColor: '#D9CDB8' }}
                          className="h-48 flex items-center justify-center"
                        >
                          {rec.preview_image ? (
                            <img 
                              src={`http://127.0.0.1:5000${rec.preview_image}`}
                              alt={rec.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span style={{ color: '#6E8594' }} className="text-5xl">
                              📐
                            </span>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 
                            style={{ color: '#1F2F3A' }}
                            className="font-bold text-lg mb-2"
                          >
                            {rec.title}
                          </h3>
                          <div 
                            style={{ color: '#6E8594' }}
                            className="text-sm mb-2"
                          >
                            {rec.category?.name || 'Uncategorized'}
                          </div>
                          <div 
                            style={{ color: '#6E8594' }}
                            className="text-sm"
                          >
                            {rec.difficulty?.name || 'N/A'}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MY DOWNLOADS TAB */}
            {activeTab === 'downloads' && (
              <div>
                <div className="mb-6">
                  <h2 
                    style={{ color: '#1F2F3A' }}
                    className="text-3xl font-bold mb-2"
                  >
                    My Downloads
                  </h2>
                  <p style={{ color: '#6E8594' }}>
                    Patterns you've downloaded
                  </p>
                </div>

                <div 
                  style={{ backgroundColor: '#8FA9B6' }}
                  className="rounded-xl p-8 text-center"
                >
                  <p style={{ color: '#1F2F3A' }}>
                    Download history will appear here once you download patterns
                  </p>
                </div>
              </div>
            )}

            {/* MY UPLOADS TAB */}
            {activeTab === 'uploads' && (
              <div>
                <div className="mb-6">
                  <h2 
                    style={{ color: '#1F2F3A' }}
                    className="text-3xl font-bold mb-2"
                  >
                    My Uploads
                  </h2>
                  <p style={{ color: '#6E8594' }}>
                    Patterns you've shared with the community
                  </p>
                </div>

                {myPatterns.length === 0 ? (
                  <div 
                    style={{ backgroundColor: '#8FA9B6' }}
                    className="rounded-xl p-8 text-center"
                  >
                    <p style={{ color: '#1F2F3A' }} className="mb-4">
                      You haven't uploaded any patterns yet
                    </p>
                    <button
                      style={{ backgroundColor: '#5C768A' }}
                      className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90"
                    >
                      Upload Your First Pattern
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myPatterns.map((pattern) => (
                      <div
                        key={pattern.id}
                        style={{ backgroundColor: '#8FA9B6' }}
                        className="rounded-xl p-6 flex items-center justify-between"
                      >
                        <div>
                          <h3 
                            style={{ color: '#1F2F3A' }}
                            className="font-bold text-lg mb-1"
                          >
                            {pattern.title}
                          </h3>
                          <p style={{ color: '#6E8594' }} className="text-sm">
                            {pattern.is_approved ? 'Approved' : 'Pending Review'}
                          </p>
                        </div>
                        <Link
                          to={`/pattern/${pattern.id}`}
                          style={{ backgroundColor: '#5C768A' }}
                          className="px-4 py-2 text-white rounded-lg text-sm hover:opacity-90"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  )
}

export default DashboardPage