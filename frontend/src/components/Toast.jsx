import { useState, useEffect } from 'react'

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#EF5350' : '#FFA726'
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'

  return (
    <div 
      className="fixed bottom-8 right-8 z-50 animate-slide-up"
      style={{
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div 
        style={{ backgroundColor: bgColor }}
        className="px-6 py-4 rounded-xl shadow-lg text-white flex items-center gap-3 min-w-[300px]"
      >
        <span className="text-2xl">{icon}</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}

export default Toast