import { useState } from 'react'
import { Link } from 'react-router-dom'

function FlipCard({ pattern }) {
  const [isFlipped, setIsFlipped] = useState(false)

  // For mobile: toggle on click
  const handleClick = () => {
    // Only toggle if screen is mobile (less than 768px)
    if (window.innerWidth < 768) {
      setIsFlipped(!isFlipped)
    }
  }

  // For desktop: flip on mouse enter
  const handleMouseEnter = () => {
    setIsFlipped(true)
  }

  // For desktop: flip back on mouse leave
  const handleMouseLeave = () => {
    setIsFlipped(false)
  }

  return (
    <div 
      className="flip-card-container"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px', cursor: 'pointer' }}
    >
      <div 
        className="flip-card-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* FRONT SIDE */}
        <div
          className="flip-card-front"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#8FA9B6',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Image */}
          <div 
            style={{ 
              backgroundColor: '#D9CDB8',
              height: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {pattern.preview_image ? (
              <img 
                src={`http://127.0.0.1:5000${pattern.preview_image}`}
                alt={pattern.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <span style={{ color: '#6E8594', fontSize: '64px' }}>
                📐
              </span>
            )}
          </div>

          {/* Title */}
          <div style={{ padding: '16px' }}>
            <h3 
              style={{ 
                color: '#1F2F3A',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '8px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {pattern.title}
            </h3>

            {/* Category Badge */}
            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#A9BFCA',
                color: '#1F2F3A',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {pattern.category?.name || 'Uncategorized'}
            </span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="flip-card-back"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#8FA9B6',
            borderRadius: '12px',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative Icon */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '48px', color: '#5C768A' }}>
              📐
            </span>
          </div>

          {/* View Button */}
          <Link
            to={`/pattern/${pattern.id}`}
            style={{
              backgroundColor: '#5C768A',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              marginBottom: '12px',
              width: '100%',
              maxWidth: '200px',
              textAlign: 'center',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
            onClick={(e) => e.stopPropagation()}
          >
            👁️ View Pattern
          </Link>

          {/* Download Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              console.log('Download button clicked!')
              console.log('Pattern object:', pattern)
              console.log('PDF file path:', pattern.pdf_file)
              
              if (pattern.pdf_file) {
                console.log('PDF path exists, attempting download...')
                console.log('Full URL:', `http://127.0.0.1:5000${pattern.pdf_file}`)
                
                const link = document.createElement('a')
                link.href = `http://127.0.0.1:5000${pattern.pdf_file}`
                link.download = `${pattern.title}.pdf`
                link.target = '_blank'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                console.log('Download triggered!')
              } else {
                console.log('No PDF file path found!')
                alert('PDF file not available for this pattern')
              }
            }}
            style={{
              backgroundColor: '#243A4D',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '200px',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            ⬇️ Download PDF
          </button>

          {/* Designer Name */}
          <div 
            style={{ 
              marginTop: '24px',
              color: '#6E8594',
              fontSize: '14px'
            }}
          >
            Designer: {pattern.designer_name || 'Unknown'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlipCard