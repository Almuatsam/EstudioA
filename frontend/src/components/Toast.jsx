import { useState, useEffect } from 'react'
import './Toast.css'

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

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{icon}</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  )
}

export default Toast