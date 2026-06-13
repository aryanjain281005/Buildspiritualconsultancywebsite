import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Sun, Moon, Menu, X, ArrowRight, LogIn, User, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, isAdminEmail } from '../context/AuthContext';
import logoImg from '../../imports/image-6.png';

const navIds = ['home', 'about', 'consultancy', 'gallery', 'testimonials', 'faq', 'contact'];

export default function Header() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { user, isAdmin, openLoginModal } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navItems = [
    { label: t.nav.home, id: 'home' },
    { label: t.nav.about, id: 'about' },
    { label: t.nav.consultancy, id: 'consultancy' },
    { label: t.nav.gallery, id: 'gallery' },
    { label: t.nav.reviews, id: 'testimonials' },
    { label: t.nav.faq, id: 'faq' },
    { label: t.nav.contact, id: 'contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); }); },
      { threshold: 0.25, rootMargin: '-80px 0px -60% 0px' }
    );
    navIds.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = useCallback((id: string) => {
    setMobileOpen(false);
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
      setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 300);
    }
  }, [isHome, navigate]);

  const headerBg = scrolled
    ? isDark ? 'rgba(6,3,18,0.95)' : 'rgba(255,255,255,0.95)'
    : isDark ? 'rgba(6,3,18,0.3)' : 'rgba(255,255,255,0.1)';

  const headerBorder = scrolled
    ? isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)'
    : 'rgba(0,0,0,0)';

  return (
    <>
      <motion.header
        initial={false}
        animate={{ backgroundColor: headerBg, borderBottomColor: headerBorder }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <motion.button whileHover={{ scale: 1.02 }} onClick={() => handleNavClick('home')} className="flex items-center flex-shrink-0">
              <img src={logoImg} alt="Vyana Soul" className="h-10 md:h-12 w-auto object-contain" />
            </motion.button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="relative px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium group"
                  style={{ color: activeSection === item.id && isHome ? '#7C3AED' : scrolled ? isDark ? 'rgba(237,233,255,0.8)' : 'rgba(30,16,72,0.7)' : 'rgba(255,255,255,0.85)' }}
                >
                  {item.label}
                  {activeSection === item.id && isHome && (
                    <motion.div layoutId="activeNav" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: '#7C3AED' }} />
                  )}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: isDark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.06)' }} />
                </button>
              ))}
              <Link to="/blog" className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-[#7C3AED]"
                style={{ color: location.pathname === '/blog' ? '#7C3AED' : scrolled ? isDark ? 'rgba(237,233,255,0.8)' : 'rgba(30,16,72,0.7)' : 'rgba(255,255,255,0.85)' }}>
                {t.nav.blog}
              </Link>
              <Link to="/courses" className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-[#7C3AED]"
                style={{ color: location.pathname === '/courses' ? '#7C3AED' : scrolled ? isDark ? 'rgba(237,233,255,0.8)' : 'rgba(30,16,72,0.7)' : 'rgba(255,255,255,0.85)' }}>
                {t.nav.courses}
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <div
                className="hidden sm:flex items-center rounded-xl overflow-hidden border text-xs font-semibold"
                style={{ border: `1px solid ${isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.2)'}` }}
                aria-label="Toggle language"
              >
                <button
                  onClick={() => setLang('en')}
                  className="px-2.5 py-1.5 transition-all duration-200"
                  style={{
                    background: lang === 'en' ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'rgba(0,0,0,0)',
                    color: lang === 'en' ? 'white' : isDark ? 'rgba(237,233,255,0.6)' : 'rgba(30,16,72,0.5)',
                  }}>EN</button>
                <button
                  onClick={() => setLang('hi')}
                  className="px-2.5 py-1.5 transition-all duration-200"
                  style={{
                    background: lang === 'hi' ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'rgba(0,0,0,0)',
                    color: lang === 'hi' ? 'white' : isDark ? 'rgba(237,233,255,0.6)' : 'rgba(30,16,72,0.5)',
                  }}>हिं</button>
              </div>

              {/* Theme Toggle */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{ background: isDark ? 'rgba(124,58,237,0.15)' : scrolled ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.1)', border: `1px solid ${isDark ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.15)'}` }}
                aria-label="Toggle theme">
                <AnimatePresence mode="wait">
                  <motion.div key={theme} initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.2 }}>
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#7C3AED]" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Admin Direct Access */}
              {isAdmin && (
                <Link to="/admin" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}

              {/* Book Now CTA */}
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.97 }} onClick={() => handleNavClick('consultancy')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-medium"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
                {t.nav.bookNow}
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>

              {/* Login / User Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openLoginModal()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: user ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.08)',
                  color: user ? 'white' : isDark ? 'rgba(237,233,255,0.85)' : '#7C3AED',
                  border: `1px solid ${isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.2)'}`,
                }}
                aria-label={user ? 'Dashboard' : 'Login'}
              >
                {user ? (
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {user ? user.name.split(' ')[0] : 'Login'}
                </span>
              </motion.button>

              {/* Hamburger */}
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)', color: isDark ? 'white' : '#1E1048' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={mobileOpen ? 'close' : 'open'} initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 lg:hidden shadow-2xl"
            style={{ background: isDark ? 'rgba(6,3,18,0.98)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)'}` }}>
            <div className="container mx-auto px-4 py-4">
              <nav className="grid grid-cols-2 gap-1 mb-4">
                {navItems.map((item, i) => (
                  <motion.button key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => handleNavClick(item.id)} className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{ color: activeSection === item.id && isHome ? '#7C3AED' : isDark ? 'rgba(237,233,255,0.8)' : 'rgba(30,16,72,0.8)', background: activeSection === item.id && isHome ? 'rgba(124,58,237,0.1)' : 'transparent' }}>
                    {item.label}
                  </motion.button>
                ))}
                <Link to="/blog" onClick={() => setMobileOpen(false)} className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: isDark ? 'rgba(237,233,255,0.8)' : 'rgba(30,16,72,0.8)' }}>
                  {t.nav.blog}
                </Link>
                <Link to="/courses" onClick={() => setMobileOpen(false)} className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: isDark ? 'rgba(237,233,255,0.8)' : 'rgba(30,16,72,0.8)' }}>
                  {t.nav.courses}
                </Link>
              </nav>

              {/* Mobile Language Toggle */}
              <div className="flex items-center gap-3 mb-3 px-1">
                <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(237,233,255,0.5)' : 'rgba(30,16,72,0.5)' }}>Language:</span>
                <div className="flex items-center rounded-xl overflow-hidden border text-xs font-semibold"
                  style={{ border: `1px solid ${isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.2)'}` }}>
                  <button onClick={() => setLang('en')} className="px-3 py-1.5 transition-all"
                    style={{ background: lang === 'en' ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'transparent', color: lang === 'en' ? 'white' : isDark ? 'rgba(237,233,255,0.5)' : 'rgba(30,16,72,0.5)' }}>EN</button>
                  <button onClick={() => setLang('hi')} className="px-3 py-1.5 transition-all"
                    style={{ background: lang === 'hi' ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'transparent', color: lang === 'hi' ? 'white' : isDark ? 'rgba(237,233,255,0.5)' : 'rgba(30,16,72,0.5)' }}>हिंदी</button>
                </div>
              </div>

              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                onClick={() => handleNavClick('consultancy')} className="w-full py-3.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
                {t.nav.bookSession}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.3)' }} onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}