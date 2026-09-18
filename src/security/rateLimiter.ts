/**
 * Security Module — Rate Limiter
 * Client-side rate limiting with progressive delays.
 * Prevents brute force, credential stuffing, and password spraying.
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  lockedUntil: number;
}

const STORAGE_KEY = 'sfa_rate_limits';
const WINDOW_MS = 15 * 60 * 1000; // 15-minute window
const MAX_ATTEMPTS = 5; // Max attempts before progressive delay
const PROGRESSIVE_BASE_MS = 5000; // 5 second base delay
const MAX_LOCKOUT_MS = 30 * 60 * 1000; // 30-minute max lockout

function getLimits(): Record<string, RateLimitEntry> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveLimits(limits: Record<string, RateLimitEntry>): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(limits));
}

/**
 * Check if an action is rate-limited.
 * Returns { allowed: boolean, retryAfter?: number }
 */
export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const limits = getLimits();
  const now = Date.now();
  const entry = limits[key];

  if (!entry) {
    return { allowed: true };
  }

  // Reset if window has expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    delete limits[key];
    saveLimits(limits);
    return { allowed: true };
  }

  // Check lockout
  if (entry.lockedUntil > now) {
    return { allowed: false, retryAfterMs: entry.lockedUntil - now };
  }

  // Check attempt count
  if (entry.count >= MAX_ATTEMPTS) {
    // Progressive delay: doubles each time max is exceeded
    const excessAttempts = entry.count - MAX_ATTEMPTS;
    const delayMs = Math.min(
      PROGRESSIVE_BASE_MS * Math.pow(2, excessAttempts),
      MAX_LOCKOUT_MS
    );
    entry.lockedUntil = now + delayMs;
    saveLimits(limits);
    return { allowed: false, retryAfterMs: delayMs };
  }

  return { allowed: true };
}

/**
 * Record a failed attempt for rate limiting.
 */
export function recordFailedAttempt(key: string): void {
  const limits = getLimits();
  const now = Date.now();
  const entry = limits[key];

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    limits[key] = {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      lockedUntil: 0,
    };
  } else {
    entry.count++;
    entry.lastAttempt = now;
  }

  saveLimits(limits);
}

/**
 * Reset rate limit for a key (on successful authentication).
 */
export function resetRateLimit(key: string): void {
  const limits = getLimits();
  delete limits[key];
  saveLimits(limits);
}

/**
 * Format retry-after time for display.
 */
export function formatRetryAfter(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}
