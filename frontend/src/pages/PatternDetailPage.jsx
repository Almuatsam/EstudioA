import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function PatternDetailPage() {
  const { id } = useParams()
  const [pattern, setPattern] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  const placeholderPatterns = {
    1: {
      id: 1,
      title: 'Blue Summer Dress',
      description: 'A light and breezy dress perfect for warm weather and casual occasions. Features a flattering A-line silhouette with adjustable straps and side pockets.',
      category: { id: 1, name: 'Dresses' },
      difficulty: { id: 2, name: 'Easy' },
      designer_name: 'Sarah Johnson',
      tags: ['summer', 'casual', 'blue', 'dress'],
      download_count: 245,
      view_count: 1024,
      pdf_file: 'blue-summer-dress.pdf'
    },
    2: {
      id: 2,
      title: 'Formal Evening Gown',
      description: 'Elegant formal dress for special occasions and evening events. Floor-length with intricate beading and a fitted bodice.',
      category: { id: 1, name: 'Dresses' },
      difficulty: { id: 4, name: 'Advanced' },
      designer_name: 'Emma Williams',
      tags: ['formal', 'evening', 'gown', 'special occasion'],
      download_count: 198,
      view_count: 856,
      pdf_file: 'evening-gown.pdf'
    },
    3: {
      id: 3,
      title: 'Casual T-Shirt',
      description: 'Simple everyday t-shirt pattern for comfortable daily wear. Perfect for beginners learning basic construction techniques.',
      category: { id: 2, name: 'Tops & Blouses' },
      difficulty: { id: 1, name: 'Beginner' },
      designer_name: 'Mike Chen',
      tags: ['casual', 'shirt', 'everyday', 'basic'],
      download_count: 312,
      view_count: 1453,
      pdf_file: 'tshirt.pdf'
    }
  }

  const placeholderRecommendations = [
    { id: 2, title: 'Formal Evening Gown', difficulty: 'Advanced' },
    { id: 3, title: 'Casual T-Shirt', difficulty: 'Beginner' },
    { id: 4, title: 'Winter Coat', difficulty: 'Expert' },
    { id: 5, title: 'Cotton Blouse', difficulty: 'Intermediate' },
  ]

  useEffect(() => {
    const foundPattern = placeholderPatterns[id] || placeholderPatterns[1]
    setPattern(foundPattern)
    setRecommendations(placeholderRecommendations)
  }, [id])

  if (!pattern) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: '#6E8594' }}>Loading pattern...</p>
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
                className="rounded-xl h-96 flex items-center justify-center"
              >
                <span style={{ color: '#6E8594' }} className="text-8xl">
                  📐
                </span>
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
                    {pattern.category.name}
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
                    {pattern.difficulty.name}
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
                    {pattern.designer_name}
                  </span>
                </div>
              </div>

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

              <div className="flex gap-6 mb-6">
                <div>
                  <span style={{ color: '#6E8594' }} className="text-sm">
                    {pattern.download_count} Downloads
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6E8594' }} className="text-sm">
                    {pattern.view_count} Views
                  </span>
                </div>
              </div>

              <button
                style={{ backgroundColor: '#5C768A' }}
                className="w-full py-4 text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Download PDF Pattern
              </button>

            </div>
          </div>
        </div>

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
                  <span style={{ color: '#6E8594' }} className="text-4xl">
                    📐
                  </span>
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
                    {rec.difficulty}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default PatternDetailPage