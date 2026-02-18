import { Link } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const isLoggedIn = false

  return (
    <nav style={{ backgroundColor: '#243A4D' }} className="px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/" 
          style={{ color: '#A9BFCA' }}
          className="text-2xl font-bold hover:opacity-80 transition-opacity"
        >
          EstudioA
        </Link>

        {/* Desktop Links - Always visible on desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/browse"
            className="text-white hover:opacity-70 transition-opacity font-medium"
          >
            Browse
          </Link>
          <Link
            to="/login"
            className="text-white hover:opacity-70 transition-opacity font-medium"
          >
            Login
          </Link>
          <Link
            to="/login"
            style={{ backgroundColor: '#5C768A' }}
            className="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity font-medium"
          >
            Join Free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 pb-4">
          <Link
            to="/browse"
            className="text-white hover:opacity-70 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Browse
          </Link>
          <Link
            to="/login"
            className="text-white hover:opacity-70 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/login"
            style={{ backgroundColor: '#5C768A' }}
            className="px-4 py-2 rounded-lg text-white text-center font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Join Free
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar