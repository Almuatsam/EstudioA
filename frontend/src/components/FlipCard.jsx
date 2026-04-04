import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { favoritesAPI } from '../services/api'
import { PatternPlaceholder, Heart, HeartSolid } from './Icons'
import './FlipCard.css'

function FlipCard({ pattern }) {
  const { isAuthenticated } = useAuth()
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      favoritesAPI.checkFavorite(pattern.id)
        .then(data => setIsFavorited(data.is_favorited))
        .catch(() => {})
    }
  }, [pattern.id, isAuthenticated])

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated || favoriteLoading) return
    setFavoriteLoading(true)
    try {
      if (isFavorited) {
        await favoritesAPI.removeFavorite(pattern.id)
        setIsFavorited(false)
      } else {
        await favoritesAPI.addFavorite(pattern.id)
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsFlipped(true)
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setIsFlipped(false)
    }
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    if (pattern.pdf_file) {
      const link = document.createElement('a')
      link.href = `http://127.0.0.1:5000${pattern.pdf_file}`
      link.download = `${pattern.title}.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('PDF file not available for this pattern')
    }
  }

  return (
    <div 
      className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flip-card">
        
        {/* FRONT FACE */}
        <div className="flip-card-front">
          <div className="flip-card-image-container">
            {pattern.preview_image ? (
              <img
                src={`http://127.0.0.1:5000${pattern.preview_image}`}
                alt={pattern.title}
                className="flip-card-image"
              />
            ) : (
              <div className="flip-card-placeholder">
                <PatternPlaceholder width={48} height={48} />
              </div>
            )}
            <div className="flip-card-image-overlay"></div>
          </div>

          <div className="flip-card-content">
            <h3 className="flip-card-title">{pattern.title}</h3>
            
            <div className="flip-card-meta">
              <span className="flip-card-badge flip-card-badge-category">
                {pattern.category?.name || 'Uncategorized'}
              </span>
              <span className="flip-card-badge flip-card-badge-difficulty">
                {pattern.difficulty?.name || 'Intermediate'}
              </span>
            </div>
            
            <div className="flip-card-stats">
              <span className="flip-card-stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8s2-4 7-4 7 4 7 4-2 4-7 4-7-4-7-4z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {pattern.view_count || 0}
              </span>
              <span className="flip-card-stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v10M4 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {pattern.download_count || 0}
              </span>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="flip-card-back">
          <div className="flip-card-back-content">
            <h4 className="flip-card-back-title">Pattern Details</h4>
            
            <p className="flip-card-description">
              {pattern.description || 'No description available.'}
            </p>
            
            <div className="flip-card-back-meta">
              <div className="flip-card-designer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>{pattern.designer_name || 'Unknown Designer'}</span>
              </div>
              
              <div className="flip-card-back-stats">
                <span>{pattern.view_count || 0} views</span>
                <span>•</span>
                <span>{pattern.download_count || 0} downloads</span>
              </div>
            </div>
            
            <div className="flip-card-actions">
              <Link
                to={`/pattern/${pattern.id}`}
                className="flip-card-btn flip-card-btn-primary"
                onClick={(e) => e.stopPropagation()}
              >
                View Details
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>

              <button
                onClick={handleDownload}
                className="flip-card-btn flip-card-btn-secondary"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v10M4 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Download PDF
              </button>

              {isAuthenticated && (
                <button
                  className={`flip-card-btn flip-card-btn-favorite ${isFavorited ? 'favorited' : ''}`}
                  onClick={handleFavoriteToggle}
                  disabled={favoriteLoading}
                  aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
                >
                  {isFavorited
                    ? <HeartSolid width={16} height={16} />
                    : <Heart width={16} height={16} />
                  }
                  {isFavorited ? 'Saved' : 'Save to Favorites'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {!isFlipped && (
        <div className="flip-card-hint">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Tap to flip</span>
        </div>
      )}
    </div>
  )
}

export default FlipCard