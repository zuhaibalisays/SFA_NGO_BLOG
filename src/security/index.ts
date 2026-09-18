/**
 * Security Module — Barrel Export
 * Central access point for all security utilities.
 */

export {
  hashPassword,
  verifyPassword,
  validatePassword,
  generateTOTPSecret,
  verifyTOTP,
  generateRecoveryCodes,
  hashRecoveryCodes,
  verifyRecoveryCode,
  generateEmergencyKey,
  hashEmergencyKey,
  verifyEmergencyKey,
  generateCSRFToken,
  generateSessionId,
} from './crypto';

export {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  formatRetryAfter,
} from './rateLimiter';

export {
  logAuditEvent,
  getAuditLog,
  clearAuditLog,
  detectSuspiciousActivity,
  type AuditEvent,
  type AuditEventType,
} from './auditLog';

export {
  createSession,
  validateSession,
  destroySession,
  getCSRFToken,
  rotateCSRFToken,
  verifyCSRFToken,
  type Session,
} from './session';

export {
  sanitizeHTML,
  sanitizeText,
  isSafeUrl,
  sanitizeUrl,
  markdownToSafeHTML,
} from './xss';
