import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Warning } from './Icons'
import './Toast.css'

const ICONS = {
  success: <CheckCircle width={18} height={18} />,
  error:   <XCircle    width={18} height={18} />,
  warning: <Warning    width={18} height={18} />,
}

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

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{ICONS[type] ?? ICONS.warning}</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  )
}

export default Toast