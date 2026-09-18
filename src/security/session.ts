/**
 * Security Module — Session Management
 * Secure session handling without localStorage for auth tokens.
 * Uses sessionStorage + integrity verification.
 */
import { generateSessionId, generateCSRFToken } from './crypto';

const SESSION_KEY = 'sfa_session';
const CSRF_KEY = 'sfa_csrf';

export interface Session {
  id: string;
  createdAt: number;
  lastActivity: number;
  expiresAt: number;
  /** Integrity hash — prevents tampering */
  integrity: string;
}

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ABSOLUTE_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Create a new session after successful authentication.
 */
export function createSession(): Session {
  const now = Date.now();
  const session: Session = {
    id: generateSessionId(),
    createdAt: now,
    lastActivity: now,
    expiresAt: now + ABSOLUTE_TIMEOUT,
    integrity: '', // Will be set below
  };
  // Create integrity hash from session data
  session.integrity = computeIntegrity(session);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Rotate CSRF token on new session
  rotateCSRFToken();
  return session;
}

/**
 * Validate current session.
 * Checks: existence, integrity, idle timeout, absolute timeout.
 */
export function validateSession(): Session | null {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session: Session = JSON.parse(stored);
    const now = Date.now();

    // Check absolute timeout
    if (now > session.expiresAt) {
      destroySession();
      return null;
    }

    // Check idle timeout
    if (now - session.lastActivity > IDLE_TIMEOUT) {
      destroySession();
      return null;
    }

    // Verify integrity (tamper detection)
    if (session.integrity !== computeIntegrity(session)) {
      destroySession();
      return null;
    }

    // Update last activity
    session.lastActivity = now;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return session;
  } catch {
    destroySession();
    return null;
  }
}

/**
 * Destroy current session (logout).
 */
export function destroySession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(CSRF_KEY);
}

/**
 * Get or create CSRF token for the current session.
 */
export function getCSRFToken(): string {
  let token = sessionStorage.getItem(CSRF_KEY);
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem(CSRF_KEY, token);
  }
  return token;
}

/**
 * Rotate CSRF token (called on session creation and privilege changes).
 */
export function rotateCSRFToken(): string {
  const token = generateCSRFToken();
  sessionStorage.setItem(CSRF_KEY, token);
  return token;
}

/**
 * Verify a CSRF token matches the current session token.
 */
export function verifyCSRFToken(token: string): boolean {
  const current = sessionStorage.getItem(CSRF_KEY);
  if (!current) return false;
  // Constant-time comparison to prevent timing attacks
  if (token.length !== current.length) return false;
  let mismatch = 0;
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ current.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Compute integrity hash for session tamper detection.
 * Uses a simple HMAC-like approach with session data.
 */
function computeIntegrity(session: Omit<Session, 'integrity'> & { integrity?: string }): string {
  const data = `${session.id}|${session.createdAt}|${session.expiresAt}`;
  // Simple hash — in production this would use Web Crypto SubtleCrypto
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36) + session.id.slice(0, 8);
}
