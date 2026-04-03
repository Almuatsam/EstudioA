import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const location = useLocation()
  const dropdownRef = useRef(null)

  const dashboardLink = user?.role === 'designer' ? '/designer-dashboard' : '/account'
  const dashboardLabel = user?.role === 'designer' ? 'Dashboard' : 'My Account'

  // Track scroll for navbar shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  const isActive = (path) => location.pathname === path

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.[0]?.toUpperCase() || '?'

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <svg className="navbar-logo-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h18v18H3z" /><path d="M3 9h18M9 3v18" />
          </svg>
          <span className="navbar-logo-text">EstudioA</span>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar-links">
          <Link to="/browse" className={`navbar-link ${isActive('/browse') ? 'navbar-link-active' : ''}`}>
            Browse
            {isActive('/browse') && <span className="navbar-link-indicator" />}
          </Link>
          {isAdmin && (
            <Link to="/admin" className={`navbar-link ${isActive('/admin') ? 'navbar-link-active' : ''}`}>
              Admin
              {isActive('/admin') && <span className="navbar-link-indicator" />}
            </Link>
          )}
        </div>

        {/* Desktop actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-profile-menu" ref={dropdownRef}>
              <button
                className="navbar-profile-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <div className="navbar-avatar">{initials}</div>
                <span className="navbar-username">{user?.username}</span>
                <svg
                  className={`navbar-chevron ${dropdownOpen ? 'navbar-chevron-open' : ''}`}
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    <div className="navbar-dropdown-name">{user?.full_name || user?.username}</div>
                    <div className="navbar-dropdown-email">{user?.email}</div>
                    <span className="navbar-dropdown-badge">{user?.role}</span>
                  </div>
                  <div className="navbar-dropdown-divider" />
                  <Link to={dashboardLink} className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    {dashboardLabel}
                  </Link>
                  <Link to="/account" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Account
                  </Link>
                  <div className="navbar-dropdown-divider" />
                  <button
                    className="navbar-dropdown-item navbar-dropdown-logout"
                    onClick={() => { logout(); setDropdownOpen(false) }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-button navbar-button-secondary">Log in</Link>
              <Link to="/login" className="navbar-button navbar-button-primary">Join Free</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`navbar-hamburger ${menuOpen ? 'navbar-hamburger-open' : ''}`}>
            <span /><span /><span />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-links">
            <Link to="/browse" className={`navbar-mobile-link ${isActive('/browse') ? 'navbar-mobile-link-active' : ''}`}>
              Browse
            </Link>
            {isAdmin && (
              <Link to="/admin" className={`navbar-mobile-link ${isActive('/admin') ? 'navbar-mobile-link-active' : ''}`}>
                Admin
              </Link>
            )}
          </div>

          {isAuthenticated ? (
            <div className="navbar-mobile-profile">
              <div className="navbar-mobile-user-info">
                <div className="navbar-avatar navbar-avatar-large">{initials}</div>
                <div>
                  <div className="navbar-mobile-user-name">{user?.full_name || user?.username}</div>
                  <div className="navbar-mobile-user-email">{user?.email}</div>
                </div>
              </div>
              <Link to={dashboardLink} className="navbar-mobile-link">{dashboardLabel}</Link>
              <Link to="/account" className="navbar-mobile-link">Account</Link>
              <button className="navbar-mobile-logout" onClick={logout}>Log out</button>
            </div>
          ) : (
            <div className="navbar-mobile-auth">
              <Link to="/login" className="navbar-button navbar-button-secondary navbar-button-mobile">Log in</Link>
              <Link to="/login" className="navbar-button navbar-button-primary navbar-button-mobile">Join Free</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
