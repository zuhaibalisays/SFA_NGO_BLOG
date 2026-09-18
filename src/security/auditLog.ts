/**
 * Security Module — Audit Log
 * Records security-relevant events for monitoring and forensics.
 * Never logs sensitive data (passwords, TOTP codes, recovery keys).
 */

export type AuditEventType =
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'mfa_setup'
  | 'mfa_verified'
  | 'mfa_reset'
  | 'recovery_code_used'
  | 'recovery_key_used'
  | 'admin_recovery_initiated'
  | 'password_changed'
  | 'session_created'
  | 'session_revoked'
  | 'post_created'
  | 'post_updated'
  | 'post_deleted'
  | 'suspicious_activity'
  | 'rate_limit_triggered';

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  timestamp: string;
  details?: string;
  /** Masked identifier (never full credentials) */
  actor?: string;
}

const AUDIT_KEY = 'sfa_audit_log';
const MAX_EVENTS = 500; // Keep log bounded

/**
 * Record a security audit event.
 */
export function logAuditEvent(type: AuditEventType, details?: string, actor?: string): void {
  const events = getAuditLog();
  const event: AuditEvent = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
    type,
    timestamp: new Date().toISOString(),
    details,
    actor: actor ? maskIdentifier(actor) : undefined,
  };
  events.unshift(event);
  // Keep bounded
  if (events.length > MAX_EVENTS) {
    events.length = MAX_EVENTS;
  }
  try {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(events));
  } catch {
    // Storage full — trim older events
    events.length = Math.floor(events.length / 2);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(events));
  }
}

/**
 * Retrieve audit log entries.
 */
export function getAuditLog(): AuditEvent[] {
  try {
    const stored = localStorage.getItem(AUDIT_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear audit log (admin only).
 */
export function clearAuditLog(): void {
  localStorage.removeItem(AUDIT_KEY);
}

/**
 * Mask an identifier for safe logging.
 * Shows first 2 and last 2 characters only.
 */
function maskIdentifier(id: string): string {
  if (id.length <= 4) return '***';
  return id.slice(0, 2) + '***' + id.slice(-2);
}

/**
 * Detect suspicious activity patterns.
 */
export function detectSuspiciousActivity(events: AuditEvent[]): AuditEvent | null {
  const now = Date.now();
  const recentWindow = 5 * 60 * 1000; // 5 minutes

  const recentFailures = events.filter(e =>
    e.type === 'login_failure' &&
    now - new Date(e.timestamp).getTime() < recentWindow
  );

  if (recentFailures.length >= 10) {
    return {
      id: 'suspicious-' + Date.now(),
      type: 'suspicious_activity',
      timestamp: new Date().toISOString(),
      details: `${recentFailures.length} failed login attempts in 5 minutes`,
    };
  }

  return null;
}
