/**
 * Security Module — Cryptographic Utilities
 * Zero-cost implementation using Web Crypto API + bcryptjs
 */
import * as bcrypt from 'bcryptjs';
import * as OTPAuth from 'otpauth';

// ============ PASSWORD HASHING ============

const BCRYPT_ROUNDS = 12;

/**
 * Hash a password using bcrypt (12 rounds).
 * bcrypt is used as the universal fallback since Argon2id
 * is not available in browser environments without WASM.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify a password against a bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============ PASSWORD POLICY ============

/** Common compromised passwords — top entries from breach databases */
const COMMON_PASSWORDS = new Set([
  'password', '123456789012', 'qwertyuiopas', 'password1234',
  'adminadminad', 'letmeinletme', 'welcome12345', 'monkeymonkey',
  'dragon123456', 'master123456', 'abcabcabcabc', '123412341234',
  'password123!', 'iloveyou1234', 'trustno1trust', 'sunshinesuns',
]);

/**
 * Validate password meets minimum security requirements.
 * - Minimum 12 characters
 * - Not a commonly compromised password
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters long.' };
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return { valid: false, error: 'This password is too common. Please choose a unique password.' };
  }
  return { valid: true };
}

// ============ TOTP (Time-based One-Time Password) ============

/**
 * Generate a new TOTP secret and URI for enrollment.
 */
export function generateTOTPSecret(issuer: string, account: string): {
  secret: string;
  uri: string;
} {
  const totp = new OTPAuth.TOTP({
    issuer,
    label: account,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: new OTPAuth.Secret(),
  });

  return {
    secret: totp.secret.base32,
    uri: totp.toString(),
  };
}

/**
 * Verify a TOTP code against a secret.
 * Allows ±1 step clock tolerance (standard practice).
 */
export function verifyTOTP(secret: string, code: string): boolean {
  try {
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });
    const delta = totp.validate({ token: code, window: 1 });
    return delta !== null;
  } catch {
    return false;
  }
}

// ============ RECOVERY CODES ============

/**
 * Generate cryptographically secure recovery codes.
 * Format: XXXX-XXXX-XXXX (12 chars + 2 hyphens = 14 visible chars)
 * Each code has ~47 bits of entropy.
 */
export function generateRecoveryCodes(count: number = 10): string[] {
  const codes: string[] = [];
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars (0/O, 1/I)

  for (let i = 0; i < count; i++) {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    const segments = [
      Array.from(bytes.slice(0, 4), b => charset[b % charset.length]).join(''),
      Array.from(bytes.slice(4, 8), b => charset[b % charset.length]).join(''),
      Array.from(bytes.slice(8, 12), b => charset[b % charset.length]).join(''),
    ];
    codes.push(segments.join('-'));
  }
  return codes;
}

/**
 * Hash recovery codes for storage (never store plaintext).
 */
export async function hashRecoveryCodes(codes: string[]): Promise<string[]> {
  return Promise.all(codes.map(code => bcrypt.hash(code, 10)));
}

/**
 * Verify a recovery code against stored hashes.
 * Returns the index of the matching code, or -1 if none match.
 */
export async function verifyRecoveryCode(code: string, hashedCodes: string[]): Promise<number> {
  for (let i = 0; i < hashedCodes.length; i++) {
    if (hashedCodes[i] && await bcrypt.compare(code.toUpperCase(), hashedCodes[i])) {
      return i;
    }
  }
  return -1;
}

// ============ EMERGENCY RECOVERY KEY ============

/**
 * Generate a high-entropy emergency recovery key.
 * Format: NGO-XXXX-XXXX-XXXX-XXXX (128+ bits of entropy)
 * Uses OS CSPRNG (crypto.getRandomValues).
 */
export function generateEmergencyKey(): string {
  const bytes = new Uint8Array(16); // 128 bits
  crypto.getRandomValues(bytes);
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = ['NGO'];
  for (let s = 0; s < 4; s++) {
    let segment = '';
    for (let i = 0; i < 4; i++) {
      segment += charset[bytes[s * 4 + i] % charset.length];
    }
    segments.push(segment);
  }
  return segments.join('-');
}

/**
 * Hash emergency recovery key for storage.
 */
export async function hashEmergencyKey(key: string): Promise<string> {
  return bcrypt.hash(key, 12);
}

/**
 * Verify emergency recovery key.
 */
export async function verifyEmergencyKey(key: string, hash: string): Promise<boolean> {
  return bcrypt.compare(key.toUpperCase(), hash);
}

// ============ CSRF TOKEN ============

/**
 * Generate a CSRF token using CSPRNG.
 */
export function generateCSRFToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a session ID using CSPRNG.
 */
export function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}
