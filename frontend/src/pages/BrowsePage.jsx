import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

function BrowsePage() {
  const [searchParams] = useSearchParams()
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [patterns, setPatterns] = useState([])

  // Categories and difficulties
  const categories = [
    { id: 1, name: 'Dresses' },
    { id: 2, name: 'Tops & Blouses' },
    { id: 3, name: 'Bottoms' },
    { id: 4, name: 'Outerwear' },
    { id: 5, name: 'Accessories' },
    { id: 6, name: 'Sleepwear' },
    { id: 7, name: 'Activewear' },
    { id: 8, name: 'Childrenswear' },
  ]

  const difficulties = [
    { id: 1, name: 'Beginner' },
    { id: 2, name: 'Easy' },
    { id: 3, name: 'Intermediate' },
    { id: 4, name: 'Advanced' },
    { id: 5, name: 'Expert' },
  ]

  // Placeholder patterns - we'll connect to API later
  const placeholderPatterns = [
    { id: 1, title: 'Blue Summer Dress', category: 'Dresses', difficulty: 'Easy', downloads: 245 },
    { id: 2, title: 'Formal Evening Gown', category: 'Dresses', difficulty: 'Advanced', downloads: 198 },
    { id: 3, title: 'Casual T-Shirt', category: 'Tops & Blouses', difficulty: 'Beginner', downloads: 312 },
    { id: 4, title: 'Winter Coat', category: 'Outerwear', difficulty: 'Expert', downloads: 156 },
    { id: 5, title: 'Cotton Blouse', category: 'Tops & Blouses', difficulty: 'Intermediate', downloads: 287 },
    { id: 6, title: 'Denim Jeans', category: 'Bottoms', difficulty: 'Advanced', downloads: 203 },
  ]

  useEffect(() => {
    // For now, just use placeholder data
    // Later we'll fetch from API
    setPatterns(placeholderPatterns)
  }, [])

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDifficulty('')
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 
            style={{ color: '#1F2F3A' }}
            className="text-4xl font-bold"
          >
            All Patterns
          </h1>
          <span 
            style={{ color: '#6E8594' }}
            className="text-lg"
          >
            Showing {patterns.length} patterns
          </span>
        </div>

        <div className="flex gap-8">
          
          {/* FILTER SIDEBAR */}
          <aside className="w-64 flex-shrink-0">
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="p-6 rounded-xl sticky top-4"
            >
              <h2 
                style={{ color: '#1F2F3A' }}
                className="text-xl font-bold mb-6"
              >
                Filters
              </h2>

              {/* Search Input */}
              <div className="mb-6">
                <label 
                  style={{ color: '#1F2F3A' }}
                  className="block text-sm font-medium mb-2"
                >
                  🔍 Search
                </label>
                <input
                  type="text"
                  placeholder="Pattern name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label 
                  style={{ color: '#1F2F3A' }}
                  className="block text-sm font-medium mb-2"
                >
                  Category
                </label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={selectedCategory == cat.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      <span style={{ color: '#1F2F3A' }} className="text-sm">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <label 
                  style={{ color: '#1F2F3A' }}
                  className="block text-sm font-medium mb-2"
                >
                  Difficulty
                </label>
                <div className="space-y-2">
                  {difficulties.map((diff) => (
                    <label key={diff.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        value={diff.id}
                        checked={selectedDifficulty == diff.id}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="mr-2"
                      />
                      <span style={{ color: '#1F2F3A' }} className="text-sm">
                        {diff.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={handleClearFilters}
                style={{ backgroundColor: '#5C768A' }}
                className="w-full py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Clear All Filters
              </button>

            </div>
          </aside>

          {/* PATTERN GRID */}
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {patterns.map((pattern) => (
                <Link
                  key={pattern.id}
                  to={`/pattern/${pattern.id}`}
                  style={{ backgroundColor: '#8FA9B6' }}
                  className="rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                >
                  {/* Image Placeholder */}
                  <div 
                    style={{ backgroundColor: '#D9CDB8' }}
                    className="h-48 flex items-center justify-center"
                  >
                    <span style={{ color: '#6E8594' }} className="text-5xl">
                      📐
                    </span>
                  </div>

                  {/* Pattern Info */}
                  <div className="p-4">
                    <h3 
                      style={{ color: '#1F2F3A' }}
                      className="font-bold text-lg mb-2"
                    >
                      {pattern.title}
                    </h3>
                    <div 
                      style={{ color: '#6E8594' }}
                      className="text-sm mb-2"
                    >
                      {pattern.category}
                    </div>
                    <div 
                      style={{ color: '#6E8594' }}
                      className="text-sm flex items-center justify-between"
                    >
                      <span>⭐ {pattern.difficulty}</span>
                      <span>📥 {pattern.downloads}</span>
                    </div>
                  </div>
                </Link>
              ))}

            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <button
                style={{ backgroundColor: '#5C768A' }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                ←
              </button>
              <button
                style={{ backgroundColor: '#5C768A' }}
                className="px-4 py-2 text-white rounded-lg font-bold"
              >
                1
              </button>
              <button
                style={{ backgroundColor: '#8FA9B6' }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                2
              </button>
              <button
                style={{ backgroundColor: '#8FA9B6' }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                3
              </button>
              <button
                style={{ backgroundColor: '#5C768A' }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                →
              </button>
            </div>

          </main>

        </div>

      </div>
    </div>
  )
}

export default BrowsePage