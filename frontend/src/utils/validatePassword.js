/**
 * validatePassword.js
 *
 * Client-side mirror of backend/services/password_service.py.
 * Keep both files in sync whenever the policy changes.
 *
 * Public API:
 *   validatePassword(password)  → array of { id, label, passed }
 *   isPasswordValid(password)   → boolean (all rules passed)
 */

// ---------------------------------------------------------------------------
// Common-password blocklist (mirrors backend set)
// ---------------------------------------------------------------------------
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', 'password!', 'pass1234',
  '12345678', '123456789', '1234567890', '87654321',
  'qwerty', 'qwerty123', 'qwertyuiop', 'qwerty!', 'zxcvbnm',
  'asdfghjk', 'asdfghjkl', 'abc12345', 'abc123456', 'abcdefgh',
  'letmein', 'welcome', 'welcome1', 'iloveyou', 'iloveyou1',
  'monkey', 'monkey123', 'dragon', 'master', 'master123',
  'sunshine', 'princess', 'shadow', 'superman', 'batman',
  'michael', 'charlie', 'donald', 'hello123', 'football',
  'baseball', 'hockey', 'trustno1', 'starwars', 'admin',
  'admin123', 'admin1234', 'root', 'rootroot',
  '11111111', '22222222', '33333333', '44444444', '55555555',
  '66666666', '77777777', '88888888', '99999999', '00000000',
  'aaaaaaaa', 'bbbbbbbb', 'zzzzzzzz',
])

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Detect 4+ ascending or descending character runs (e.g. '1234', 'dcba'). */
function hasSequential(password, length = 4) {
  const pw = password.toLowerCase()
  for (let i = 0; i <= pw.length - length; i++) {
    const chunk = pw.slice(i, i + length)
    const ords = [...chunk].map(c => c.charCodeAt(0))
    const diffs = ords.slice(1).map((o, j) => o - ords[j])
    if (diffs.every(d => d === 1)) return true   // ascending: 1234, abcd
    if (diffs.every(d => d === -1)) return true  // descending: 4321, dcba
  }
  return false
}

/** Detect 4+ repeated characters (e.g. '1111', 'aaaa'). */
function hasRepeated(password, length = 4) {
  for (let i = 0; i <= password.length - length; i++) {
    if (new Set(password.slice(i, i + length)).size === 1) return true
  }
  return false
}

// ---------------------------------------------------------------------------
// Rule definitions
// ---------------------------------------------------------------------------

/** Each rule: { id, label, test(pw) → boolean } */
export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: pw => pw.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter (A–Z)',
    test: pw => /[A-Z]/.test(pw),
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter (a–z)',
    test: pw => /[a-z]/.test(pw),
  },
  {
    id: 'number',
    label: 'At least one number (0–9)',
    test: pw => /\d/.test(pw),
  },
  {
    id: 'special',
    label: 'At least one special character (@ ! # $ …)',
    test: pw => /[@$!%*?&^#()_\-+=[\]{}|;:,.<>/~`"'\\]/.test(pw),
  },
  {
    id: 'noSequential',
    label: 'No sequential characters (e.g. 1234, abcd)',
    test: pw => !hasSequential(pw, 4),
  },
  {
    id: 'noRepeated',
    label: 'No repeated characters (e.g. 1111, aaaa)',
    test: pw => !hasRepeated(pw, 4),
  },
  {
    id: 'notCommon',
    label: 'Not a commonly used password',
    test: pw => !COMMON_PASSWORDS.has(pw.toLowerCase()),
  },
]

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Evaluate every rule against the given password.
 *
 * @param {string} password
 * @returns {{ id: string, label: string, passed: boolean }[]}
 */
export function validatePassword(password) {
  return PASSWORD_RULES.map(rule => ({
    id: rule.id,
    label: rule.label,
    passed: rule.test(password),
  }))
}

/**
 * Quick boolean — true only when every rule passes.
 *
 * @param {string} password
 * @returns {boolean}
 */
export function isPasswordValid(password) {
  return PASSWORD_RULES.every(rule => rule.test(password))
}
