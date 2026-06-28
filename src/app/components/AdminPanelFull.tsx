import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, Image, FileText, Star, BookOpen, Plus, Trash2, Edit3, X,
  CheckCircle2, Clock, XCircle, ChevronDown, Eye, EyeOff, Save, Loader2,
  Upload, ExternalLink,
} from 'lucide-react';
import { apiFetch } from '../context/AuthContext';

// ── Types ──────────────────────────────────────────────────

interface ConsultancyRequest {
  id: string; fullName: string; email: string; phone: string;
  service: string; preferredTime: string; message: string;
  status: string; createdAt: string;
}

interface Booking {
  id: string; userName: string; userEmail: string; service: string;
  date: string; time: string; notes: string; status: string; createdAt: string;
}

interface GalleryImage {
  id: string; title: string; category: string; image_url: string;
  sort_order: number; created_at: string;
}

interface BlogPost {
  id: string; title: string; excerpt: string; content: string;
  author: string; category: string; image_url: string;
  tags: string[]; read_time: string; published: boolean;
  created_at: string; updated_at: string;
}

interface Review {
  id: string; name: string; role: string; location: string;
  rating: number; review: string; full_review: string;
  service: string; color: string; created_at: string;
}

interface CourseItem {
  id: string; title: string; description: string; duration: string;
  level: string; price: string; original_price: string; emoji: string;
  category: string; features: string[]; popular: boolean; color: string;
  published: boolean; created_at: string; updated_at: string;
}

// ── Shared Styles ──────────────────────────────────────────

const useAdminStyles = (isDark: boolean) => ({
  cardBg: isDark ? 'rgba(14,8,37,0.6)' : 'rgba(255,255,255,0.8)',
  cardBorder: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.1)',
  inputBg: isDark ? 'rgba(6,3,18,0.6)' : 'rgba(249,247,255,1)',
  inputBorder: isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.15)',
  textPrimary: isDark ? '#EDE9FF' : '#1E1048',
  textMuted: isDark ? 'rgba(237,233,255,0.5)' : 'rgba(30,16,72,0.5)',
});

