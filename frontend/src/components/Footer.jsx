import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer 
      style={{ backgroundColor: '#243A4D' }}
      className="px-6 py-8 mt-16"
    >
      <div className="max-w-7xl mx-auto text-center">
        <span style={{ color: '#A9BFCA' }} className="text-xl font-bold">
          EstudioA
        </span>
        <p style={{ color: '#6E8594' }} className="text-sm mt-2">
          © 2026 EstudioA. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer