import React, { useState } from 'react'
import './Input.css'

function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  icon,
  required = false,
  disabled = false,
  fullWidth = true,
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const inputClasses = [
    'input',
    icon && 'input-with-icon',
    error && 'input-error',
    isFocused && 'input-focused',
    disabled && 'input-disabled',
    fullWidth && 'input-full-width',
    className
  ].filter(Boolean).join(' ')

  const containerClasses = [
    'input-container',
    fullWidth && 'input-container-full-width'
  ].filter(Boolean).join(' ')

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={containerClasses}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && (
          <span className="input-icon-left">
            {icon}
          </span>
        )}
        
        <input
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="input-error-text">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="input-helper-text">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Input