// ── Status Badge ───────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    new: { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
    pending: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
    'in-progress': { bg: 'rgba(124,58,237,0.15)', text: '#7C3AED' },
    confirmed: { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
    completed: { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
    cancelled: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
  };
  const c = colors[status] || colors.new;
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
      style={{ background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

// ── Status Dropdown ────────────────────────────────────────

function StatusDropdown({ current, options, onSelect }: {
  current: string; options: string[]; onSelect: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all hover:shadow-sm"
        style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#7C3AED' }}>
        <StatusBadge status={current} />
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 rounded-xl shadow-xl border overflow-hidden min-w-[140px]"
          style={{ background: 'rgba(14,8,37,0.98)', borderColor: 'rgba(124,58,237,0.2)' }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onSelect(opt); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs capitalize transition-colors hover:bg-[rgba(124,58,237,0.1)]"
              style={{ color: current === opt ? '#7C3AED' : '#EDE9FF' }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN SUB-TABS
// ═══════════════════════════════════════════════════════════

type AdminSubTab = 'requests' | 'gallery' | 'blog' | 'reviews' | 'courses';

const ADMIN_TABS: { key: AdminSubTab; label: string; icon: React.ReactNode }[] = [
  { key: 'requests', label: 'Requests', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { key: 'gallery', label: 'Gallery', icon: <Image className="w-3.5 h-3.5" /> },
  { key: 'blog', label: 'Blog', icon: <FileText className="w-3.5 h-3.5" /> },
  { key: 'reviews', label: 'Reviews', icon: <Star className="w-3.5 h-3.5" /> },
  { key: 'courses', label: 'Courses', icon: <BookOpen className="w-3.5 h-3.5" /> },
];

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════

export default function AdminPanelFull({
  isDark,
  accessToken,
  consultancyRequests,
  bookings,
  onStatusChange,
  onBookingStatusChange,
}: {
  isDark: boolean;
  accessToken: string;
  consultancyRequests: ConsultancyRequest[];
  bookings: Booking[];
  onStatusChange: (id: string, status: string) => void;
  onBookingStatusChange: (id: string, status: string) => void;
}) {
  const s = useAdminStyles(isDark);
  const [subTab, setSubTab] = useState<AdminSubTab>('requests');

  return (
    <div className="space-y-4">
      {/* Admin header */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #312E81 55%, #7C3AED 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent 60%)' }} />
        <p className="text-white/70 text-xs mb-1">Admin CMS</p>
        <h2 className="text-xl font-bold text-white mb-0.5">Content Management</h2>
        <p className="text-white/60 text-xs">Manage all website content from one place.</p>
      </div>

      {/* Sub-tab pills */}
      <div className="flex flex-wrap gap-1.5">
        {ADMIN_TABS.map(tab => (
          <button key={tab.key} onClick={() => setSubTab(tab.key)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={subTab === tab.key
              ? { background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: 'white', boxShadow: '0 2px 10px rgba(124,58,237,0.3)' }
              : { background: s.cardBg, color: s.textMuted, border: `1px solid ${s.cardBorder}` }
            }>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={subTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
          {subTab === 'requests' && (
            <RequestsTab isDark={isDark} s={s} consultancyRequests={consultancyRequests} bookings={bookings}
              onStatusChange={onStatusChange} onBookingStatusChange={onBookingStatusChange} />
          )}
          {subTab === 'gallery' && <GalleryTab isDark={isDark} s={s} accessToken={accessToken} />}
          {subTab === 'blog' && <BlogTab isDark={isDark} s={s} accessToken={accessToken} />}
          {subTab === 'reviews' && <ReviewsTab isDark={isDark} s={s} accessToken={accessToken} />}
          {subTab === 'courses' && <CoursesTab isDark={isDark} s={s} accessToken={accessToken} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REQUESTS TAB
// ═══════════════════════════════════════════════════════════

function RequestsTab({ isDark, s, consultancyRequests, bookings, onStatusChange, onBookingStatusChange }: {
  isDark: boolean; s: ReturnType<typeof useAdminStyles>;
  consultancyRequests: ConsultancyRequest[]; bookings: Booking[];
  onStatusChange: (id: string, status: string) => void;
  onBookingStatusChange: (id: string, status: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Consultancy', value: consultancyRequests.length, color: '#F59E0B' },
          { label: 'New', value: consultancyRequests.filter(r => r.status === 'new').length, color: '#3B82F6' },
          { label: 'In Progress', value: consultancyRequests.filter(r => r.status === 'in-progress').length, color: '#7C3AED' },
          { label: 'Bookings', value: bookings.length, color: '#10B981' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[10px]" style={{ color: s.textMuted }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Consultancy Requests */}
      <div className="rounded-xl p-4" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: s.textPrimary }}>
          <MessageSquare className="w-4 h-4 text-amber-400" />
          Consultancy Requests ({consultancyRequests.length})
        </h3>
        {consultancyRequests.length === 0 ? (
          <p className="text-xs" style={{ color: s.textMuted }}>No requests yet.</p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {consultancyRequests.map(cr => (
              <div key={cr.id} className="rounded-lg p-3" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}` }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm" style={{ color: s.textPrimary }}>{cr.fullName}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: s.textMuted }}>{cr.email} · {cr.phone || 'N/A'}</p>
                    {cr.service && <p className="text-[11px] mt-0.5" style={{ color: s.textMuted }}>Service: {cr.service}</p>}
                    {cr.message && <p className="text-[11px] mt-1 italic" style={{ color: s.textMuted }}>"{cr.message.slice(0, 100)}{cr.message.length > 100 ? '…' : ''}"</p>}
                    <p className="text-[10px] mt-1" style={{ color: s.textMuted }}>
                      {new Date(cr.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <StatusDropdown current={cr.status} options={['new', 'in-progress', 'completed', 'cancelled']}
                    onSelect={(status) => onStatusChange(cr.id, status)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookings */}
      <div className="rounded-xl p-4" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: s.textPrimary }}>
          <Clock className="w-4 h-4 text-green-400" />
          Bookings ({bookings.length})
        </h3>
        {bookings.length === 0 ? (
          <p className="text-xs" style={{ color: s.textMuted }}>No bookings yet.</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {bookings.map(b => (
              <div key={b.id} className="rounded-lg p-3 flex items-center justify-between gap-2"
                style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}` }}>
                <div>
                  <p className="font-semibold text-sm" style={{ color: s.textPrimary }}>{b.userName}</p>
                  <p className="text-[11px]" style={{ color: s.textMuted }}>{b.service} · {b.date} {b.time}</p>
                </div>
                <StatusDropdown current={b.status} options={['pending', 'confirmed', 'completed', 'cancelled']}
                  onSelect={(status) => onBookingStatusChange(b.id, status)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// GALLERY TAB
// ═══════════════════════════════════════════════════════════

function GalleryTab({ isDark, s, accessToken }: { isDark: boolean; s: ReturnType<typeof useAdminStyles>; accessToken: string }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Practice');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchImages = useCallback(async () => {
    const res = await apiFetch('/gallery', accessToken).catch(() => ({ images: [] }));
    setImages(res.images ?? []);
    setLoading(false);
  }, [accessToken]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const addImage = async () => {
    if (!imageUrl) return;
    setSaving(true);
    await apiFetch('/gallery', accessToken, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, imageUrl }),
    });
    setTitle(''); setCategory('Practice'); setImageUrl(''); setShowAdd(false);
    setSaving(false);
    fetchImages();
  };

  const deleteImage = async (id: string) => {
    await apiFetch(`/gallery/${id}`, accessToken, { method: 'DELETE' });
    fetchImages();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm" style={{ color: s.textPrimary }}>Gallery Images ({images.length})</h3>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
          <Plus className="w-3 h-3" /> Add Photo
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (paste a link)"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          <div className="grid grid-cols-2 gap-2">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }}>
              {['Practice', 'Healing', 'Reading', 'Spiritual', 'Podcast', 'Event'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addImage} disabled={saving || !imageUrl}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', opacity: saving || !imageUrl ? 0.5 : 1 }}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-xs" style={{ color: s.textMuted }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" style={{ color: '#7C3AED' }} /></div>
      ) : images.length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: s.textMuted }}>No gallery images yet. Add your first photo!</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square">
              <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => deleteImage(img.id)}
                  className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-[10px] font-medium truncate">{img.title || img.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// BLOG TAB
// ═══════════════════════════════════════════════════════════

function BlogTab({ isDark, s, accessToken }: { isDark: boolean; s: ReturnType<typeof useAdminStyles>; accessToken: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Akashic Reading');
  const [imgUrl, setImgUrl] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [published, setPublished] = useState(false);

  const fetchPosts = useCallback(async () => {
    const res = await apiFetch('/blog/all', accessToken).catch(() => ({ posts: [] }));
    setPosts(res.posts ?? []);
    setLoading(false);
  }, [accessToken]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const resetForm = () => {
    setTitle(''); setExcerpt(''); setContent(''); setCategory('Akashic Reading');
    setImgUrl(''); setTagsStr(''); setPublished(false); setEditing(null); setShowForm(false);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p); setTitle(p.title); setExcerpt(p.excerpt); setContent(p.content);
    setCategory(p.category); setImgUrl(p.image_url); setTagsStr((p.tags || []).join(', '));
    setPublished(p.published); setShowForm(true);
  };

  const savePost = async () => {
    if (!title) return;
    setSaving(true);
    const body = { title, excerpt, content, category, imageUrl: imgUrl, tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean), published };
    if (editing) {
      await apiFetch(`/blog/${editing.id}`, accessToken, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
    } else {
      await apiFetch('/blog', accessToken, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
    }
    setSaving(false); resetForm(); fetchPosts();
  };

  const deletePost = async (id: string) => {
    await apiFetch(`/blog/${id}`, accessToken, { method: 'DELETE' });
    fetchPosts();
  };

  const togglePublish = async (p: BlogPost) => {
    await apiFetch(`/blog/${p.id}`, accessToken, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !p.published }),
    });
    fetchPosts();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm" style={{ color: s.textPrimary }}>Blog Posts ({posts.length})</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
          <Plus className="w-3 h-3" /> New Post
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title *"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none font-medium" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short excerpt / summary" rows={2}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Full blog content (supports markdown)" rows={6}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          <div className="grid grid-cols-2 gap-2">
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
            <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="Cover image URL"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          </div>
          <input value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="Tags (comma-separated)"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="accent-purple-600" />
            <span className="text-xs" style={{ color: s.textPrimary }}>Publish immediately</span>
          </label>
          <div className="flex gap-2">
            <button onClick={savePost} disabled={saving || !title}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', opacity: saving || !title ? 0.5 : 1 }}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} {editing ? 'Update' : 'Create'}
            </button>
            <button onClick={resetForm} className="px-4 py-2 rounded-lg text-xs" style={{ color: s.textMuted }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" style={{ color: '#7C3AED' }} /></div>
      ) : posts.length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: s.textMuted }}>No blog posts yet.</p>
      ) : (
        <div className="space-y-2">
          {posts.map(p => (
            <div key={p.id} className="rounded-lg p-3 flex items-center justify-between gap-3"
              style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}` }}>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate" style={{ color: s.textPrimary }}>{p.title}</p>
                <p className="text-[11px]" style={{ color: s.textMuted }}>{p.category} · {new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => togglePublish(p)} title={p.published ? 'Unpublish' : 'Publish'}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: p.published ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: p.published ? '#10B981' : '#EF4444' }}>
                  {p.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deletePost(p.id)} className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REVIEWS TAB
// ═══════════════════════════════════════════════════════════

function ReviewsTab({ isDark, s, accessToken }: { isDark: boolean; s: ReturnType<typeof useAdminStyles>; accessToken: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Client');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [service, setService] = useState('');

  const fetchReviews = useCallback(async () => {
    const res = await apiFetch('/reviews', accessToken).catch(() => ({ reviews: [] }));
    setReviews(res.reviews ?? []);
    setLoading(false);
  }, [accessToken]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const resetForm = () => { setName(''); setRole('Client'); setLocation(''); setRating(5); setReviewText(''); setService(''); setShowForm(false); };

  const saveReview = async () => {
    if (!name || !reviewText) return;
    setSaving(true);
    await apiFetch('/reviews', accessToken, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role, location, rating, review: reviewText, fullReview: reviewText, service }),
    });
    setSaving(false); resetForm(); fetchReviews();
  };

  const deleteReview = async (id: string) => {
    await apiFetch(`/reviews/${id}`, accessToken, { method: 'DELETE' });
    fetchReviews();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm" style={{ color: s.textPrimary }}>Reviews ({reviews.length})</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
          <Plus className="w-3 h-3" /> Add Review
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
          <div className="grid grid-cols-2 gap-2">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Client name *"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role (e.g. Client)"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
            <input value={service} onChange={e => setService(e.target.value)} placeholder="Service used"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: s.textMuted }}>Rating:</span>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)} className="text-lg">
                {n <= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Review text *" rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          <div className="flex gap-2">
            <button onClick={saveReview} disabled={saving || !name || !reviewText}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', opacity: saving || !name || !reviewText ? 0.5 : 1 }}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
            </button>
            <button onClick={resetForm} className="px-4 py-2 rounded-lg text-xs" style={{ color: s.textMuted }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" style={{ color: '#7C3AED' }} /></div>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: s.textMuted }}>No reviews yet.</p>
      ) : (
        <div className="space-y-2">
          {reviews.map(r => (
            <div key={r.id} className="rounded-lg p-3" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}` }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm" style={{ color: s.textPrimary }}>{r.name}</p>
                  <p className="text-[11px]" style={{ color: s.textMuted }}>{r.role} · {r.location} · {'⭐'.repeat(r.rating)}</p>
                  <p className="text-[11px] mt-1 italic" style={{ color: s.textMuted }}>"{r.review.slice(0, 120)}{r.review.length > 120 ? '…' : ''}"</p>
                </div>
                <button onClick={() => deleteReview(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COURSES TAB
// ═══════════════════════════════════════════════════════════

function CoursesTab({ isDark, s, accessToken }: { isDark: boolean; s: ReturnType<typeof useAdminStyles>; accessToken: string }) {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('All Levels');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [category, setCategory] = useState('');
  const [featuresStr, setFeaturesStr] = useState('');
  const [published, setPublished] = useState(false);

  const fetchCourses = useCallback(async () => {
    const res = await apiFetch('/courses/all', accessToken).catch(() => ({ courses: [] }));
    setCourses(res.courses ?? []);
    setLoading(false);
  }, [accessToken]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const resetForm = () => {
    setTitle(''); setDescription(''); setDuration(''); setLevel('All Levels');
    setPrice(''); setOriginalPrice(''); setEmoji('✨'); setCategory('');
    setFeaturesStr(''); setPublished(false); setShowForm(false);
  };

  const saveCourse = async () => {
    if (!title) return;
    setSaving(true);
    await apiFetch('/courses', accessToken, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, description, duration, level, price, originalPrice, emoji, category,
        features: featuresStr.split(',').map(f => f.trim()).filter(Boolean), published,
      }),
    });
    setSaving(false); resetForm(); fetchCourses();
  };

  const togglePublish = async (c: CourseItem) => {
    await apiFetch(`/courses/${c.id}`, accessToken, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !c.published }),
    });
    fetchCourses();
  };

  const deleteCourse = async (id: string) => {
    await apiFetch(`/courses/${id}`, accessToken, { method: 'DELETE' });
    fetchCourses();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm" style={{ color: s.textPrimary }}>Courses ({courses.length})</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
          <Plus className="w-3 h-3" /> Add Course
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Course title *"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none font-medium" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          <div className="grid grid-cols-3 gap-2">
            <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (e.g. 4 Weeks)"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
            <select value={level} onChange={e => setLevel(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }}>
              {['Beginner', 'Intermediate', 'Advanced', 'All Levels'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="Emoji"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (e.g. ₹4,999)"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
            <input value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="Original price"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category"
              className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          </div>
          <input value={featuresStr} onChange={e => setFeaturesStr(e.target.value)} placeholder="Features (comma-separated)"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}`, color: s.textPrimary }} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="accent-purple-600" />
            <span className="text-xs" style={{ color: s.textPrimary }}>Publish immediately</span>
          </label>
          <div className="flex gap-2">
            <button onClick={saveCourse} disabled={saving || !title}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', opacity: saving || !title ? 0.5 : 1 }}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Create
            </button>
            <button onClick={resetForm} className="px-4 py-2 rounded-lg text-xs" style={{ color: s.textMuted }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" style={{ color: '#7C3AED' }} /></div>
      ) : courses.length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: s.textMuted }}>No courses yet.</p>
      ) : (
        <div className="space-y-2">
          {courses.map(c => (
            <div key={c.id} className="rounded-lg p-3 flex items-center justify-between gap-3"
              style={{ background: s.inputBg, border: `1px solid ${s.inputBorder}` }}>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm" style={{ color: s.textPrimary }}>{c.emoji} {c.title}</p>
                <p className="text-[11px]" style={{ color: s.textMuted }}>{c.level} · {c.duration} · {c.price}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => togglePublish(c)} title={c.published ? 'Unpublish' : 'Publish'}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: c.published ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: c.published ? '#10B981' : '#EF4444' }}>
                  {c.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => deleteCourse(c.id)} className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
