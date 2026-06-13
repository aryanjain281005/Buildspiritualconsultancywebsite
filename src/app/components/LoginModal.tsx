import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth, isAdminEmail } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router';

// Google "G" SVG logo
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

type Tab = 'login' | 'signup';

export default function LoginModal() {
  const { user, isAdmin, login, signup, loginWithGoogle, logout, loginModalOpen, closeLoginModal } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Detect admin email while typing — force to login-only mode
  const isAdminTyping = isAdminEmail(email);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLoginModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeLoginModal]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (loginModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [loginModalOpen]);

  // Reset form when tab changes
  useEffect(() => {
    setError(''); setSuccess(''); setName(''); setEmail(''); setPassword('');
  }, [tab]);

  // If admin email is typed and we're on signup, switch to login
  useEffect(() => {
    if (isAdminTyping && tab === 'signup') {
      setTab('login');
      setError('');
    }
  }, [isAdminTyping, tab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
        setSuccess('Welcome back! Signing you in…');
        setTimeout(() => {
          closeLoginModal();
          // Redirect based on role — check if admin email
          if (isAdminEmail(email)) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        await signup(name, email, password);
        setSuccess('Account created! Welcome to Vyana Soul ✦');
        setTimeout(() => {
          closeLoginModal();
          navigate('/');
        }, 1000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      // Page will redirect, no need to close modal
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
      setGoogleLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    closeLoginModal();
    navigate('/');
  };

  const goToDashboard = () => {
    closeLoginModal();
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  // ── Colours ─────────────────────────────────────────────
  const bg = isDark ? '#0D0821' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.18)';
  const inputBg = isDark ? 'rgba(124,58,237,0.07)' : 'rgba(124,58,237,0.04)';
  const inputBorder = isDark ? 'rgba(124,58,237,0.22)' : 'rgba(124,58,237,0.15)';
  const textPrimary = isDark ? '#EDE9FF' : '#1E1048';
  const textMuted = isDark ? 'rgba(237,233,255,0.5)' : 'rgba(30,16,72,0.45)';

  return (
    <AnimatePresence>
      {loginModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
            onClick={closeLoginModal}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: bg, border: `1px solid ${cardBorder}`, pointerEvents: 'auto', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Glow */}
              <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }} />

              {/* Close */}
              <button onClick={closeLoginModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors z-10"
                style={{ background: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)', color: textMuted }}>
                <X className="w-4 h-4" />
              </button>

              <div className="p-7 pt-8">
                {user ? (
                  /* ── Logged-in mini-dashboard ── */
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-500/30" />
                      ) : (
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                          style={{ background: isAdmin ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #7C3AED, #a855f7)' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold" style={{ color: textPrimary }}>{user.name}</p>
                        <p className="text-sm truncate max-w-[200px]" style={{ color: textMuted }}>{user.email}</p>
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: isAdmin ? 'rgba(245,158,11,0.15)' : 'rgba(124,58,237,0.15)',
                            color: isAdmin ? '#D97706' : '#7C3AED'
                          }}>
                          {isAdmin && <Shield className="w-3 h-3" />}
                          {isAdmin ? 'Admin' : 'User'}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(245,158,11,0.35)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={goToDashboard}
                        className="w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 mb-3"
                        style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </motion.button>
                    )}

                    <button onClick={handleLogout}
                      className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-80"
                      style={{ background: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  /* ── Auth form ── */
                  <div>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                        style={{ background: isAdminTyping ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
                        <span className="text-white text-xl">{isAdminTyping ? '🛡️' : '✦'}</span>
                      </div>
                      <h2 className="text-xl font-bold" style={{ color: textPrimary }}>
                        {isAdminTyping ? 'Admin Login' : tab === 'login' ? 'Welcome Back' : 'Create Account'}
                      </h2>
                      <p className="text-sm mt-1" style={{ color: textMuted }}>
                        {isAdminTyping ? 'Sign in with your admin credentials' : tab === 'login' ? 'Sign in to your Vyana Soul account' : 'Begin your spiritual journey'}
                      </p>
                    </div>

                    {/* Tabs — hidden when admin email is detected */}
                    {!isAdminTyping && (
                      <div className="flex rounded-xl p-1 mb-5" style={{ background: isDark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.05)', border: `1px solid ${inputBorder}` }}>
                        {(['login', 'signup'] as Tab[]).map(t => (
                          <button key={t} onClick={() => setTab(t)}
                            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                            style={{
                              background: tab === t ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'transparent',
                              color: tab === t ? 'white' : textMuted,
                            }}>
                            {t === 'login' ? <><LogIn className="w-3.5 h-3.5" /> Sign In</> : <><UserPlus className="w-3.5 h-3.5" /> Sign Up</>}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Admin badge */}
                    {isAdminTyping && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4"
                        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                          Admin account detected — login only
                        </span>
                      </div>
                    )}

                    {/* Google OAuth — only show for non-admin */}
                    {!isAdminTyping && (
                      <>
                        <button
                          type="button"
                          onClick={handleGoogle}
                          disabled={googleLoading}
                          className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium transition-all mb-4 hover:opacity-80"
                          style={{
                            background: isDark ? 'rgba(255,255,255,0.06)' : '#F8F8F8',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                            color: textPrimary,
                            cursor: googleLoading ? 'not-allowed' : 'pointer',
                          }}>
                          {googleLoading ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                          ) : <GoogleIcon />}
                          Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1 h-px" style={{ background: inputBorder }} />
                          <span className="text-xs" style={{ color: textMuted }}>or continue with email</span>
                          <div className="flex-1 h-px" style={{ background: inputBorder }} />
                        </div>
                      </>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {tab === 'signup' && !isAdminTyping && (
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} />
                          <input
                            type="text" placeholder="Full Name" value={name}
                            onChange={e => setName(e.target.value)} required
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/30"
                            style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }}
                          />
                        </div>
                      )}

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} />
                        <input
                          type="email" placeholder="Email Address" value={email}
                          onChange={e => setEmail(e.target.value)} required
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/30"
                          style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }}
                        />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} />
                        <input
                          type={showPw ? 'text' : 'password'} placeholder="Password" value={password}
                          onChange={e => setPassword(e.target.value)} required
                          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/30"
                          style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }}
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: textMuted }}>
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <AnimatePresence>
                        {error && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="text-sm px-3 py-2 rounded-lg"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                            {error}
                          </motion.p>
                        )}
                        {success && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="text-sm px-3 py-2 rounded-lg"
                            style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }}>
                            {success}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <motion.button type="submit" disabled={loading}
                        whileHover={{ scale: 1.02, boxShadow: isAdminTyping ? '0 6px 24px rgba(245,158,11,0.4)' : '0 6px 24px rgba(124,58,237,0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2"
                        style={{
                          background: loading
                            ? (isAdminTyping ? 'rgba(245,158,11,0.5)' : 'rgba(124,58,237,0.5)')
                            : (isAdminTyping ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)'),
                          cursor: loading ? 'not-allowed' : 'pointer',
                        }}>
                        {loading ? (
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                        ) : isAdminTyping ? (
                          <><Shield className="w-4 h-4" /> Admin Sign In</>
                        ) : tab === 'login' ? (
                          <><LogIn className="w-4 h-4" /> Sign In</>
                        ) : (
                          <><UserPlus className="w-4 h-4" /> Create Account</>
                        )}
                      </motion.button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
