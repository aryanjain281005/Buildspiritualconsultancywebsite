import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard, Users, MessageSquare, LogOut,
  Settings, FileText, Phone, Mail, ChevronRight, Menu,
  Download, ExternalLink, MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type AdminNavKey = 'overview' | 'consultancy' | 'contact' | 'users';

const NAV: { key: AdminNavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { key: 'consultancy', label: 'Consultancy Requests', icon: <FileText className="w-4 h-4" /> },
  { key: 'contact', label: 'Contact Messages', icon: <MessageSquare className="w-4 h-4" /> },
  { key: 'users', label: 'Registered Users', icon: <Users className="w-4 h-4" /> },
];

function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="4" />
      <path className="opacity-75" fill="#10B981" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export default function Admin() {
  const { user, supabase, logout, loading: authLoading, isAdmin } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState<AdminNavKey>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profiles, setProfiles] = useState<any[]>([]);
  const [consultancyRequests, setConsultancyRequests] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate('/');
  }, [user, authLoading, isAdmin, navigate]);

  const fetchData = useCallback(async () => {
    if (!user || !isAdmin) return;
    setLoadingData(true);
    try {
      const [pRes, crRes, cmRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('consultancy_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      ]);
      if (pRes.data) setProfiles(pRes.data);
      if (crRes.data) setConsultancyRequests(crRes.data);
      if (cmRes.data) setContactMessages(cmRes.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoadingData(false);
    }
  }, [user, isAdmin, supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (table: string, id: string, newStatus: string) => {
    try {
      await supabase.from(table).update({ status: newStatus }).eq('id', id);
      fetchData();
    } catch (err) {
      console.error('Update status error', err);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clean Styling Variables
  const pageBg = isDark ? '#0A0A0A' : '#F9FAFB';
  const cardBg = isDark ? '#171717' : '#FFFFFF';
  const borderColor = isDark ? '#262626' : '#E5E7EB';
  const textMain = isDark ? '#F3F4F6' : '#111827';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';
  const accentColor = '#10B981'; // Emerald Green for admin
  const hoverBg = isDark ? '#262626' : '#F3F4F6';

  if (authLoading || !user || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: pageBg }}>
      <Spinner />
    </div>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    let bg = isDark ? '#374151' : '#F3F4F6';
    let color = isDark ? '#D1D5DB' : '#4B5563';
    
    if (status === 'new' || status === 'pending') { bg = 'rgba(245,158,11,0.15)'; color = '#D97706'; }
    if (status === 'in_progress' || status === 'read') { bg = 'rgba(59,130,246,0.15)'; color = '#2563EB'; }
    if (status === 'completed' || status === 'replied') { bg = 'rgba(16,185,129,0.15)'; color = '#059669'; }
    if (status === 'rejected') { bg = 'rgba(239,68,68,0.15)'; color = '#DC2626'; }

    return (
      <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md" style={{ background: bg, color }}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-5' : 'p-6'}`} style={{ background: cardBg, borderRight: `1px solid ${borderColor}` }}>
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: accentColor }}>
          <Settings className="w-4 h-4" />
        </div>
        <span className="font-bold text-sm tracking-wide" style={{ color: textMain }}>ADMIN</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {NAV.map(item => {
          const isActive = activeNav === item.key;
          return (
            <button key={item.key} onClick={() => { setActiveNav(item.key); setSidebarOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left"
              style={{
                background: isActive ? (isDark ? '#262626' : '#F3F4F6') : 'transparent',
                color: isActive ? textMain : textMuted,
              }}>
              <span style={{ color: isActive ? accentColor : textMuted }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t" style={{ borderColor }}>
        <button onClick={async () => { await logout(); navigate('/'); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ color: '#EF4444' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: pageBg }}>
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 lg:hidden shadow-2xl">
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 lg:py-6"
          style={{ background: pageBg }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 rounded-lg" style={{ color: textMain }} onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold" style={{ color: textMain }}>
              {NAV.find(n => n.key === activeNav)?.label}
            </h1>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8 pt-0 max-w-5xl w-full">
          {loadingData ? (
            <div className="py-20"><Spinner /></div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeNav} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                
                {/* ── OVERVIEW ── */}
                {activeNav === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: 'New Consultancy Requests', val: consultancyRequests.filter(r => r.status === 'new').length, color: '#D97706' },
                        { title: 'Total Completed Consultations', val: consultancyRequests.filter(r => r.status === 'completed').length, color: '#059669' },
                        { title: 'New Contact Messages', val: contactMessages.filter(m => m.status === 'new').length, color: '#2563EB' },
                        { title: 'Total Registered Users', val: profiles.length, color: '#7C3AED' },
                      ].map((s, i) => (
                        <div key={i} className="p-6 rounded-xl shadow-sm" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderLeft: `4px solid ${s.color}` }}>
                          <p className="text-sm font-medium mb-2" style={{ color: textMuted }}>{s.title}</p>
                          <p className="text-3xl font-bold" style={{ color: textMain }}>{s.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-8 mb-4">
                      <h3 className="font-semibold text-lg" style={{ color: textMain }}>Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <button onClick={() => exportToCSV(consultancyRequests, 'consultancy_requests')} className="flex flex-col items-center justify-center p-4 rounded-xl shadow-sm transition-all hover:scale-[1.02]" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                        <Download className="w-5 h-5 mb-2" style={{ color: accentColor }} />
                        <span className="text-xs font-medium" style={{ color: textMain }}>Export Requests (CSV)</span>
                      </button>
                      <button onClick={() => exportToCSV(contactMessages, 'contact_messages')} className="flex flex-col items-center justify-center p-4 rounded-xl shadow-sm transition-all hover:scale-[1.02]" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                        <Download className="w-5 h-5 mb-2" style={{ color: accentColor }} />
                        <span className="text-xs font-medium" style={{ color: textMain }}>Export Contacts (CSV)</span>
                      </button>
                      <button onClick={() => exportToCSV(profiles, 'users')} className="flex flex-col items-center justify-center p-4 rounded-xl shadow-sm transition-all hover:scale-[1.02]" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                        <Download className="w-5 h-5 mb-2" style={{ color: accentColor }} />
                        <span className="text-xs font-medium" style={{ color: textMain }}>Export Users (CSV)</span>
                      </button>
                    </div>

                    <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                      <div className="px-6 py-4 border-b" style={{ borderColor }}>
                        <h3 className="font-semibold" style={{ color: textMain }}>Recent Consultancy Requests</h3>
                      </div>
                      <div className="divide-y" style={{ borderColor }}>
                        {consultancyRequests.slice(0, 5).map(r => (
                          <div key={r.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <p className="font-medium text-sm" style={{ color: textMain }}>{r.full_name}</p>
                              <p className="text-xs mt-1" style={{ color: textMuted }}>{r.service} • {new Date(r.created_at).toLocaleDateString()}</p>
                            </div>
                            <StatusBadge status={r.status} />
                          </div>
                        ))}
                        {consultancyRequests.length === 0 && <div className="p-6 text-sm text-center" style={{ color: textMuted }}>No requests found.</div>}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CONSULTANCY ── */}
                {activeNav === 'consultancy' && (
                  <div className="space-y-4">
                    {consultancyRequests.map(r => (
                      <div key={r.id} className="p-6 rounded-xl shadow-sm" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-bold text-lg" style={{ color: textMain }}>{r.full_name}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm flex-wrap" style={{ color: textMuted }}>
                              <a href={`mailto:${r.email}`} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                                <Mail className="w-4 h-4" /> {r.email}
                              </a>
                              {r.phone && (
                                <div className="flex items-center gap-3">
                                  <a href={`tel:${r.phone}`} className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors">
                                    <Phone className="w-4 h-4" /> {r.phone}
                                  </a>
                                  <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-green-500 transition-colors bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-medium">
                                    <MessageCircle className="w-3 h-3" /> WhatsApp
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <StatusBadge status={r.status} />
                            <select value={r.status} onChange={(e) => updateStatus('consultancy_requests', r.id, e.target.value)}
                              className="text-xs mt-2 px-2 py-1 rounded border outline-none bg-transparent cursor-pointer"
                              style={{ borderColor, color: textMain }}>
                              <option value="new">Mark as New</option>
                              <option value="in_progress">Mark as In Progress</option>
                              <option value="completed">Mark as Completed</option>
                              <option value="rejected">Mark as Rejected</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-6 p-4 rounded-lg" style={{ background: hoverBg }}>
                          <div><span className="font-medium" style={{ color: textMuted }}>Service:</span> <span style={{ color: textMain }} className="ml-2">{r.service}</span></div>
                          <div><span className="font-medium" style={{ color: textMuted }}>Preferred Time:</span> <span style={{ color: textMain }} className="ml-2">{r.preferred_time || 'Anytime'}</span></div>
                        </div>
                        {r.message && (
                          <div className="mt-4">
                            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: textMuted }}>Message</p>
                            <p className="text-sm whitespace-pre-wrap" style={{ color: textMain }}>{r.message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {consultancyRequests.length === 0 && <p className="text-sm" style={{ color: textMuted }}>No consultancy requests.</p>}
                  </div>
                )}

                {/* ── CONTACT ── */}
                {activeNav === 'contact' && (
                  <div className="space-y-4">
                    {contactMessages.map(m => (
                      <div key={m.id} className="p-6 rounded-xl shadow-sm" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-bold text-lg" style={{ color: textMain }}>{m.subject}</h3>
                            <p className="text-sm mt-1" style={{ color: textMuted }}>
                              From: {m.name} &lt;
                              <a href={`mailto:${m.email}`} className="hover:text-blue-500 transition-colors underline decoration-blue-500/30">
                                {m.email}
                              </a>
                              &gt;
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <StatusBadge status={m.status} />
                            <select value={m.status} onChange={(e) => updateStatus('contact_messages', m.id, e.target.value)}
                              className="text-xs mt-2 px-2 py-1 rounded border outline-none bg-transparent cursor-pointer"
                              style={{ borderColor, color: textMain }}>
                              <option value="new">Mark as New</option>
                              <option value="read">Mark as Read</option>
                              <option value="replied">Mark as Replied</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-4 p-4 rounded-lg text-sm whitespace-pre-wrap" style={{ background: hoverBg, color: textMain }}>
                          {m.message}
                        </div>
                      </div>
                    ))}
                    {contactMessages.length === 0 && <p className="text-sm" style={{ color: textMuted }}>No contact messages.</p>}
                  </div>
                )}

                {/* ── USERS ── */}
                {activeNav === 'users' && (
                  <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                          <tr style={{ background: hoverBg, borderBottom: `1px solid ${borderColor}` }}>
                            <th className="px-6 py-4 font-medium" style={{ color: textMuted }}>Name</th>
                            <th className="px-6 py-4 font-medium" style={{ color: textMuted }}>Email</th>
                            <th className="px-6 py-4 font-medium" style={{ color: textMuted }}>Role</th>
                            <th className="px-6 py-4 font-medium" style={{ color: textMuted }}>Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor }}>
                          {profiles.map(p => (
                            <tr key={p.id}>
                              <td className="px-6 py-4" style={{ color: textMain }}>{p.name}</td>
                              <td className="px-6 py-4" style={{ color: textMuted }}>{p.email}</td>
                              <td className="px-6 py-4">
                                {p.role === 'admin' 
                                  ? <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-xs font-medium">Admin</span>
                                  : <span className="px-2 py-1 bg-gray-500/10 text-gray-500 rounded text-xs font-medium dark:text-gray-400">User</span>}
                              </td>
                              <td className="px-6 py-4" style={{ color: textMuted }}>{new Date(p.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
