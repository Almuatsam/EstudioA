import { useState } from 'react'
import { userAPI } from '../services/api'
import PasswordStrength from './PasswordStrength'
import { isPasswordValid } from '../utils/validatePassword'
import './PasswordChangeModal.css'

function PasswordChangeModal({ isOpen, onClose, onSuccess, onError }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.new_password !== formData.confirm_password) {
      onError('New passwords do not match.')
      return
    }

    if (!isPasswordValid(formData.new_password)) {
      onError('Your new password does not meet all security requirements.')
      return
    }

    try {
      setLoading(true)
      await userAPI.changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password
      })

      onSuccess('Password changed successfully!')
      setFormData({ current_password: '', new_password: '', confirm_password: '' })
      onClose()
    } catch (error) {
      onError(error.response?.data?.error || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="password-modal-backdrop" onClick={onClose}>
      <div className="password-modal-container" onClick={(e) => e.stopPropagation()}>

        <div className="password-modal-header">
          <h3 className="password-modal-title">Change Password</h3>
          <button onClick={onClose} className="password-modal-close" aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="password-modal-field">
            <label className="password-modal-label">Current Password</label>
            <input
              type="password"
              required
              value={formData.current_password}
              onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
              className="password-modal-input"
              autoComplete="current-password"
            />
          </div>

          <div className="password-modal-field">
            <label className="password-modal-label">New Password</label>
            <input
              type="password"
              required
              value={formData.new_password}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
              className="password-modal-input"
              autoComplete="new-password"
            />
            {/* Live strength feedback — replaces the old static list */}
            <PasswordStrength password={formData.new_password} />
          </div>

          <div className="password-modal-field">
            <label className="password-modal-label">Confirm New Password</label>
            <input
              type="password"
              required
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              className="password-modal-input"
              autoComplete="new-password"
            />
            {formData.confirm_password && formData.new_password !== formData.confirm_password && (
              <p className="password-modal-mismatch">Passwords do not match.</p>
            )}
          </div>

          <div className="password-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="password-modal-btn password-modal-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="password-modal-btn password-modal-btn-primary"
            >
              {loading ? 'Changing…' : 'Change Password'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default PasswordChangeModal
