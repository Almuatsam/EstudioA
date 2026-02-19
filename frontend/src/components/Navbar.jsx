import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/browse"
            className="text-white hover:opacity-70 transition-opacity font-medium"
          >
            Browse
          </Link>
          
          {/* Admin link - only show for admins */}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-white hover:opacity-70 transition-opacity font-medium"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          
          {isAuthenticated ? (
            /* Logged IN - show user menu */
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="text-white hover:opacity-70 transition-opacity font-medium"
              >
                Dashboard
              </Link>
              <span style={{ color: '#A9BFCA' }} className="text-sm">
                {user?.username}
              </span>
              <button
                onClick={logout}
                style={{ backgroundColor: '#5C768A' }}
                className="px-4 py-2 rounded-lg text-white hover:opacity-80 transition-opacity font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            /* Logged OUT - show login/join */
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-white hover:opacity-70 transition-opacity font-medium"
              >
                Login
              </Link>
              <Link
                to="/login"
                style={{ backgroundColor: '#5C768A' }}
                className="px-4 py-2 rounded-lg text-white hover:opacity-80 transition-opacity font-medium"
              >
                Join Free
              </Link>
            </div>
          )}
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
          
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:opacity-70 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-white hover:opacity-70 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  logout()
                  setMenuOpen(false)
                }}
                className="text-white hover:opacity-70 font-medium text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar