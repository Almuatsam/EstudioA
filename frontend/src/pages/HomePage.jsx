import { Link } from 'react-router-dom'
import { useState } from 'react'

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // For now, just go to browse page
      // Later we'll add actual search
      window.location.href = `/browse?search=${searchQuery}`
    }
  }

  return (
    <div className="min-h-screen">
      
      {/* HERO SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          <h1 
            style={{ color: '#1F2F3A' }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Discover Beautiful
            <br />
            Sewing Patterns
          </h1>
          
          <p 
            style={{ color: '#6E8594' }}
            className="text-xl mb-8"
          >
            AI-powered search to find the perfect pattern for your next creation
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="🔍 Search patterns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="flex-1 px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                style={{ backgroundColor: '#5C768A' }}
                className="px-8 py-4 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/browse"
              style={{ backgroundColor: '#5C768A' }}
              className="px-8 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Browse All Patterns
            </Link>
            <Link
              to="/login"
              style={{ 
                backgroundColor: 'transparent',
                border: '2px solid #A9BFCA',
                color: '#5C768A'
              }}
              className="px-8 py-3 rounded-lg font-medium hover:opacity-80 transition-opacity"
            >
              Upload Your Pattern
            </Link>
          </div>

        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          
          <h2 
            style={{ color: '#1F2F3A' }}
            className="text-3xl font-bold text-center mb-12"
          >
            Browse by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Category Cards */}
            {[
              { name: 'Dresses', icon: '👗', id: 1 },
              { name: 'Tops', icon: '👕', id: 2 },
              { name: 'Bottoms', icon: '👖', id: 3 },
              { name: 'Outerwear', icon: '🧥', id: 4 },
              { name: 'Accessories', icon: '👜', id: 5 },
              { name: 'Sleepwear', icon: '😴', id: 6 },
              { name: 'Activewear', icon: '🏃', id: 7 },
              { name: 'Childrenswear', icon: '👶', id: 8 },
            ].map((category) => (
              <Link
                key={category.id}
                to={`/browse?category=${category.id}`}
                style={{ backgroundColor: '#8FA9B6' }}
                className="p-8 rounded-xl hover:opacity-90 transition-opacity text-center"
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <div 
                  style={{ color: '#1F2F3A' }}
                  className="font-medium text-lg"
                >
                  {category.name}
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* TRENDING PATTERNS SECTION */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          
          <h2 
            style={{ color: '#1F2F3A' }}
            className="text-3xl font-bold text-center mb-12"
          >
            Most Popular This Week
          </h2>

          {/* Pattern Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Sample Pattern Cards - We'll connect to API later */}
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                style={{ backgroundColor: '#8FA9B6' }}
                className="rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                {/* Image Placeholder */}
                <div 
                  style={{ backgroundColor: '#D9CDB8' }}
                  className="h-48 flex items-center justify-center"
                >
                  <span style={{ color: '#6E8594' }} className="text-4xl">
                    📐
                  </span>
                </div>
                
                {/* Pattern Info */}
                <div className="p-4">
                  <h3 
                    style={{ color: '#1F2F3A' }}
                    className="font-bold mb-2"
                  >
                    Pattern Title {item}
                  </h3>
                  <div 
                    style={{ color: '#6E8594' }}
                    className="text-sm flex items-center justify-between"
                  >
                    <span>⭐ Easy</span>
                    <span>📥 {120 - item * 10}</span>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link
              to="/browse"
              style={{ backgroundColor: '#5C768A' }}
              className="inline-block px-8 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              View All Patterns
            </Link>
          </div>

        </div>
      </section>

      {/* AI FEATURES SECTION */}
      <section className="py-16 px-6 mb-16">
        <div className="max-w-6xl mx-auto">
          
          <h2 
            style={{ color: '#1F2F3A' }}
            className="text-3xl font-bold text-center mb-12"
          >
            Smart Features for Sewers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: Smart Search */}
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="p-8 rounded-xl text-center"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl font-bold mb-3"
              >
                Smart Search
              </h3>
              <p style={{ color: '#1F2F3A' }}>
                Find patterns even with typos using AI-powered fuzzy matching and NLP
              </p>
            </div>

            {/* Feature 2: AI Recommendations */}
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="p-8 rounded-xl text-center"
            >
              <div className="text-5xl mb-4">🤖</div>
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl font-bold mb-3"
              >
                AI Recommendations
              </h3>
              <p style={{ color: '#1F2F3A' }}>
                Get personalized pattern suggestions based on your interests and history
              </p>
            </div>

            {/* Feature 3: Easy Upload */}
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="p-8 rounded-xl text-center"
            >
              <div className="text-5xl mb-4">📁</div>
              <h3 
                style={{ color: '#1F2F3A' }}
                className="text-xl font-bold mb-3"
              >
                Easy Uploads
              </h3>
              <p style={{ color: '#1F2F3A' }}>
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