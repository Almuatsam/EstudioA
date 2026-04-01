import './ConfirmationModal.css'

function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  changes = [], 
  confirmText = 'Confirm', 
  cancelText = 'Cancel' 
}) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">⚠️</div>
        
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        {changes.length > 0 && (
          <div className="modal-changes">
            <p className="modal-changes-title">Changes:</p>
            <ul className="modal-changes-list">
              {changes.map((change, index) => (
                <li key={index}>• {change}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose} className="modal-btn modal-btn-secondary">
            {cancelText}
          </button>
          <button
            onClick={async () => { await onConfirm(); onClose(); }}
            className="modal-btn modal-btn-primary"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal