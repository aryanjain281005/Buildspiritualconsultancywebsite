import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  LayoutDashboard, BookOpen, Calendar, User, LogOut,
  Plus, X, Clock, CheckCircle2, XCircle, ChevronRight,
  Sparkles, Phone, Mail, Bell, Settings, Shield, MessageSquare,
} from 'lucide-react';
import { useAuth, apiFetch, getSupabase } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AdminPanelFull from '../components/AdminPanelFull';

// ── Types ──────────────────────────────────────────────────
interface Booking {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface ConsultancyRequest {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  service?: string;
  preferredTime?: string;
  message?: string;
  status: string;
  createdAt: string;
}

interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  enrolledAt: string;
  progress: number;
  status: string;
}

const SERVICES = [
  'Personal Akashic Reading',
  'Relationship Akashic Reading',
  'Past Life Exploration',
  'Soul Purpose Consultation',
  'Group Akashic Workshop',
  'Akashic Records Level 1 Course',
  'Akashic Records Level 2 Course',
  'Akashic Records Level 3 Course',
];

const STAT_COLORS = ['#7C3AED', '#a855f7', '#6D28D9'];

// ── Spinner ─────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#7C3AED" strokeWidth="4" />
      <path className="opacity-75" fill="#7C3AED" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ── Status Badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
    pending:   { bg: 'rgba(251,191,36,0.15)',  color: '#b45309',  icon: <Clock className="w-3 h-3" /> },
    confirmed: { bg: 'rgba(34,197,94,0.15)',   color: '#16a34a',  icon: <CheckCircle2 className="w-3 h-3" /> },
    cancelled: { bg: 'rgba(239,68,68,0.12)',   color: '#dc2626',  icon: <XCircle className="w-3 h-3" /> },
    active:    { bg: 'rgba(124,58,237,0.15)',  color: '#7C3AED',  icon: <Sparkles className="w-3 h-3" /> },
  };
  const c = config[status] ?? config.pending;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.color }}>
      {c.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ── New Booking Modal ────────────────────────────────────────
function NewBookingModal({
  isDark, onClose, onSave,
}: { isDark: boolean; onClose: () => void; onSave: (b: { service: string; date: string; time: string; notes: string }) => void }) {
  const [service, setService] = useState(SERVICES[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const inputBg = isDark ? 'rgba(124,58,237,0.07)' : 'rgba(124,58,237,0.04)';
  const inputBorder = isDark ? 'rgba(124,58,237,0.22)' : 'rgba(124,58,237,0.15)';
  const textPrimary = isDark ? '#EDE9FF' : '#1E1048';
  const textMuted = isDark ? 'rgba(237,233,255,0.5)' : 'rgba(30,16,72,0.45)';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ background: isDark ? '#0D0821' : '#FFFFFF', border: `1px solid ${inputBorder}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg" style={{ color: textPrimary }}>Book a Session</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: textMuted }}>Service</label>
            <select value={service} onChange={e => setService(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }}>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: textMuted }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: textMuted }}>Time (optional)</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: textMuted }}>Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Any specific intentions or questions…"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { if (date) onSave({ service, date, time, notes }); }}
            className="w-full py-3 rounded-xl text-white font-medium text-sm"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', opacity: date ? 1 : 0.5 }}>
            Request Booking
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Sidebar nav items ────────────────────────────────────────
type NavKey = 'overview' | 'bookings' | 'courses' | 'profile';
type AdminNavKey = NavKey | 'admin';

const BASE_NAV: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview',  label: 'Overview',  icon: <LayoutDashboard className="w-4 h-4" /> },
  { key: 'bookings',  label: 'Bookings',  icon: <Calendar className="w-4 h-4" /> },
  { key: 'courses',   label: 'My Courses', icon: <BookOpen className="w-4 h-4" /> },
  { key: 'profile',   label: 'Profile',   icon: <User className="w-4 h-4" /> },
];

// ══════════════════════════════════════════════════════════════
// Main Dashboard Component
// ══════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { user, accessToken, logout, loading: authLoading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const supabase = getSupabase();
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin
    ? [...BASE_NAV, { key: 'admin' as const, label: 'Admin Dashboard', icon: <Shield className="w-4 h-4" /> }]
    : BASE_NAV;

  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeNav, setActiveNav] = useState<AdminNavKey>(
    tabParam === 'admin' && isAdmin ? 'admin' : isAdmin ? 'admin' : 'overview'
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [consultancyRequests, setConsultancyRequests] = useState<ConsultancyRequest[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [user, authLoading, navigate]);

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    try {
      const bRes = await apiFetch('/bookings', accessToken).catch(e => ({ error: e.message }));
      if (bRes.error) {
        console.error('Bookings fetch error:', bRes.error);
        setFetchError(`Bookings: ${bRes.error}`);
      } else {
        setBookings((bRes.bookings ?? []).map((booking: any) => ({
          id: booking.id,
          userId: booking.userId,
          userName: booking.userName,
          userEmail: booking.userEmail,
          service: booking.service,
          date: booking.date,
          time: booking.time,
          notes: booking.notes,
          status: booking.status,
          createdAt: booking.createdAt,
        })));
      }

      if (isAdmin) {
        const crRes = await apiFetch('/consultancy', accessToken).catch(e => ({ error: e.message }));
        if (crRes.error) {
          console.error('Consultancy fetch error:', crRes.error);
          setFetchError(prev => prev ? `${prev} | Consultancy: ${crRes.error}` : `Consultancy: ${crRes.error}`);
        } else {
          setConsultancyRequests((crRes.requests ?? []).map((cr: any) => ({
            id: cr.id,
            fullName: cr.fullName,
            email: cr.email,
            phone: cr.phone,
            service: cr.service,
            preferredTime: cr.preferredTime,
            message: cr.message,
            status: cr.status ?? 'pending',
            createdAt: cr.createdAt,
          })));
        }
      }

      const eRes = await apiFetch('/enrollments', accessToken).catch(e => ({ error: e.message }));
      if (eRes.error) {
        console.error('Enrollments fetch error:', eRes.error);
      } else {
        setEnrollments(eRes.enrollments ?? []);
      }
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load data.');
      console.log('Dashboard fetch error:', err);
    } finally {
      setFetchLoading(false);
    }
  }, [accessToken, isAdmin, supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleNewBooking = async (form: { service: string; date: string; time: string; notes: string }) => {
    if (!accessToken) return;
    setBookingLoading(true);
    try {
      const bookingId = `bk_${Date.now()}`;
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          id: bookingId,
          user_id: user?.id,
          user_name: user?.name ?? 'User',
          user_email: user?.email ?? '',
          service: form.service,
          booking_date: form.date,
          booking_time: form.time ?? '',
          notes: form.notes ?? '',
          status: 'pending',
        })
        .select('id, user_id, user_name, user_email, service, booking_date, booking_time, notes, status, created_at, updated_at')
        .single();

      if (error) throw new Error(error.message);

      setBookings(prev => [{
        id: data.id,
        userId: data.user_id,
        userName: data.user_name,
        userEmail: data.user_email,
        service: data.service,
        date: data.booking_date,
        time: data.booking_time,
        notes: data.notes,
        status: data.status,
        createdAt: data.created_at,
      }, ...prev].filter(Boolean));
      setShowNewBooking(false);
      setActiveNav('bookings');
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Failed to create booking.');
      console.log('Booking error:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!accessToken) return;
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .select('id, user_id, user_name, user_email, service, booking_date, booking_time, notes, status, created_at, updated_at')
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('Booking not found.');

      setBookings(prev => prev.map(b => (b && b.id === bookingId ? {
        id: data.id,
        userId: data.user_id,
        userName: data.user_name,
        userEmail: data.user_email,
        service: data.service,
        date: data.booking_date,
        time: data.booking_time,
        notes: data.notes,
        status: data.status,
        createdAt: data.created_at,
      } : b)).filter(Boolean));
    } catch (err) {
      console.log('Cancel error:', err);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    if (!accessToken) return;
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .select('id, user_id, user_name, user_email, service, booking_date, booking_time, notes, status, created_at, updated_at')
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('Booking not found.');

      setBookings(prev => prev.map(b => (b && b.id === bookingId ? {
        id: data.id,
        userId: data.user_id,
        userName: data.user_name,
        userEmail: data.user_email,
        service: data.service,
        date: data.booking_date,
        time: data.booking_time,
        notes: data.notes,
        status: data.status,
        createdAt: data.created_at,
      } : b)).filter(Boolean));
    } catch (err) {
      console.log('Booking status update error:', err);
    }
  };

  // ── Colours ─────────────────────────────────────────────
  const pageBg = isDark ? '#060312' : '#F5F3FF';
  const cardBg = isDark ? 'rgba(13,8,33,0.95)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.1)';
  const sidebarBg = isDark ? 'rgba(8,4,22,0.97)' : '#FFFFFF';
  const textPrimary = isDark ? '#EDE9FF' : '#1E1048';
  const textMuted = isDark ? 'rgba(237,233,255,0.5)' : 'rgba(30,16,72,0.45)';
  const inputBg = isDark ? 'rgba(124,58,237,0.07)' : 'rgba(124,58,237,0.04)';
  const inputBorder = isDark ? 'rgba(124,58,237,0.22)' : 'rgba(124,58,237,0.12)';

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: pageBg }}>
      <Spinner />
    </div>
  );

  if (!user) return null;

  const validBookings = bookings.filter((booking): booking is Booking => Boolean(booking && booking.status));

  // ── Stats ─────────────────────────────────────────────────
  const activeBookings = validBookings.filter(b => b.status !== 'cancelled').length;
  const pendingBookings = validBookings.filter(b => b.status === 'pending').length;
  const totalBookings = validBookings.length;
  const stats = [
    { label: isAdmin ? 'All Bookings' : 'Total Bookings', value: totalBookings, icon: <Calendar className="w-5 h-5" />, color: STAT_COLORS[0] },
    { label: 'Pending',        value: pendingBookings, icon: <Clock className="w-5 h-5" />,    color: STAT_COLORS[1] },
    { label: 'Courses',        value: enrollments.length, icon: <BookOpen className="w-5 h-5" />, color: STAT_COLORS[2] },
  ];

  // ── Sidebar ───────────────────────────────────────────────
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-5' : 'p-5'}`}
      style={{ background: sidebarBg, borderRight: `1px solid ${cardBorder}` }}>
      {/* Logo area */}
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>✦</div>
        <span className="font-bold text-sm" style={{ color: textPrimary }}>Vyana Soul</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => (
          <button key={item.key}
            onClick={() => { setActiveNav(item.key); setSidebarOpen(false); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            style={{
              background: activeNav === item.key ? 'rgba(124,58,237,0.12)' : 'transparent',
              color: activeNav === item.key ? '#7C3AED' : textMuted,
            }}>
            {item.icon}
            {item.label}
            {activeNav === item.key && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />}
          </button>
        ))}
      </nav>

      {/* Bottom user card */}
      <div className="mt-6 p-3 rounded-xl" style={{ background: inputBg, border: `1px solid ${inputBorder}` }}>
        <div className="flex items-center gap-3 mb-3">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #a855f7)' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: textPrimary }}>{user.name}</p>
            <p className="text-xs truncate" style={{ color: textMuted }}>{user.email}</p>
          </div>
        </div>
        <button onClick={async () => { await logout(); navigate('/'); }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>
          <LogOut className="w-3 h-3" /> Sign Out
        </button>
      </div>
    </div>
  );

  // ── Content areas ─────────────────────────────────────────

  const OverviewPanel = () => (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 60%, #a855f7 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent 60%)' }} />
        <p className="text-white/70 text-sm mb-1">Welcome back,</p>
        <h2 className="text-2xl font-bold text-white mb-1">{user.name} ✦</h2>
        <p className="text-white/60 text-sm">Your Akashic journey continues.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-white"
              style={{ background: `${s.color}22`, color: s.color }}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold" style={{ color: textPrimary }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: textMuted }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <h3 className="font-semibold mb-4 text-sm" style={{ color: textPrimary }}>Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowNewBooking(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
            <Plus className="w-4 h-4" /> Book Session
          </button>
          <button onClick={() => setActiveNav('courses')}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: inputBg, color: '#7C3AED', border: `1px solid ${inputBorder}` }}>
            <BookOpen className="w-4 h-4" /> My Courses
          </button>
        </div>
      </div>

      {/* Recent bookings preview */}
      {validBookings.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: textPrimary }}>Recent Bookings</h3>
            <button onClick={() => setActiveNav('bookings')} className="text-xs flex items-center gap-1"
              style={{ color: '#7C3AED' }}>
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {validBookings.slice(0, 3).map(b => (
            <div key={b.id} className="flex items-center justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: cardBorder }}>
              <div>
                <p className="text-sm font-medium" style={{ color: textPrimary }}>{b.service}</p>
                <p className="text-xs mt-0.5" style={{ color: textMuted }}>{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}{b.time ? ` · ${b.time}` : ''}</p>
                {isAdmin && (
                  <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                    Booked by {b.userName ?? 'Unknown user'} {b.userEmail ? `· ${b.userEmail}` : ''}
                  </p>
                )}
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}

      {/* Contact info */}
      <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <h3 className="font-semibold mb-4 text-sm" style={{ color: textPrimary }}>Need Help?</h3>
        <div className="space-y-2">
          <a href="tel:+919987487242" className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity" style={{ color: textMuted }}>
            <Phone className="w-4 h-4 text-[#7C3AED]" /> +91 99874 87242
          </a>
          <a href="mailto:vyanasoul369@vyanasoul.com" className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity" style={{ color: textMuted }}>
            <Mail className="w-4 h-4 text-[#7C3AED]" /> vyanasoul369@vyanasoul.com
          </a>
        </div>
      </div>
    </div>
  );

  const BookingsPanel = () => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold" style={{ color: textPrimary }}>{isAdmin ? 'All Bookings' : 'My Bookings'}</h2>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowNewBooking(true)}
          disabled={bookingLoading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-medium"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
          <Plus className="w-4 h-4" /> {isAdmin ? 'Open Booking' : 'New Booking'}
        </motion.button>
      </div>

      {fetchLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : fetchError ? (
        <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          {fetchError}
        </div>
      ) : validBookings.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#7C3AED' }} />
          <p className="font-medium mb-1" style={{ color: textPrimary }}>{isAdmin ? 'No bookings yet' : 'No bookings yet'}</p>
          <p className="text-sm mb-4" style={{ color: textMuted }}>
            {isAdmin ? 'New bookings will appear here as soon as clients submit them.' : 'Book your first Akashic session with Rekha Bala.'}
          </p>
          <button onClick={() => setShowNewBooking(true)}
            className="px-5 py-2 rounded-xl text-white text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
            {isAdmin ? 'Create Booking' : 'Book Now'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {validBookings.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" style={{ color: textPrimary }}>{b.service}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs flex items-center gap-1" style={{ color: textMuted }}>
                      <Calendar className="w-3 h-3" />
                      {new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {b.time && (
                      <span className="text-xs flex items-center gap-1" style={{ color: textMuted }}>
                        <Clock className="w-3 h-3" /> {b.time}
                      </span>
                    )}
                  </div>
                  {isAdmin && (
                    <p className="text-xs mt-2" style={{ color: textMuted }}>
                      Booked by {b.userName ?? 'Unknown user'} {b.userEmail ? `· ${b.userEmail}` : ''}
                    </p>
                  )}
                  {b.notes && <p className="text-xs mt-2 italic" style={{ color: textMuted }}>"{b.notes}"</p>}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <StatusBadge status={b.status} />
                  {isAdmin ? (
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                            className="text-xs flex items-center gap-1 transition-opacity hover:opacity-80"
                            style={{ color: '#16a34a' }}>
                            <CheckCircle2 className="w-3 h-3" /> Accept
                          </button>
                          <button onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                            className="text-xs flex items-center gap-1 transition-opacity hover:opacity-80"
                            style={{ color: '#ef4444' }}>
                            <X className="w-3 h-3" /> Decline
                          </button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                          className="text-xs flex items-center gap-1 transition-opacity hover:opacity-80"
                          style={{ color: '#ef4444' }}>
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      )}
                    </div>
                  ) : b.status === 'pending' && (
                    <button onClick={() => handleCancelBooking(b.id)}
                      className="text-xs flex items-center gap-1 transition-opacity hover:opacity-80"
                      style={{ color: '#ef4444' }}>
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const handleConsultancyStatusChange = async (id: string, status: string) => {
    if (!accessToken) return;
    try {
      await apiFetch(`/consultancy/${id}/status`, accessToken, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setConsultancyRequests(prev => prev.map(cr => cr.id === id ? { ...cr, status } : cr));
    } catch (err) {
      console.error('Failed to update consultancy status:', err);
    }
  };

  const AdminPanel = () => {
    return (
      <AdminPanelFull
        isDark={isDark}
        accessToken={accessToken}
        consultancyRequests={consultancyRequests}
        bookings={validBookings}
        onStatusChange={handleConsultancyStatusChange}
        onBookingStatusChange={handleUpdateBookingStatus}
      />
    );
  };



  };

  const CoursesPanel = () => (
    <div>
      <h2 className="text-lg font-bold mb-5" style={{ color: textPrimary }}>My Courses</h2>
      {fetchLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : enrollments.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#7C3AED' }} />
          <p className="font-medium mb-1" style={{ color: textPrimary }}>No courses yet</p>
          <p className="text-sm mb-4" style={{ color: textMuted }}>Browse our Akashic Records courses and enroll today.</p>
          <button onClick={() => navigate('/#courses')}
            className="px-5 py-2 rounded-xl text-white text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
            Explore Courses
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((e, i) => (
            <motion.div key={e.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold" style={{ color: textPrimary }}>{e.courseName}</p>
                <StatusBadge status={e.status} />
              </div>
              <p className="text-xs mb-3" style={{ color: textMuted }}>
                Enrolled {new Date(e.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${e.progress}%`, background: 'linear-gradient(90deg, #7C3AED, #a855f7)' }} />
              </div>
              <p className="text-xs mt-1.5" style={{ color: textMuted }}>{e.progress}% complete</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const ProfilePanel = () => (
    <div>
      <h2 className="text-lg font-bold mb-5" style={{ color: textPrimary }}>My Profile</h2>
      <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center gap-5 mb-6 pb-6 border-b" style={{ borderColor: cardBorder }}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-500/20" />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #a855f7)' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold" style={{ color: textPrimary }}>{user.name}</h3>
            <p className="text-sm" style={{ color: textMuted }}>{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(124,58,237,0.15)', color: '#7C3AED' }}>
              {user.role ?? 'student'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: textMuted }}>FULL NAME</p>
            <p className="text-sm font-medium" style={{ color: textPrimary }}>{user.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: textMuted }}>EMAIL ADDRESS</p>
            <p className="text-sm font-medium" style={{ color: textPrimary }}>{user.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: textMuted }}>MEMBER SINCE</p>
            <p className="text-sm font-medium" style={{ color: textPrimary }}>
              {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl flex items-start gap-3"
          style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <Bell className="w-4 h-4 text-[#7C3AED] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium" style={{ color: textPrimary }}>Stay Connected</p>
            <p className="text-xs mt-0.5" style={{ color: textMuted }}>
              Follow us on Instagram{' '}
              <a href="https://www.instagram.com/vyana_soul369/" target="_blank" rel="noreferrer"
                className="text-[#7C3AED] hover:underline">@vyana_soul369</a>{' '}
              for updates, meditations & soul wisdom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ background: pageBg, paddingTop: '0' }}>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-60 flex-shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[50] lg:hidden"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-[51] w-60 lg:hidden">
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
          style={{ background: isDark ? 'rgba(6,3,18,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderColor: cardBorder }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.07)', color: '#7C3AED' }}
              onClick={() => setSidebarOpen(true)}>
              <Settings className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-bold text-sm" style={{ color: textPrimary }}>
                {navItems.find(n => n.key === activeNav)?.label}
              </h1>
              <p className="text-xs hidden sm:block" style={{ color: textMuted }}>
                {user.name} · Vyana Soul
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/')}
            className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: isDark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.07)', color: '#7C3AED' }}>
            ← Back to site
          </button>
        </div>

        {/* Page area */}
        <div className="flex-1 p-5 max-w-3xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeNav}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}>
              {activeNav === 'overview'  && <OverviewPanel />}
              {activeNav === 'bookings'  && <BookingsPanel />}
              {activeNav === 'courses'   && <CoursesPanel />}
              {activeNav === 'profile'   && <ProfilePanel />}
              {activeNav === 'admin'     && isAdmin && <AdminPanel />}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* New Booking Modal */}
      <AnimatePresence>
        {showNewBooking && (
          <NewBookingModal isDark={isDark} onClose={() => setShowNewBooking(false)} onSave={handleNewBooking} />
        )}
      </AnimatePresence>
    </div>
  );
}
