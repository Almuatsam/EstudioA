import { Link } from 'react-router-dom'
import logoOutline from '../assets/logo-outline.svg'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <img src={logoOutline} alt="EstudioA" className="footer-logo" />
        <p className="footer-copyright">© 2026 EstudioA. All rights reserved.</p>
        
        <div className="footer-links">
          <Link to="/browse" className="footer-link">Browse Patterns</Link>
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer