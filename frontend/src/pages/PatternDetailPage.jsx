import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { patternsAPI, recommendationsAPI, favoritesAPI } from '../services/api'
import { PatternPlaceholder, Heart, HeartSolid } from '../components/Icons'
import './PatternDetailPage.css'

// Module-level set persists across StrictMode remounts, preventing double view counts
const viewedPatterns = new Set()

function PatternDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [pattern, setPattern] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    loadPattern()
    loadRecommendations()
    if (!viewedPatterns.has(id)) {
      viewedPatterns.add(id)
      patternsAPI.trackView(id).catch(() => {})
    }
  }, [id])

  useEffect(() => {
    if (isAuthenticated) {
      favoritesAPI.checkFavorite(id)
        .then(data => setIsFavorited(data.is_favorited))
        .catch(() => {})
    }
  }, [id, isAuthenticated])

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || favoriteLoading) return
    setFavoriteLoading(true)
    try {
      if (isFavorited) {
        await favoritesAPI.removeFavorite(id)
        setIsFavorited(false)
      } else {
        await favoritesAPI.addFavorite(id)
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const loadPattern = async () => {
    try {
      setLoading(true)
      const data = await patternsAPI.getPattern(id)
      setPattern(data.pattern)
    } catch (error) {
      console.error('Failed to load pattern:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecommendations = async () => {
    try {
      const data = await recommendationsAPI.getPatternRecommendations(id, 4)
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    }
  }

  const handleDownload = () => {
    if (pattern?.pdf_file) {
      const link = document.createElement('a')
      link.href = `http://127.0.0.1:5000${pattern.pdf_file}`
      link.download = `${pattern.title}.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('PDF file not available')
    }
  }

  if (loading) {
    return (
      <div className="pattern-detail-loading">
        <LoadingSpinner size="large" text="Loading pattern..." />
      </div>
    )
  }

  if (!pattern) {
    return (
      <div className="pattern-detail-not-found">
        <div className="pattern-detail-not-found-content">
          <h1 className="h1 mb-4">Pattern Not Found</h1>
          <p className="body text-secondary mb-6">The pattern you're looking for doesn't exist.</p>
          <Link to="/browse">
            <Button variant="primary">Back to Browse</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pattern-detail-page">
      <div className="pattern-detail-container">
        
        <Link to="/browse" className="pattern-detail-back">
          ← Back to Patterns
        </Link>

        <div className="pattern-detail-content">
          
          {/* Image Section */}
          <div className="pattern-detail-image-section">
            <div className="pattern-detail-image">
              {pattern.preview_image ? (
                <img 
                  src={`http://127.0.0.1:5000${pattern.preview_image}`}
                  alt={pattern.title}
                />
              ) : (
                <div className="pattern-detail-image-placeholder">
                  <PatternPlaceholder width={48} height={48} />
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="pattern-detail-info">
            <h1 className="display-2 mb-4">{pattern.title}</h1>

            <div className="pattern-detail-meta">
              <div className="pattern-detail-meta-item">
                <span className="pattern-detail-meta-label">Category:</span>
                <span className="pattern-detail-meta-value">{pattern.category?.name || 'Uncategorized'}</span>
              </div>

              <div className="pattern-detail-meta-item">
                <span className="pattern-detail-meta-label">Difficulty:</span>
                <span className="pattern-detail-meta-value">{pattern.difficulty?.name || 'N/A'}</span>
              </div>

              <div className="pattern-detail-meta-item">
                <span className="pattern-detail-meta-label">Designer:</span>
                <span className="pattern-detail-meta-value">{pattern.designer_name || 'Unknown'}</span>
              </div>
            </div>

            {/* Tags */}
            {pattern.tags && pattern.tags.length > 0 && (
              <div className="pattern-detail-tags">
                <span className="pattern-detail-meta-label">Tags:</span>
                <div className="pattern-detail-tags-list">
                  {pattern.tags.map((tag, index) => (
                    <span key={index} className="pattern-detail-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="pattern-detail-stats">
              <span className="body-small text-secondary">
                {pattern.download_count || 0} Downloads
              </span>
              <span className="body-small text-secondary">•</span>
              <span className="body-small text-secondary">
                {pattern.view_count || 0} Views
              </span>
            </div>

            {/* Actions */}
            <div className="pattern-detail-actions">
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={handleDownload}
              >
                Download PDF Pattern
              </Button>

              {isAuthenticated && (
                <button
                  className={`pattern-detail-favorite-btn ${isFavorited ? 'favorited' : ''}`}
                  onClick={handleFavoriteToggle}
                  disabled={favoriteLoading}
                  aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
                >
                  {isFavorited
                    ? <HeartSolid width={22} height={22} />
                    : <Heart width={22} height={22} />
                  }
                  <span>{isFavorited ? 'Saved' : 'Save to Favorites'}</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Description */}
        {pattern.description && (
          <div className="pattern-detail-description">
            <h2 className="h2 mb-4">Description</h2>
            <p className="body">{pattern.description}</p>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="pattern-detail-recommendations">
            <h2 className="h2 mb-2">Similar Patterns You Might Like</h2>
            <p className="body text-secondary mb-6">AI-Powered Recommendations</p>

            <div className="pattern-detail-recommendations-grid">
              {recommendations.map((rec) => (
                <Link
                  key={rec.id}
                  to={`/pattern/${rec.id}`}
                  className="pattern-detail-recommendation-card"
                >
                  <div className="pattern-detail-recommendation-image">
                    {rec.preview_image ? (
                      <img 
                        src={`http://127.0.0.1:5000${rec.preview_image}`}
                        alt={rec.title}
                      />
                    ) : (
                      <PatternPlaceholder width={48} height={48} />
                    )}
                  </div>

                  <div className="pattern-detail-recommendation-content">
                    <h3 className="h4">{rec.title}</h3>
                    <p className="body-small text-secondary">
                      {rec.difficulty?.name || 'N/A'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default PatternDetailPage