import LoadingSpinner from '../components/LoadingSpinner'
import FlipCard from '../components/FlipCard'
import Button from '../components/Button'
import Input from '../components/Input'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { patternsAPI } from '../services/api'
import './BrowsePage.css'

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
  }, [])

  useEffect(() => {
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
      if (searchQuery.trim()) {
        // Use fuzzy + semantic AI search endpoint
        const data = await patternsAPI.searchPatterns(searchQuery.trim())
        setPatterns(data.patterns || [])
      } else {
        // No search query — use regular filtered listing
        const params = {}
        if (selectedCategory) params.category_id = selectedCategory
        if (selectedDifficulty) params.difficulty_id = selectedDifficulty
        const data = await patternsAPI.getPatterns(params)
        setPatterns(data.patterns || [])
      }
    } catch (error) {
      console.error('Failed to load patterns:', error)
      setPatterns([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => loadPatterns()

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDifficulty('')
  }

  return (
    <div className="browse-page">
      <div className="browse-container">
        
        <div className="browse-header">
          <h1 className="h1">All Patterns</h1>
          <span className="body text-secondary">
            {loading ? 'Loading...' : `${patterns.length} patterns`}
          </span>
        </div>

        <div className="browse-content">
          
          {/* FILTER SIDEBAR */}
          <aside className="browse-sidebar">
            <div className="browse-filters">
              <h2 className="h3 mb-6">Filters</h2>

              {/* Search Input */}
              <div className="browse-filter-group">
                <Input
                  label="Search"
                  type="text"
                  placeholder="Pattern name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  variant="primary"
                  size="small"
                  fullWidth
                  onClick={handleSearch}
                  className="mt-2"
                >
                  Search
                </Button>
              </div>

              {/* Category Filter */}
              <div className="browse-filter-group">
                <label className="input-label">Category</label>
                <div className="browse-filter-options">
                  {categories.map((cat) => (
                    <label key={cat.id} className="browse-filter-option">
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={selectedCategory == cat.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="browse-filter-group">
                <label className="input-label">Difficulty</label>
                <div className="browse-filter-options">
                  {difficulties.map((diff) => (
                    <label key={diff.id} className="browse-filter-option">
                      <input
                        type="radio"
                        name="difficulty"
                        value={diff.id}
                        checked={selectedDifficulty == diff.id}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      />
                      <span>{diff.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="secondary"
                size="small"
                fullWidth
                onClick={handleClearFilters}
              >
                Clear All Filters
              </Button>

            </div>
          </aside>

          {/* PATTERN GRID */}
          <main className="browse-main">
            {loading ? (
              <div className="browse-loading">
                <LoadingSpinner size="large" text="Loading patterns..." />
              </div>
            ) : patterns.length === 0 ? (
              <div className="browse-empty">
                <p className="body text-secondary">No patterns found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="browse-grid">
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