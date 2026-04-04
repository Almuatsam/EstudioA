"""
Email notification service — uses Python's built-in smtplib (no extra packages).
Configure via environment variables or config.py MAIL_* settings.

Required env vars (or set in config.py):
  MAIL_SERVER   — SMTP host, e.g. smtp.gmail.com
  MAIL_PORT     — e.g. 587
  MAIL_USERNAME — sender address
  MAIL_PASSWORD — sender password / app password
  MAIL_USE_TLS  — 'true' (default) or 'false'

Gmail quick-start:
  1. Enable 2FA on your Google account
  2. Generate an App Password at myaccount.google.com/apppasswords
  3. Set MAIL_USERNAME=you@gmail.com, MAIL_PASSWORD=<app-password>
"""

import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# ---------------------------------------------------------------------------
# Config helpers
# ---------------------------------------------------------------------------

def _cfg(key, default=''):
    """Read from Flask app config if available, otherwise env / default."""
    try:
        from flask import current_app
        return current_app.config.get(key, os.environ.get(key, default))
    except RuntimeError:
        return os.environ.get(key, default)


# ---------------------------------------------------------------------------
# Core send function
# ---------------------------------------------------------------------------

def send_email(to: str | list, subject: str, html_body: str) -> bool:
    """
    Send an HTML email. Returns True on success, False on failure.
    Silently fails in development if MAIL_USERNAME is not configured
    (so missing email config never crashes the app).
    """
    username = _cfg('MAIL_USERNAME')
    password = _cfg('MAIL_PASSWORD')
    server   = _cfg('MAIL_SERVER', 'smtp.gmail.com')
    port     = int(_cfg('MAIL_PORT', '587'))
    use_tls  = _cfg('MAIL_USE_TLS', 'true').lower() == 'true'

    if not username or not password:
        print(f"[Email] MAIL_USERNAME/PASSWORD not set — skipping email: {subject}")
        return False

    recipients = [to] if isinstance(to, str) else to

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From']    = username
    msg['To']      = ', '.join(recipients)
    msg.attach(MIMEText(html_body, 'html'))

    try:
        if use_tls:
            smtp = smtplib.SMTP(server, port)
            smtp.ehlo()
            smtp.starttls()
        else:
            smtp = smtplib.SMTP_SSL(server, port)
        smtp.login(username, password)
        smtp.sendmail(username, recipients, msg.as_string())
        smtp.quit()
        print(f"[Email] Sent '{subject}' → {recipients}")
        return True
    except Exception as e:
        print(f"[Email] Failed to send '{subject}': {e}")
        return False


# ---------------------------------------------------------------------------
# Email templates
# ---------------------------------------------------------------------------

def notify_admin_new_pattern(admin_email: str, pattern_title: str, designer_name: str):
    """Notify admin that a new pattern is waiting for approval."""
    subject = f"[EstudioA] New pattern pending approval: {pattern_title}"
    body = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#1F2F3A">New Pattern Pending Approval</h2>
      <p>A designer has submitted a new pattern that requires your review.</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;color:#5C768A;width:140px">Pattern Title</td>
            <td style="padding:8px;font-weight:600">{pattern_title}</td></tr>
        <tr><td style="padding:8px;color:#5C768A">Designer</td>
            <td style="padding:8px">{designer_name}</td></tr>
      </table>
      <p style="margin-top:24px">
        <a href="http://localhost:5173/admin"
           style="background:#5C768A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">
          Review in Admin Panel
        </a>
      </p>
      <p style="color:#9ca3af;font-size:12px;margin-top:32px">EstudioA Platform</p>
    </div>
    """
    return send_email(admin_email, subject, body)


def notify_designer_approved(designer_email: str, designer_name: str, pattern_title: str):
    """Notify designer that their pattern was approved."""
    subject = f"[EstudioA] Your pattern '{pattern_title}' has been approved!"
    body = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#1F2F3A">Pattern Approved 🎉</h2>
      <p>Hi {designer_name},</p>
      <p>Great news! Your pattern <strong>{pattern_title}</strong> has been approved
         and is now live on EstudioA.</p>
      <p style="margin-top:24px">
        <a href="http://localhost:5173/designer-dashboard"
           style="background:#5C768A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">
          View Your Dashboard
        </a>
      </p>
      <p style="color:#9ca3af;font-size:12px;margin-top:32px">EstudioA Platform</p>
    </div>
    """
    return send_email(designer_email, subject, body)


def notify_designer_rejected(designer_email: str, designer_name: str, pattern_title: str):
    """Notify designer that their pattern was rejected."""
    subject = f"[EstudioA] Update on your pattern '{pattern_title}'"
    body = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#1F2F3A">Pattern Not Approved</h2>
      <p>Hi {designer_name},</p>
      <p>Unfortunately your pattern <strong>{pattern_title}</strong> was not approved
         at this time. Please review our submission guidelines and feel free to
         re-submit an updated version.</p>
      <p style="margin-top:24px">
        <a href="http://localhost:5173/upload"
           style="background:#5C768A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">
          Upload a New Pattern
        </a>
      </p>
      <p style="color:#9ca3af;font-size:12px;margin-top:32px">EstudioA Platform</p>
    </div>
    """
    return send_email(designer_email, subject, body)


def notify_users_new_pattern(user_emails: list, pattern_title: str,
                              designer_name: str, pattern_id: int):
    """Notify subscribed users about a newly published pattern."""
    if not user_emails:
        return
    subject = f"[EstudioA] New pattern available: {pattern_title}"
    body = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#1F2F3A">New Pattern on EstudioA</h2>
      <p>A new sewing pattern has just been published!</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;color:#5C768A;width:140px">Pattern</td>
            <td style="padding:8px;font-weight:600">{pattern_title}</td></tr>
        <tr><td style="padding:8px;color:#5C768A">Designer</td>
            <td style="padding:8px">{designer_name}</td></tr>
      </table>
      <p style="margin-top:24px">
        <a href="http://localhost:5173/pattern/{pattern_id}"
           style="background:#5C768A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">
          View Pattern
        </a>
      </p>
      <p style="color:#9ca3af;font-size:12px;margin-top:32px">EstudioA Platform</p>
    </div>
    """
    # Send individually to avoid exposing all addresses
    for email in user_emails:
        send_email(email, subject, body)
