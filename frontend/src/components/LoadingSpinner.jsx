function LoadingSpinner({ size = 'medium', text = '' }) {
  // Size variants
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Spinner */}
      <div
        className={`${sizeClasses[size]} rounded-full border-t-transparent animate-spin`}
        style={{ 
          borderColor: '#A9BFCA',
          borderTopColor: 'transparent'
        }}
      />
      
      {/* Optional text */}
      {text && (
        <p 
          style={{ color: '#6E8594' }}
          className="text-sm md:text-base font-medium animate-pulse"
        >
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner