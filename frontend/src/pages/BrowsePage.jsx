import LoadingSpinner from '../components/LoadingSpinner'
import FlipCard from '../components/FlipCard'
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { patternsAPI } from '../services/api'

function BrowsePage() {
  const [searchParams] = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [patterns, setPatterns] = useState([])
  const [categories, setCategories] = useState([])
  const [difficulties, setDifficulties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
    loadDifficulties()
    loadPatterns()
  }, [selectedCategory, selectedDifficulty, searchQuery])

  const loadCategories = async () => {
    try {
      const data = await patternsAPI.getCategories()
      setCategories(data.categories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadDifficulties = async () => {
    try {
      const data = await patternsAPI.getDifficulties()
      setDifficulties(data.difficulties)
    } catch (error) {
      console.error('Failed to load difficulties:', error)
    }
  }

  const loadPatterns = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedCategory) params.category_id = selectedCategory
      if (selectedDifficulty) params.difficulty_id = selectedDifficulty
      
      const data = await patternsAPI.getPatterns(params)
      setPatterns(data.patterns || [])
    } catch (error) {
      console.error('Failed to load patterns:', error)
      setPatterns([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        setLoading(true)
        const data = await patternsAPI.searchPatterns(searchQuery)
        setPatterns(data.patterns || [])
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    } else {
      loadPatterns()
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDifficulty('')
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        
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
            {loading ? 'Loading...' : `Showing ${patterns.length} patterns`}
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
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Pattern name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleSearch}
                  style={{ backgroundColor: '#5C768A' }}
                  className="w-full mt-2 py-2 text-white rounded-lg text-sm hover:opacity-90"
                >
                  Search
                </button>
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
            {loading ? (
              <div className="py-20">
                <LoadingSpinner size="large" text="Loading patterns..." />
              </div>
            ) : patterns.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: '#6E8594' }}>No patterns found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patterns.map((pattern) => (
                  <FlipCard key={pattern.id} pattern={pattern} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  )
}

export default BrowsePage