import { validatePassword } from '../utils/validatePassword'
import './PasswordStrength.css'

/**
 * PasswordStrength
 *
 * Shows a 4-segment strength bar and a per-rule checklist.
 * Renders nothing when `password` is empty.
 *
 * Props:
 *   password  {string}  — the current plain-text password value
 */
function PasswordStrength({ password }) {
  if (!password) return null

  const rules = validatePassword(password)
  const passed = rules.filter(r => r.passed).length
  const total = rules.length

  // Strength tier: 0-3 weak · 4-5 fair · 6-7 good · 8 strong
  const tier =
    passed === total       ? 'strong' :
    passed >= total - 1    ? 'good'   :
    passed >= total - 3    ? 'fair'   : 'weak'

  const tierSegments = { weak: 1, fair: 2, good: 3, strong: 4 }
  const tierLabels   = { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' }

  return (
    <div className="pw-strength" aria-live="polite">

      {/* Strength bar */}
      <div className="pw-strength-bar-row">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`pw-strength-bar ${i < tierSegments[tier] ? `pw-strength-bar--${tier}` : 'pw-strength-bar--empty'}`}
          />
        ))}
        <span className={`pw-strength-label pw-strength-label--${tier}`}>
          {tierLabels[tier]}
        </span>
      </div>

      {/* Per-rule checklist */}
      <ul className="pw-rules-list" aria-label="Password requirements">
        {rules.map(rule => (
          <li
            key={rule.id}
            className={`pw-rule ${rule.passed ? 'pw-rule--pass' : 'pw-rule--fail'}`}
          >
            <span className="pw-rule-icon" aria-hidden="true">
              {rule.passed ? '✓' : '✗'}
            </span>
            {rule.label}
          </li>
        ))}
      </ul>

    </div>
  )
}

export default PasswordStrength
