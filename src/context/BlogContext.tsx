import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Article, ContactMessage } from '../types';
import { sampleArticles } from '../data/sampleArticles';
import {
  hashPassword, verifyPassword, validatePassword,
  generateTOTPSecret, verifyTOTP,
  generateRecoveryCodes, hashRecoveryCodes, verifyRecoveryCode,
  generateEmergencyKey, hashEmergencyKey, verifyEmergencyKey,
  checkRateLimit, recordFailedAttempt, resetRateLimit,
  logAuditEvent, getAuditLog,
  createSession, validateSession, destroySession,
  type AuditEvent,
} from '../security';

interface SecurityState {
  passwordHash: string;
  totpSecret: string | null;
  totpEnabled: boolean;
  recoveryCodeHashes: string[];
  emergencyKeyHash: string;
  mfaSetupComplete: boolean;
}

interface BlogContextType {
  articles: Article[];
  filteredArticles: Article[];
  searchQuery: string;
  activeCategory: string;
  isAdminLoggedIn: boolean;
  contacts: ContactMessage[];
  securityState: SecurityState | null;
  auditLog: AuditEvent[];
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  addArticle: (article: Omit<Article, 'id' | 'date' | 'views'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  adminLogin: (password: string, totpCode?: string) => Promise<{ success: boolean; error?: string; needsMfa?: boolean; retryAfterMs?: number }>;
  adminLogout: () => void;
  addContact: (message: Omit<ContactMessage, 'id' | 'date'>) => void;
  incrementViews: (id: string) => void;
  // Security operations
  setupInitialAccount: (password: string) => Promise<{ success: boolean; error?: string }>;
  setupTOTP: () => { secret: string; uri: string } | null;
  verifyAndEnableTOTP: (code: string) => boolean;
  disableTOTP: (password: string) => Promise<boolean>;
  getRecoveryCodes: () => Promise<string[]>;
  regenerateRecoveryCodes: () => Promise<string[]>;
  getEmergencyKey: () => string | null;
  regenerateEmergencyKey: () => Promise<string>;
  recoverWithCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  recoverWithKey: (key: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const SECURITY_KEY = 'sfa_security';
const STORAGE_KEY_ARTICLES = 'sfa_articles';
const STORAGE_KEY_CONTACTS = 'sfa_contacts';
const RECOVERY_STATE_KEY = 'sfa_recovery_state';

// Default initial password hash (pre-computed bcrypt hash of "sfa2024writer")
// In production, this would be set during first-run setup
const DEFAULT_PASSWORD = 'sfa2024writer';

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (stored) {
      try { return JSON.parse(stored); } catch { return sampleArticles; }
    }
    return sampleArticles;
  });

