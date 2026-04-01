import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import './HomePage.css'

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?search=${searchQuery}`)
    }
  }

  return (
    <div className="home-page">
      
      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="container container-narrow">
          
          <h1 className="display-1 text-center mb-6">
            Discover Beautiful
            <br />
            <span className="home-hero-accent">Sewing Patterns</span>
          </h1>
          
          <p className="body-large text-center text-secondary mb-10">
            AI-powered search to find the perfect pattern for your next creation
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="home-search-form">
            <Input
              type="text"
              placeholder="Search for dress patterns, blouses, accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="primary" 
              size="large"
            >
              Search
            </Button>
          </form>

          {/* Action Buttons */}
          <div className="home-hero-actions">
            <Link to="/browse">
              <Button variant="primary" size="large" fullWidth>
                Browse All Patterns
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="secondary" size="large" fullWidth>
                Upload Your Pattern
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="home-section">
        <div className="container">
          
          <h2 className="h1 text-center mb-4">Browse by Category</h2>
          <p className="body-large text-center text-secondary mb-12">
            Find exactly what you're looking for
          </p>

          <div className="home-categories-grid">
            {[
              { name: 'Dresses', id: 1, icon: '👗' },
              { name: 'Tops & Blouses', id: 2, icon: '👚' },
              { name: 'Bottoms', id: 3, icon: '👖' },
              { name: 'Outerwear', id: 4, icon: '🧥' },
              { name: 'Accessories', id: 5, icon: '👜' },
              { name: 'Sleepwear', id: 6, icon: '🛏️' },
              { name: 'Activewear', id: 7, icon: '🏃' },
              { name: 'Childrenswear', id: 8, icon: '👶' },
            ].map((category) => (
              <Link
                key={category.id}
                to={`/browse?category=${category.id}`}
                className="home-category-card"
              >
                <span className="home-category-icon">{category.icon}</span>
                <span className="home-category-name">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING PATTERNS SECTION */}
      <section className="home-section home-trending">
        <div className="container">
          
          <h2 className="h1 text-center mb-4">Most Popular This Week</h2>
          <p className="body-large text-center text-secondary mb-12">
            See what the community is loving
          </p>

          <div className="home-trending-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="home-trending-card">
                <div className="home-trending-image">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h18v18H3z"/>
                    <path d="M9 9h6v6H9z"/>
                  </svg>
                </div>
                
                <div className="home-trending-content">
                  <h3 className="h4">Pattern Title {item}</h3>
                  <div className="home-trending-meta">
                    <span>Easy</span>
                    <span className="home-trending-downloads">
                      {120 - item * 10} downloads
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/browse">
              <Button variant="primary" size="large">
                View All Patterns
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* AI FEATURES SECTION */}
      <section className="home-section">
        <div className="container">
          
          <h2 className="h1 text-center mb-4">Smart Features for Sewers</h2>
          <p className="body-large text-center text-secondary mb-12">
            Powered by artificial intelligence
          </p>

          <div className="home-features-grid">
            
            <div className="home-feature-card">
              <div className="home-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <h3 className="h3 mb-4">Smart Search</h3>
              <p className="body">
                Find patterns even with typos using AI-powered fuzzy matching and NLP
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2v20M2 12h20"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
              <h3 className="h3 mb-4">AI Recommendations</h3>
              <p className="body">
                Get personalized pattern suggestions based on your interests and history
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h3 className="h3 mb-4">Easy Uploads</h3>
              <p className="body">
                Share your patterns with the community and help fellow sewers
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default HomePage