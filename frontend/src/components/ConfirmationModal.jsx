function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, changes = [], confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="max-w-lg w-full rounded-2xl p-8 animate-scale-in"
        style={{ backgroundColor: '#8FA9B6' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="text-center mb-4">
          <span className="text-5xl">⚠️</span>
        </div>

        {/* Title */}
        <h3 
          style={{ color: '#1F2F3A' }}
          className="text-2xl font-bold text-center mb-4"
        >
          {title}
        </h3>

        {/* Message */}
        <p 
          style={{ color: '#6E8594' }}
          className="text-center mb-6"
        >
          {message}
        </p>

        {/* Changes List */}
        {changes.length > 0 && (
          <div 
            style={{ backgroundColor: '#E9DDC9' }}
            className="rounded-xl p-4 mb-6"
          >
            <p 
              style={{ color: '#1F2F3A' }}
              className="font-bold mb-2"
            >
              Changes:
            </p>
            <ul className="space-y-1">
              {changes.map((change, index) => (
                <li 
                  key={index}
                  style={{ color: '#6E8594' }}
                  className="text-sm"
                >
                  • {change}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            style={{ 
              backgroundColor: 'transparent',
              border: '2px solid #5C768A',
              color: '#5C768A'
            }}
            className="flex-1 px-6 py-3 rounded-xl font-bold hover:opacity-80 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            style={{ backgroundColor: '#5C768A' }}
            className="flex-1 px-6 py-3 text-white rounded-xl font-bold hover:opacity-90 transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal