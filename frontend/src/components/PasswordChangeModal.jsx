import { useState } from 'react'
import { userAPI } from '../services/api'

function PasswordChangeModal({ isOpen, onClose, onSuccess, onError }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate passwords match
    if (formData.new_password !== formData.confirm_password) {
      onError('New passwords do not match')
      return
    }

    // Validate password length
    if (formData.new_password.length < 8) {
      onError('Password must be at least 8 characters')
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
      onError(error.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="max-w-md w-full rounded-2xl p-8 animate-scale-in"
        style={{ backgroundColor: '#8FA9B6' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 
            style={{ color: '#1F2F3A' }}
            className="text-2xl font-bold"
          >
            Change Password
          </h3>
          <button
            onClick={onClose}
            style={{ color: '#6E8594' }}
            className="text-2xl hover:opacity-70"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="mb-4">
            <label 
              style={{ color: '#1F2F3A' }}
              className="block text-sm font-medium mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              required
              value={formData.current_password}
              onChange={(e) => setFormData({...formData, current_password: e.target.value})}
              style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label 
              style={{ color: '#1F2F3A' }}
              className="block text-sm font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              required
              value={formData.new_password}
              onChange={(e) => setFormData({...formData, new_password: e.target.value})}
              style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label 
              style={{ color: '#1F2F3A' }}
              className="block text-sm font-medium mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={formData.confirm_password}
              onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password Requirements */}
          <div 
            style={{ backgroundColor: '#E9DDC9' }}
            className="rounded-lg p-4 mb-6"
          >
            <p 
              style={{ color: '#1F2F3A' }}
              className="text-sm font-medium mb-2"
            >
              Password Requirements:
            </p>
            <ul 
              style={{ color: '#6E8594' }}
              className="text-xs space-y-1"
            >
              <li>• At least 8 characters</li>
              <li>• Contains uppercase & lowercase letters</li>
              <li>• Contains at least one number</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              style={{ 
                backgroundColor: 'transparent',
                border: '2px solid #5C768A',
                color: '#5C768A'
              }}
              className="flex-1 px-6 py-3 rounded-xl font-bold hover:opacity-80 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#5C768A' }}
              className="flex-1 px-6 py-3 text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordChangeModal