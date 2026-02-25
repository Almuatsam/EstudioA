import { Link } from 'react-router-dom'
import { useState } from 'react'

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${searchQuery}`
    }
  }

  return (
    <div className="min-h-screen bg-pattern-soft">
      
      {/* HERO SECTION - Extra spacious */}
      <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          
          <h1 
            style={{ color: '#1F2F3A' }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight"
          >
            Discover Beautiful
            <br />
            <span style={{ color: '#5C768A' }}>Sewing Patterns</span>
          </h1>
          
          <p 
            style={{ color: '#6E8594' }}
            className="text-xl md:text-2xl mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            AI-powered search to find the perfect pattern for your next creation
          </p>

          {/* Search Bar - Larger and more prominent */}
          <form onSubmit={handleSearch} className="mb-10 md:mb-12">
            <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto shadow-lg">
              <input
                type="text"
                placeholder="Search for dress patterns, blouses, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ backgroundColor: '#FFFFFF', color: '#1F2F3A', border: '2px solid #A9BFCA' }}
                className="flex-1 px-6 md:px-8 py-4 md:py-5 rounded-lg text-lg md:text-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
              />
              <button
                type="submit"
                style={{ backgroundColor: '#5C768A' }}
                className="px-8 md:px-12 py-4 md:py-5 text-white rounded-lg font-bold text-lg md:text-xl hover:opacity-90 hover:scale-105 transition-all shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          {/* Action Buttons - More prominent */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center max-w-2xl mx-auto">
            <Link
              to="/browse"
              style={{ backgroundColor: '#5C768A' }}
              className="px-10 md:px-12 py-4 md:py-5 text-white rounded-lg font-bold text-lg md:text-xl hover:opacity-90 hover:scale-105 transition-all text-center shadow-lg"
            >
              Browse All Patterns
            </Link>
            <Link
              to="/upload"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '3px solid #5C768A',
                color: '#5C768A'
              }}
              className="px-10 md:px-12 py-4 md:py-5 rounded-lg font-bold text-lg md:text-xl hover:opacity-80 hover:scale-105 transition-all text-center shadow-lg"
            >
              Upload Your Pattern
            </Link>
          </div>

        </div>
      </section>

      {/* CATEGORIES SECTION - More spacing and visual interest */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          
          <h2 
            style={{ color: '#1F2F3A' }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4"
          >
            Browse by Category
          </h2>
          <p 
            style={{ color: '#6E8594' }}
            className="text-lg md:text-xl text-center mb-12 md:mb-16"
          >
            Find exactly what you're looking for
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            
            {[
              { name: 'Dresses', id: 1 },
              { name: 'Tops & Blouses', id: 2 },
              { name: 'Bottoms', id: 3 },
              { name: 'Outerwear', id: 4 },
              { name: 'Accessories', id: 5 },
              { name: 'Sleepwear', id: 6 },
              { name: 'Activewear', id: 7 },
              { name: 'Childrenswear', id: 8 },
            ].map((category) => (
              <Link
                key={category.id}
                to={`/browse?category=${category.id}`}
                style={{ backgroundColor: '#8FA9B6' }}
                className="p-8 md:p-10 rounded-2xl hover:opacity-90 hover:scale-105 transition-all text-center shadow-lg"
              >
                <div 
                  style={{ color: '#1F2F3A' }}
                  className="font-bold text-lg md:text-xl"
                >
                  {category.name}
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* TRENDING PATTERNS SECTION - More visual separation */}
      <section className="py-20 md:py-28 px-4 md:px-6" style={{ backgroundColor: 'rgba(169, 191, 202, 0.1)' }}>
        <div className="max-w-7xl mx-auto">
          
          <h2 
            style={{ color: '#1F2F3A' }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4"
          >
            Most Popular This Week
          </h2>
          <p 
            style={{ color: '#6E8594' }}
            className="text-lg md:text-xl text-center mb-12 md:mb-16"
          >
            See what the community is loving
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                style={{ backgroundColor: '#8FA9B6' }}
                className="rounded-2xl overflow-hidden hover:opacity-90 hover:scale-105 transition-all cursor-pointer shadow-lg"
              >
                <div 
                  style={{ backgroundColor: '#D9CDB8' }}
                  className="h-56 md:h-64 flex items-center justify-center"
                >
                  <svg 
                    width="80" 
                    height="80" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#6E8594" 
                    strokeWidth="2"
                  >
                    <path d="M3 3h18v18H3z"/>
                    <path d="M9 9h6v6H9z"/>
                  </svg>
                </div>
                
                <div className="p-6">
                  <h3 
                    style={{ color: '#1F2F3A' }}
                    className="font-bold mb-3 text-lg md:text-xl"
                  >
                    Pattern Title {item}
                  </h3>
                  <div 
                    style={{ color: '#6E8594' }}
                    className="text-sm md:text-base flex items-center justify-between"
                  >
                    <span>Easy</span>
                    <span className="font-semibold">{120 - item * 10} downloads</span>
                  </div>
                </div>
              </div>
            ))}

          </div>

          <div className="text-center">
            <Link
              to="/browse"
              style={{ backgroundColor: '#5C768A' }}
              className="inline-block px-10 md:px-12 py-4 md:py-5 text-white rounded-lg font-bold text-lg md:text-xl hover:opacity-90 hover:scale-105 transition-all shadow-lg"
            >
              View All Patterns
            </Link>
          </div>

        </div>
      </section>

      {/* AI FEATURES SECTION - More breathing room */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          
          <h2 
            style={{ color: '#1F2F3A' }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4"
          >
            Smart Features for Sewers
          </h2>
          <p 
            style={{ color: '#6E8594' }}
            className="text-lg md:text-xl text-center mb-12 md:mb-16"
          >
            Powered by artificial intelligence
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="p-8 md:p-10 rounded-2xl text-center hover:scale-105 transition-all shadow-lg"
            >
              <div 
                style={{ backgroundColor: '#5C768A' }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl md:text-2xl font-bold mb-4"
              >
                Smart Search
              </h3>
              <p style={{ color: '#1F2F3A' }} className="text-base md:text-lg leading-relaxed">
                Find patterns even with typos using AI-powered fuzzy matching and NLP
              </p>
            </div>

            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="p-8 md:p-10 rounded-2xl text-center hover:scale-105 transition-all shadow-lg"
            >
              <div 
                style={{ backgroundColor: '#5C768A' }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2v20M2 12h20"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl md:text-2xl font-bold mb-4"
              >
                AI Recommendations
              </h3>
              <p style={{ color: '#1F2F3A' }} className="text-base md:text-lg leading-relaxed">
                Get personalized pattern suggestions based on your interests and history
              </p>
            </div>

            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="p-8 md:p-10 rounded-2xl text-center hover:scale-105 transition-all shadow-lg"
            >
              <div 
                style={{ backgroundColor: '#5C768A' }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl md:text-2xl font-bold mb-4"
              >
                Easy Uploads
              </h3>
              <p style={{ color: '#1F2F3A' }} className="text-base md:text-lg leading-relaxed">
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