  const [contacts, setContacts] = useState<ContactMessage[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_CONTACTS);
    if (stored) {
      try { return JSON.parse(stored); } catch { return []; }
    }
    return [];
  });

  const [securityState, setSecurityState] = useState<SecurityState | null>(() => {
    const stored = localStorage.getItem(SECURITY_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return validateSession() !== null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [auditLog, setAuditLog] = useState<AuditEvent[]>(() => getAuditLog());

  // Persist state changes
  useEffect(() => { localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles)); }, [articles]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => {
    if (securityState) localStorage.setItem(SECURITY_KEY, JSON.stringify(securityState));
  }, [securityState]);
  useEffect(() => { setAuditLog(getAuditLog()); }, []);

  // Initialize default security state if none exists
  useEffect(() => {
    if (!securityState) {
      hashPassword(DEFAULT_PASSWORD).then(hash => {
        const emergencyKey = generateEmergencyKey();
        hashEmergencyKey(emergencyKey).then(keyHash => {
          const defaultState: SecurityState = {
            passwordHash: hash,
            totpSecret: null,
            totpEnabled: false,
            recoveryCodeHashes: [],
            emergencyKeyHash: keyHash,
            mfaSetupComplete: false,
          };
          setSecurityState(defaultState);
          // Store emergency key display flag
          sessionStorage.setItem('sfa_initial_emergency_key', emergencyKey);
        });
      });
    }
  }, [securityState]);

  const addArticle = useCallback((article: Omit<Article, 'id' | 'date' | 'views'>) => {
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      views: 0,
    };
    setArticles(prev => [newArticle, ...prev]);
    logAuditEvent('post_created', `Article: ${article.title.slice(0, 50)}`, 'admin');
  }, []);

  const updateArticle = useCallback((id: string, updates: Partial<Article>) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    logAuditEvent('post_updated', `Article ID: ${id}`, 'admin');
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    logAuditEvent('post_deleted', `Article ID: ${id}`, 'admin');
  }, []);

  const adminLogin = useCallback(async (password: string, totpCode?: string) => {
    const rateLimitKey = 'login_admin';
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      logAuditEvent('rate_limit_triggered', 'Login attempt blocked', 'admin');
      return { success: false, error: `Too many attempts. Try again in ${Math.ceil((rateCheck.retryAfterMs || 0) / 1000)}s.`, retryAfterMs: rateCheck.retryAfterMs };
    }

    if (!securityState) {
      recordFailedAttempt(rateLimitKey);
      return { success: false, error: 'Invalid credentials.' };
    }

    // Verify password
    const passwordValid = await verifyPassword(password, securityState.passwordHash);
    if (!passwordValid) {
      recordFailedAttempt(rateLimitKey);
      logAuditEvent('login_failure', 'Invalid password', 'admin');
      return { success: false, error: 'Invalid credentials.' }; // Generic error — never reveals account existence
    }

    // Check if MFA is required
    if (securityState.totpEnabled && !totpCode) {
      return { success: false, needsMfa: true };
    }

    // Verify TOTP if enabled
    if (securityState.totpEnabled && totpCode) {
      if (!verifyTOTP(securityState.totpSecret!, totpCode)) {
        recordFailedAttempt(rateLimitKey + '_mfa');
        logAuditEvent('login_failure', 'Invalid TOTP code', 'admin');
        return { success: false, error: 'Invalid verification code.' };
      }
      logAuditEvent('mfa_verified', undefined, 'admin');
    }

    // Success — create session
    resetRateLimit(rateLimitKey);
    createSession();
    setIsAdminLoggedIn(true);
    logAuditEvent('login_success', undefined, 'admin');
    logAuditEvent('session_created', undefined, 'admin');

    return { success: true };
  }, [securityState]);

  const adminLogout = useCallback(() => {
    destroySession();
    setIsAdminLoggedIn(false);
    logAuditEvent('logout', undefined, 'admin');
    logAuditEvent('session_revoked', undefined, 'admin');
  }, []);

  const addContact = useCallback((message: Omit<ContactMessage, 'id' | 'date'>) => {
    const newContact: ContactMessage = {
      ...message,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setContacts(prev => [newContact, ...prev]);
  }, []);

  const incrementViews = useCallback((id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, views: a.views + 1 } : a));
  }, []);

  // ============ SECURITY OPERATIONS ============

  const setupInitialAccount = useCallback(async (password: string) => {
    const validation = validatePassword(password);
    if (!validation.valid) return { success: false, error: validation.error };

    const hash = await hashPassword(password);
    const emergencyKey = generateEmergencyKey();
    const keyHash = await hashEmergencyKey(emergencyKey);

    setSecurityState({
      passwordHash: hash,
      totpSecret: null,
      totpEnabled: false,
      recoveryCodeHashes: [],
      emergencyKeyHash: keyHash,
      mfaSetupComplete: false,
    });
    sessionStorage.setItem('sfa_initial_emergency_key', emergencyKey);
    logAuditEvent('password_changed', 'Initial account setup', 'admin');
    return { success: true };
  }, []);

  const setupTOTP = useCallback(() => {
    if (!securityState) return null;
    const { secret, uri } = generateTOTPSecret('SFA Daily Articles', 'admin');
    // Temporarily store secret for verification (not yet activated)
    sessionStorage.setItem('sfa_pending_totp_secret', secret);
    return { secret, uri };
  }, [securityState]);

  const verifyAndEnableTOTP = useCallback((code: string) => {
    const pendingSecret = sessionStorage.getItem('sfa_pending_totp_secret');
    if (!pendingSecret) return false;

    if (verifyTOTP(pendingSecret, code)) {
      setSecurityState(prev => prev ? {
        ...prev,
        totpSecret: pendingSecret,
        totpEnabled: true,
        mfaSetupComplete: true,
      } : null);
      sessionStorage.removeItem('sfa_pending_totp_secret');
      logAuditEvent('mfa_setup', undefined, 'admin');
      return true;
    }
    return false;
  }, []);

  const disableTOTP = useCallback(async (password: string) => {
    if (!securityState) return false;
    const valid = await verifyPassword(password, securityState.passwordHash);
    if (!valid) return false;
    setSecurityState(prev => prev ? { ...prev, totpSecret: null, totpEnabled: false } : null);
    logAuditEvent('mfa_reset', undefined, 'admin');
    return true;
  }, [securityState]);

  const getRecoveryCodes = useCallback(async () => {
    const codes = generateRecoveryCodes(10);
    const hashes = await hashRecoveryCodes(codes);
    setSecurityState(prev => prev ? { ...prev, recoveryCodeHashes: hashes } : null);
    logAuditEvent('recovery_code_used', 'Codes generated', 'admin');
    return codes;
  }, []);

  const regenerateRecoveryCodes = useCallback(async () => {
    return getRecoveryCodes();
  }, [getRecoveryCodes]);

  const getEmergencyKey = useCallback(() => {
    return sessionStorage.getItem('sfa_initial_emergency_key');
  }, []);

  const regenerateEmergencyKey = useCallback(async () => {
    const key = generateEmergencyKey();
    const keyHash = await hashEmergencyKey(key);
    setSecurityState(prev => prev ? { ...prev, emergencyKeyHash: keyHash } : null);
    sessionStorage.setItem('sfa_initial_emergency_key', key);
    return key;
  }, []);

  const recoverWithCode = useCallback(async (code: string) => {
    if (!securityState) return { success: false, error: 'No account found.' };
    const rateKey = 'recovery_code';
    const rateCheck = checkRateLimit(rateKey);
    if (!rateCheck.allowed) {
      return { success: false, error: `Too many attempts. Try again later.` };
    }

    const index = await verifyRecoveryCode(code, securityState.recoveryCodeHashes);
    if (index === -1) {
      recordFailedAttempt(rateKey);
      logAuditEvent('login_failure', 'Invalid recovery code', 'admin');
      return { success: false, error: 'Invalid recovery code.' };
    }

    // Consume the code
    const newHashes = [...securityState.recoveryCodeHashes];
    newHashes[index] = ''; // Invalidate used code
    setSecurityState(prev => prev ? { ...prev, recoveryCodeHashes: newHashes } : null);

    // Create temporary recovery state
    sessionStorage.setItem(RECOVERY_STATE_KEY, 'true');
    logAuditEvent('recovery_code_used', undefined, 'admin');
    return { success: true };
  }, [securityState]);

  const recoverWithKey = useCallback(async (key: string) => {
    if (!securityState) return { success: false, error: 'No account found.' };
    const rateKey = 'recovery_key';
    const rateCheck = checkRateLimit(rateKey);
    if (!rateCheck.allowed) {
      return { success: false, error: `Too many attempts. Try again later.` };
    }

    const valid = await verifyEmergencyKey(key, securityState.emergencyKeyHash);
    if (!valid) {
      recordFailedAttempt(rateKey);
      logAuditEvent('login_failure', 'Invalid emergency key', 'admin');
      return { success: false, error: 'Invalid recovery key.' };
    }

    sessionStorage.setItem(RECOVERY_STATE_KEY, 'true');
    logAuditEvent('recovery_key_used', undefined, 'admin');
    return { success: true };
  }, [securityState]);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    if (!securityState) return { success: false, error: 'No account found.' };
    const valid = await verifyPassword(oldPassword, securityState.passwordHash);
    if (!valid) {
      logAuditEvent('login_failure', 'Password change — invalid old password', 'admin');
      return { success: false, error: 'Current password is incorrect.' };
    }
    const validation = validatePassword(newPassword);
    if (!validation.valid) return { success: false, error: validation.error };

    const newHash = await hashPassword(newPassword);
    setSecurityState(prev => prev ? { ...prev, passwordHash: newHash } : null);
    logAuditEvent('password_changed', undefined, 'admin');
    return { success: true };
  }, [securityState]);

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <BlogContext.Provider value={{
      articles, filteredArticles, searchQuery, activeCategory,
      isAdminLoggedIn, contacts, securityState, auditLog,
      setSearchQuery, setActiveCategory,
      addArticle, updateArticle, deleteArticle,
      adminLogin, adminLogout, addContact, incrementViews,
      setupInitialAccount, setupTOTP, verifyAndEnableTOTP, disableTOTP,
      getRecoveryCodes, regenerateRecoveryCodes,
      getEmergencyKey, regenerateEmergencyKey,
      recoverWithCode, recoverWithKey, changePassword,
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be used within BlogProvider');
  return context;
}
