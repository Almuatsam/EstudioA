function GenderIcon({ gender, size = 'medium' }) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-24 h-24'
  }

  const iconSize = size === 'small' ? 32 : size === 'medium' ? 48 : 56

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center`}
      style={{ backgroundColor: '#5C768A' }}
    >
      {gender === 'male' ? (
        // Male icon
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="10" cy="14" r="6"/>
          <line x1="14.5" y1="9.5" x2="19" y2="5"/>
          <line x1="19" y1="5" x2="19" y2="9"/>
          <line x1="19" y1="5" x2="15" y2="5"/>
        </svg>
      ) : gender === 'female' ? (
        // Female icon
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="12" cy="8" r="6"/>
          <line x1="12" y1="14" x2="12" y2="21"/>
          <line x1="9" y1="18" x2="15" y2="18"/>
        </svg>
      ) : (
        // Default user icon
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )}
    </div>
  )
}

export default GenderIcon