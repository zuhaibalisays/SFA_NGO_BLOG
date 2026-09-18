import { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { Article, Category } from '../types';
import { Lock, LogOut, Plus, Edit3, Trash2, Save, FileText, Eye, Shield, Key, RefreshCw, AlertTriangle, Download, Copy, Check, ChevronLeft } from 'lucide-react';
import { formatRetryAfter } from '../security';

const categories: Category[] = ['Articles', 'Book Reviews', 'Letters', 'Social Issues', 'Stories', 'Weekly Reports', 'Motivational'];

type DashboardView = 'login' | 'mfa' | 'forgot' | 'recovery-code' | 'recovery-key' | 'recovery-new-password' | 'dashboard' | 'security';

export default function AdminDashboard() {
  const {
    isAdminLoggedIn, adminLogin, adminLogout, articles, addArticle, updateArticle, deleteArticle,
    securityState, setupTOTP, verifyAndEnableTOTP, disableTOTP,
    getRecoveryCodes, regenerateRecoveryCodes, getEmergencyKey, regenerateEmergencyKey,
    recoverWithCode, recoverWithKey, changePassword,
  } = useBlog();

  const [view, setView] = useState<DashboardView>(isAdminLoggedIn ? 'dashboard' : 'login');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [retryAfter, setRetryAfter] = useState<number | undefined>();
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'security'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('SFA Student Writer');
  const [category, setCategory] = useState<Category>('Articles');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featured, setFeatured] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Security setup state
  const [totpUri, setTotpUri] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [emergencyKey, setEmergencyKey] = useState('');
  const [showCodes, setShowCodes] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copiedItem, setCopiedItem] = useState('');
  const [recoveryInput, setRecoveryInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [disablePassword, setDisablePassword] = useState('');

  // Retry countdown
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter(prev => prev && prev > 1000 ? prev - 1000 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const result = await adminLogin(password);
    if (result.success) {
      setView('dashboard');
      setPassword('');
    } else if (result.needsMfa) {
      setView('mfa');
    } else {
      setLoginError(result.error || 'Invalid credentials.');
      setRetryAfter(result.retryAfterMs);
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const result = await adminLogin(password, totpCode);
    if (result.success) {
      setView('dashboard');
      setPassword('');
      setTotpCode('');
    } else {
      setLoginError(result.error || 'Invalid code.');
      setRetryAfter(result.retryAfterMs);
    }
  };

  const handleRecoverWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await recoverWithCode(recoveryInput);
    if (result.success) {
      setView('recovery-new-password');
      setRecoveryInput('');
    } else {
      setLoginError(result.error || 'Invalid code.');
    }
  };

  const handleRecoverWithKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await recoverWithKey(recoveryInput);
    if (result.success) {
      setView('recovery-new-password');
      setRecoveryInput('');
    } else {
      setLoginError(result.error || 'Invalid key.');
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setLoginError('Passwords do not match.');
      return;
    }
    // For recovery, we use changePassword with the old password as a recovery marker
    // In this client-side implementation, we directly set the new password
    const result = await changePassword(password || 'recovery', newPassword);
    if (result.success) {
      setLoginError('');
      setView('login');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg('Password reset successful. Please log in.');
    } else {
      setLoginError(result.error || 'Failed to reset password.');
    }
  };

  const handleSetupTOTP = () => {
    const result = setupTOTP();
    if (result) {
      setTotpUri(result.uri);
      setTotpSecret(result.secret);
    }
  };

  const handleVerifyTOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAndEnableTOTP(totpCode)) {
      setTotpUri('');
      setTotpSecret('');
      setTotpCode('');
      setSuccessMsg('Two-factor authentication enabled successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setLoginError('Invalid code. Please try again.');
    }
  };

  const handleDisableTOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await disableTOTP(disablePassword)) {
      setDisablePassword('');
      setSuccessMsg('Two-factor authentication disabled.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setLoginError('Incorrect password.');
    }
  };

  const handleGenerateRecoveryCodes = async () => {
    const codes = await regenerateRecoveryCodes();
    setRecoveryCodes(codes);
    setShowCodes(true);
  };

  const handleGenerateEmergencyKey = async () => {
    const key = await regenerateEmergencyKey();
    setEmergencyKey(key);
    setShowKey(true);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await changePassword(oldPassword, newPassword);
    if (result.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg('Password changed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setLoginError(result.error || 'Failed to change password.');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(''), 2000);
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setTitle(''); setAuthor('SFA Student Writer'); setCategory('Articles');
    setCoverImage(''); setExcerpt(''); setContent(''); setFeatured(false);
    setEditingId(null); setSuccessMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !excerpt) { setSuccessMsg('Please fill in all required fields.'); return; }
    const readTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
    if (editingId) {
      updateArticle(editingId, { title, author, category, coverImage: coverImage || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop', excerpt, content, featured, readTime, tags: [category] });
      setSuccessMsg('Article updated!');
    } else {
      addArticle({ title, author, category, coverImage: coverImage || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop', excerpt, content, featured, readTime, tags: [category] });
      setSuccessMsg('Article published!');
    }
    resetForm();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleEdit = (article: Article) => {
    setTitle(article.title); setAuthor(article.author); setCategory(article.category);
    setCoverImage(article.coverImage); setExcerpt(article.excerpt); setContent(article.content);
    setFeatured(article.featured); setEditingId(article.id); setActiveTab('create');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this article?')) deleteArticle(id);
  };

  // ============ LOGIN VIEW ============
  if (view === 'login' && !isAdminLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8">
            <header className="text-center mb-6">
              <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-sm shadow-amber-500/20" aria-hidden="true">
                <Shield className="text-white" size={22} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Writer Login</h1>
              <p className="text-[13px] text-slate-500 mt-1">Secure access to the article editor</p>
            </header>

            {successMsg && <div className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-4 py-2.5 rounded-lg mb-4 text-[13px]" role="status">{successMsg}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-password" className="block text-[13px] font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={!!retryAfter}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200 disabled:opacity-50"
                  required
                  autoComplete="current-password"
                />
              </div>
              {loginError && <p className="text-red-500 text-[13px]" role="alert">{loginError}</p>}
              {retryAfter && retryAfter > 0 && (
                <p className="text-amber-600 text-[12px] flex items-center gap-1.5" role="status">
                  <AlertTriangle size={13} /> Too many attempts. Wait {formatRetryAfter(retryAfter)}.
                </p>
              )}
              <button
                type="submit"
                disabled={!!retryAfter}
                className="w-full py-2.5 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-700 transition-colors duration-200 disabled:opacity-50"
              >
                Sign In
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => { setView('forgot'); setLoginError(''); }}
                className="w-full text-center text-[12px] text-slate-500 hover:text-amber-600 transition-colors duration-200 font-medium"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ MFA VIEW ============
  if (view === 'mfa') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8">
            <header className="text-center mb-6">
              <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
                <Key className="text-white" size={22} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Two-Factor Authentication</h1>
              <p className="text-[13px] text-slate-500 mt-1">Enter the 6-digit code from your authenticator app</p>
            </header>
            <form onSubmit={handleMfaVerify} className="space-y-4">
              <div>
                <label htmlFor="mfa-code" className="block text-[13px] font-medium text-slate-700 mb-1.5">Verification Code</label>
                <input
                  id="mfa-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400"
                  required
                  autoFocus
                  autoComplete="one-time-code"
                />
              </div>
              {loginError && <p className="text-red-500 text-[13px]" role="alert">{loginError}</p>}
              <button type="submit" className="w-full py-2.5 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-700 transition-colors">Verify</button>
              <button type="button" onClick={() => { setView('login'); setTotpCode(''); setLoginError(''); }} className="w-full text-[12px] text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1">
                <ChevronLeft size={13} /> Back to login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ============ FORGOT PASSWORD VIEW ============
  if (view === 'forgot') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8">
            <header className="text-center mb-6">
              <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
                <Key className="text-white" size={22} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Account Recovery</h1>
              <p className="text-[13px] text-slate-500 mt-1">Choose a recovery method</p>
            </header>

            <div className="space-y-3">
              <button
                onClick={() => { setView('recovery-code'); setLoginError(''); }}
                className="w-full p-4 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition-all duration-200 group"
              >
                <p className="text-[13px] font-semibold text-slate-800 group-hover:text-amber-700">Use Recovery Code</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Enter one of your saved recovery codes</p>
              </button>
              <button
                onClick={() => { setView('recovery-key'); setLoginError(''); }}
                className="w-full p-4 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition-all duration-200 group"
              >
                <p className="text-[13px] font-semibold text-slate-800 group-hover:text-amber-700">Use Emergency Recovery Key</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Enter your emergency recovery key (NGO-XXXX-...)</p>
              </button>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-[13px] font-semibold text-slate-800">Contact SFA Administrator</p>
                <p className="text-[11px] text-slate-500 mt-0.5">If you've lost all recovery options, contact the SFA admin for manual identity verification and account recovery.</p>
              </div>
            </div>

            <button onClick={() => { setView('login'); setLoginError(''); }} className="w-full mt-4 text-[12px] text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1">
              <ChevronLeft size={13} /> Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ RECOVERY CODE/KEY VIEWS ============
  if (view === 'recovery-code' || view === 'recovery-key') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8">
            <header className="text-center mb-6">
              <h1 className="text-lg font-bold text-slate-800">
                {view === 'recovery-code' ? 'Enter Recovery Code' : 'Enter Emergency Key'}
              </h1>
              <p className="text-[13px] text-slate-500 mt-1">
                {view === 'recovery-code' ? 'Format: XXXX-XXXX-XXXX' : 'Format: NGO-XXXX-XXXX-XXXX-XXXX'}
              </p>
            </header>
            <form onSubmit={view === 'recovery-code' ? handleRecoverWithCode : handleRecoverWithKey} className="space-y-4">
              <input
                type="text"
                value={recoveryInput}
                onChange={(e) => setRecoveryInput(e.target.value.toUpperCase())}
                placeholder={view === 'recovery-code' ? 'XXXX-XXXX-XXXX' : 'NGO-XXXX-XXXX-XXXX-XXXX'}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-center text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400"
                required
                autoFocus
              />
              {loginError && <p className="text-red-500 text-[13px]" role="alert">{loginError}</p>}
              <button type="submit" className="w-full py-2.5 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-400 transition-colors">Verify</button>
              <button type="button" onClick={() => { setView('forgot'); setLoginError(''); setRecoveryInput(''); }} className="w-full text-[12px] text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1">
                <ChevronLeft size={13} /> Back
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ============ NEW PASSWORD (after recovery) ============
  if (view === 'recovery-new-password') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8">
            <header className="text-center mb-6">
              <h1 className="text-lg font-bold text-slate-800">Set New Password</h1>
              <p className="text-[13px] text-slate-500 mt-1">Choose a strong password (minimum 12 characters)</p>
            </header>
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div>
                <label htmlFor="new-pw" className="block text-[13px] font-medium text-slate-700 mb-1.5">New Password</label>
                <input id="new-pw" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400" required minLength={12} />
              </div>
              <div>
                <label htmlFor="confirm-pw" className="block text-[13px] font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <input id="confirm-pw" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400" required minLength={12} />
              </div>
              {loginError && <p className="text-red-500 text-[13px]" role="alert">{loginError}</p>}
              <button type="submit" className="w-full py-2.5 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-400 transition-colors">Reset Password</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ============ DASHBOARD ============
  return (
    <section aria-labelledby="dashboard-heading">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 id="dashboard-heading" className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-amber-500" size={20} aria-hidden="true" />
            Writer Dashboard
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Create, edit, and manage articles</p>
        </div>
        <button onClick={adminLogout} className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 text-red-600 rounded-lg text-[12px] font-medium hover:bg-red-100 transition-colors ring-1 ring-red-200/50" aria-label="Logout">
          <LogOut size={14} aria-hidden="true" /> Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6 bg-slate-100 p-1 rounded-lg w-fit" role="tablist">
        {(['create', 'manage', 'security'] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); if (tab !== 'create') resetForm(); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-medium transition-all duration-200 ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            role="tab" aria-selected={activeTab === tab}>
            {tab === 'create' && <Plus size={14} aria-hidden="true" />}
            {tab === 'manage' && <Eye size={14} aria-hidden="true" />}
            {tab === 'security' && <Shield size={14} aria-hidden="true" />}
            {tab === 'create' ? (editingId ? 'Edit' : 'Create') : tab === 'manage' ? `Manage (${articles.length})` : 'Security'}
          </button>
        ))}
      </div>

      {successMsg && <div className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-4 py-3 rounded-lg mb-4 text-[13px]" role="status">✓ {successMsg}</div>}
      {loginError && activeTab === 'security' && <div className="bg-red-50 border border-red-200/60 text-red-600 px-4 py-3 rounded-lg mb-4 text-[13px]" role="alert">{loginError}</div>}

      {/* CREATE TAB */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label htmlFor="art-title" className="block text-[13px] font-medium text-slate-700 mb-1.5">Article Title *</label>
                <input id="art-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400" required />
              </div>
              <div>
                <label htmlFor="art-author" className="block text-[13px] font-medium text-slate-700 mb-1.5">Author</label>
                <input id="art-author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400" />
              </div>
              <div>
                <label htmlFor="art-cat" className="block text-[13px] font-medium text-slate-700 mb-1.5">Category *</label>
                <select id="art-cat" value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="art-img" className="block text-[13px] font-medium text-slate-700 mb-1.5">Cover Image URL</label>
                <input id="art-img" type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="art-exc" className="block text-[13px] font-medium text-slate-700 mb-1.5">Excerpt *</label>
                <textarea id="art-exc" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 resize-none" required />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500/30" />
                  <span className="text-[13px] text-slate-600 font-medium">Mark as Featured</span>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="art-content" className="block text-[13px] font-medium text-slate-700 mb-1.5">Content * <span className="text-slate-400 font-normal">(Markdown supported)</span></label>
              <textarea id="art-content" value={content} onChange={(e) => setContent(e.target.value)} rows={14} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 resize-y" required />
            </div>
            <div className="flex gap-2.5">
              <button type="submit" className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-400 transition-colors shadow-sm shadow-amber-500/20">
                <Save size={14} aria-hidden="true" /> {editingId ? 'Update' : 'Publish'}
              </button>
              {editingId && <button type="button" onClick={resetForm} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors">Cancel</button>}
            </div>
          </form>
        </div>
      )}

      {/* MANAGE TAB */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th scope="col" className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th scope="col" className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th scope="col" className="text-right px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5"><p className="text-[13px] font-medium text-slate-800 line-clamp-1">{a.title}</p><p className="text-[11px] text-slate-400 mt-0.5">{a.author}</p></td>
                    <td className="px-5 py-3.5 hidden md:table-cell"><span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/50 uppercase">{a.category}</span></td>
                    <td className="px-5 py-3.5 hidden sm:table-cell text-[12px] text-slate-500"><time dateTime={a.date}>{a.date}</time></td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(a)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md" aria-label={`Edit: ${a.title}`}><Edit3 size={14} aria-hidden="true" /></button>
                        <button onClick={() => handleDelete(a.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md" aria-label={`Delete: ${a.title}`}><Trash2 size={14} aria-hidden="true" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="space-y-5">
          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6">
            <h2 className="text-[14px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Lock size={15} className="text-amber-500" aria-hidden="true" /> Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Current password" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400" required autoComplete="current-password" />
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password (min 12 chars)" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400" required minLength={12} autoComplete="new-password" />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400" required minLength={12} autoComplete="new-password" />
              <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-[12px] font-medium hover:bg-slate-700 transition-colors">Update Password</button>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6">
            <h2 className="text-[14px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Shield size={15} className="text-amber-500" aria-hidden="true" /> Two-Factor Authentication (TOTP)
            </h2>
            {securityState?.totpEnabled ? (
              <div>
                <p className="text-[12px] text-emerald-600 font-medium mb-3 flex items-center gap-1.5"><Check size={13} /> MFA is enabled</p>
                <form onSubmit={handleDisableTOTP} className="flex gap-2">
                  <input type="password" value={disablePassword} onChange={(e) => setDisablePassword(e.target.value)} placeholder="Enter password to disable" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30" required />
                  <button type="submit" className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[12px] font-medium hover:bg-red-100 ring-1 ring-red-200/50">Disable</button>
                </form>
              </div>
            ) : (
              <div>
                {!totpUri ? (
                  <button onClick={handleSetupTOTP} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-[12px] font-medium hover:bg-amber-400 transition-colors">Setup TOTP</button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[12px] text-slate-600">Scan this QR code with your authenticator app (Google Authenticator, Aegis, FreeOTP, etc.):</p>
                    <div className="p-4 bg-white rounded-lg ring-1 ring-slate-200 text-center">
                      <p className="text-[11px] text-slate-400 mb-2">QR Code URI:</p>
                      <code className="text-[10px] text-slate-600 break-all">{totpUri}</code>
                    </div>
                    <div>
                      <p className="text-[12px] text-slate-600 mb-1">Or enter this secret manually:</p>
                      <code className="text-[13px] font-mono bg-slate-50 px-3 py-1.5 rounded border border-slate-200 text-slate-700">{totpSecret}</code>
                    </div>
                    <form onSubmit={handleVerifyTOTP} className="flex gap-2">
                      <input type="text" inputMode="numeric" maxLength={6} value={totpCode} onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))} placeholder="Enter 6-digit code" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500/30" required />
                      <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-[12px] font-medium hover:bg-emerald-400">Verify & Enable</button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recovery Codes */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6">
            <h2 className="text-[14px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Key size={15} className="text-amber-500" aria-hidden="true" /> Recovery Codes
            </h2>
            <p className="text-[12px] text-slate-500 mb-3">Recovery codes let you access your account if you lose your authenticator device. Each code can only be used once.</p>
            {!showCodes ? (
              <button onClick={handleGenerateRecoveryCodes} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-[12px] font-medium hover:bg-slate-700 transition-colors flex items-center gap-1.5">
                <RefreshCw size={13} aria-hidden="true" /> Generate Recovery Codes
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-3">
                  <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1"><AlertTriangle size={12} /> Save these codes now. They won't be shown again.</p>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {recoveryCodes.map((code, i) => (
                    <code key={i} className="text-[11px] font-mono bg-slate-50 px-2 py-1.5 rounded border border-slate-200 text-slate-700">{code}</code>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyToClipboard(recoveryCodes.join('\n'), 'codes')} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium hover:bg-slate-200 flex items-center gap-1">
                    {copiedItem === 'codes' ? <Check size={12} /> : <Copy size={12} />} {copiedItem === 'codes' ? 'Copied!' : 'Copy All'}
                  </button>
                  <button onClick={() => downloadAsFile(recoveryCodes.join('\n'), 'sfa-recovery-codes.txt')} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium hover:bg-slate-200 flex items-center gap-1">
                    <Download size={12} /> Download
                  </button>
                </div>
                <button onClick={() => setShowCodes(false)} className="text-[11px] text-slate-500 hover:text-slate-700">Dismiss</button>
              </div>
            )}
          </div>

          {/* Emergency Recovery Key */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6">
            <h2 className="text-[14px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Key size={15} className="text-red-500" aria-hidden="true" /> Emergency Recovery Key
            </h2>
            <p className="text-[12px] text-slate-500 mb-3">This key can recover your account if you lose everything. <strong className="text-red-600">Anyone with this key can access your account.</strong></p>
            {!showKey ? (
              <button onClick={handleGenerateEmergencyKey} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[12px] font-medium hover:bg-red-100 ring-1 ring-red-200/50 flex items-center gap-1.5">
                <RefreshCw size={13} aria-hidden="true" /> Generate New Key
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200/60 rounded-lg p-3">
                  <p className="text-[11px] text-red-700 font-medium flex items-center gap-1"><AlertTriangle size={12} /> Store this key securely. It will not be shown again.</p>
                </div>
                <code className="block text-[14px] font-mono bg-slate-50 px-4 py-3 rounded-lg border border-slate-200 text-slate-800 text-center tracking-wider">{emergencyKey}</code>
                <div className="flex gap-2">
                  <button onClick={() => copyToClipboard(emergencyKey, 'key')} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium hover:bg-slate-200 flex items-center gap-1">
                    {copiedItem === 'key' ? <Check size={12} /> : <Copy size={12} />} {copiedItem === 'key' ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={() => downloadAsFile(emergencyKey, 'sfa-emergency-key.txt')} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium hover:bg-slate-200 flex items-center gap-1">
                    <Download size={12} /> Download
                  </button>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-amber-500" onChange={(e) => { if (e.target.checked) setShowKey(false); }} />
                  <span className="text-[11px] text-slate-600">I have saved my recovery key</span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
