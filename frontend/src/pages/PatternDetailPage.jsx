import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { patternsAPI, recommendationsAPI } from '../services/api'

function PatternDetailPage() {
  const { id } = useParams()
  const [pattern, setPattern] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPattern()
    loadRecommendations()
  }, [id])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: '#6E8594' }}>Loading pattern...</p>
      </div>
    )
  }

  if (!pattern) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p style={{ color: '#6E8594' }} className="mb-4">Pattern not found</p>
          <Link to="/browse" style={{ color: '#5C768A' }}>
            ← Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        
        <Link
          to="/browse"
          style={{ color: '#6E8594' }}
          className="inline-flex items-center mb-6 hover:opacity-70 transition-opacity"
        >
          ← Back to Patterns
        </Link>

        <div 
          style={{ backgroundColor: '#8FA9B6' }}
          className="rounded-xl overflow-hidden mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8 p-8">
            
            <div>
              <div 
                style={{ backgroundColor: '#D9CDB8' }}
                className="rounded-xl h-96 flex items-center justify-center overflow-hidden"
              >
                {pattern.preview_image ? (
                  <img 
                    src={`http://127.0.0.1:5000${pattern.preview_image}`}
                    alt={pattern.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span style={{ color: '#6E8594' }} className="text-8xl">
                    📐
                  </span>
                )}
              </div>
            </div>

            <div>
              <h1 
                style={{ color: '#1F2F3A' }}
                className="text-4xl font-bold mb-4"
              >
                {pattern.title}
              </h1>

              <div className="space-y-3 mb-6">
                <div>
                  <span 
                    style={{ color: '#6E8594' }}
                    className="text-sm font-medium"
                  >
                    Category:
                  </span>
                  <span 
                    style={{ color: '#1F2F3A' }}
                    className="ml-2"
                  >
                    {pattern.category?.name || 'Uncategorized'}
                  </span>
                </div>

                <div>
                  <span 
                    style={{ color: '#6E8594' }}
                    className="text-sm font-medium"
                  >
                    Difficulty:
                  </span>
                  <span 
                    style={{ color: '#1F2F3A' }}
                    className="ml-2"
                  >
                    {pattern.difficulty?.name || 'N/A'}
                  </span>
                </div>

                <div>
                  <span 
                    style={{ color: '#6E8594' }}
                    className="text-sm font-medium"
                  >
                    Designer:
                  </span>
                  <span 
                    style={{ color: '#1F2F3A' }}
                    className="ml-2"
                  >
                    {pattern.designer_name || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {pattern.tags && pattern.tags.length > 0 && (
                <div className="mb-6">
                  <span 
                    style={{ color: '#6E8594' }}
                    className="text-sm font-medium block mb-2"
                  >
                    Tags:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pattern.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{ backgroundColor: '#A9BFCA', color: '#1F2F3A' }}
                        className="px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-6 mb-6">
                <div>
                  <span style={{ color: '#6E8594' }} className="text-sm">
                    {pattern.download_count || 0} Downloads
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6E8594' }} className="text-sm">
                    {pattern.view_count || 0} Views
                  </span>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => {
                  if (pattern.pdf_file) {
                    window.open(`http://127.0.0.1:5000${pattern.pdf_file}`, '_blank')
                  } else {
                    alert('PDF file not available')
                  }
                }}
                style={{ backgroundColor: '#5C768A' }}
                className="w-full py-4 text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Download PDF Pattern
              </button>

            </div>
          </div>
        </div>

        {/* Description */}
        {pattern.description && (
          <div 
            style={{ backgroundColor: '#8FA9B6' }}
            className="rounded-xl p-8 mb-8"
          >
            <h2 
              style={{ color: '#1F2F3A' }}
              className="text-2xl font-bold mb-4"
            >
              Description
            </h2>
            <p 
              style={{ color: '#1F2F3A' }}
              className="leading-relaxed"
            >
              {pattern.description}
            </p>
          </div>
        )}

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 
              style={{ color: '#1F2F3A' }}
              className="text-3xl font-bold mb-2"
            >
              Similar Patterns You Might Like
            </h2>
            <p 
              style={{ color: '#6E8594' }}
              className="mb-6"
            >
              AI-Powered Recommendations
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <Link
                  key={rec.id}
                  to={`/pattern/${rec.id}`}
                  style={{ backgroundColor: '#8FA9B6' }}
                  className="rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <div 
                    style={{ backgroundColor: '#D9CDB8' }}
                    className="h-40 flex items-center justify-center"
                  >
                    {rec.preview_image ? (
                      <img 
                        src={`http://127.0.0.1:5000${rec.preview_image}`}
                        alt={rec.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span style={{ color: '#6E8594' }} className="text-4xl">
                        📐
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 
                      style={{ color: '#1F2F3A' }}
                      className="font-bold mb-2"
                    >
                      {rec.title}
                    </h3>
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
          </div>
        )}

      </div>
    </div>
  )
}

export default PatternDetailPage