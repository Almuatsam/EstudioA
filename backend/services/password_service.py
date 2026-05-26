"""
password_service.py — centralised password strength validation.

Rules enforced (all must pass):
  1. Minimum 8 characters
  2. At least one uppercase letter (A–Z)
  3. At least one lowercase letter (a–z)
  4. At least one digit (0–9)
  5. At least one special character
  6. No 4+ ascending or descending character sequences (1234, dcba …)
  7. No 4+ repeated characters (1111, aaaa …)
  8. Not on the common-password blocklist

Usage:
    from services.password_service import validate_password

    errors = validate_password(plain_text_password)
    if errors:
        return jsonify({'error': errors[0], 'validation_errors': errors}), 400
"""

import re

# ---------------------------------------------------------------------------
# Common-password blocklist (top offenders)
# ---------------------------------------------------------------------------
_COMMON_PASSWORDS = {
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
}

# Special characters accepted as valid
_SPECIAL_CHAR_RE = re.compile(r'[@$!%*?&^#()_\-+=\[\]{}|;:,.<>/~`"\'\\]')


# ---------------------------------------------------------------------------
# Helper detectors
# ---------------------------------------------------------------------------

def _has_sequential(password: str, length: int = 4) -> bool:
    """Return True if *password* contains an ascending or descending run
    of *length* consecutive Unicode code points (e.g. '1234', 'dcba')."""
    pw = password.lower()
    for i in range(len(pw) - length + 1):
        chunk = pw[i:i + length]
        ords = [ord(c) for c in chunk]
        diffs = [ords[j + 1] - ords[j] for j in range(len(ords) - 1)]
        if all(d == 1 for d in diffs):   # ascending: 1234, abcd
            return True
        if all(d == -1 for d in diffs):  # descending: 4321, dcba
            return True
    return False


def _has_repeated(password: str, length: int = 4) -> bool:
    """Return True if any *length*-character window has only one distinct
    character (e.g. '1111', 'aaaa')."""
    for i in range(len(password) - length + 1):
        if len(set(password[i:i + length])) == 1:
            return True
    return False


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def validate_password(password: str) -> list:
    """
    Validate *password* against the site security policy.

    Returns:
        A list of human-readable error strings.
        An empty list means the password is acceptable.
    """
    errors = []

    if len(password) < 8:
        errors.append('Password must be at least 8 characters long.')

    if not re.search(r'[A-Z]', password):
        errors.append('Password must contain at least one uppercase letter (A–Z).')

    if not re.search(r'[a-z]', password):
        errors.append('Password must contain at least one lowercase letter (a–z).')

    if not re.search(r'\d', password):
        errors.append('Password must contain at least one number (0–9).')

    if not _SPECIAL_CHAR_RE.search(password):
        errors.append('Password must contain at least one special character (e.g. @, !, #, $).')

    if _has_sequential(password, length=4):
        errors.append('Password must not contain sequential characters (e.g. 1234, abcd, 4321).')

    if _has_repeated(password, length=4):
        errors.append('Password must not contain repeated characters (e.g. 1111, aaaa).')

    if password.lower() in _COMMON_PASSWORDS:
        errors.append('Password is too common. Please choose a more unique password.')

    return errors
