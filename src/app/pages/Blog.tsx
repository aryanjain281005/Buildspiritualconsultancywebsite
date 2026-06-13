import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { ArrowLeft, Clock, Tag, Search, ArrowRight, Sparkles, BookOpen, X } from 'lucide-react';
import { blogPosts } from '../data/blog';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import heroImg from '../../imports/image-24.png';
import libraryImg from '../../imports/image-22.png';
import meditationLocalImg from '../../imports/image-27.png';
import gentleExperienceImg from '../../imports/image.png';
import pulseImg from '../../imports/image-10.png';
import confusedImg from '../../imports/image-12.png';
import clarityImg from '../../imports/image-13.png';
import emotionalImg from '../../imports/image-14.png';
import purposeImg from '../../imports/image-15.png';
import spiritualGrowthImg from '../../imports/image-16.png';

const MEDITATION_IMG = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80';

const allCategories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];

function FullPost({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#FAFBFF] dark:bg-[#060312]"
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-purple-100 dark:border-purple-900/20 backdrop-blur-md"
        style={{ background: 'rgba(250,251,255,0.95)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onClose}
            className="inline-flex items-center gap-2 text-[#7C3AED] dark:text-[#A78BFA] text-sm font-medium hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
            <Clock className="w-3.5 h-3.5" />
            5 min read
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">

        {/* Category + date */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1.5 rounded-full text-white text-xs font-medium"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
            Akashic Reading
          </span>
          <span className="text-[#9CA3AF] text-xs">June 7, 2026</span>
          <span className="flex items-center gap-1 text-[#9CA3AF] text-xs"><Clock className="w-3 h-3" /> 5 min read</span>
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl text-[#1E1048] dark:text-[#EDE9FF] mb-6 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
          Akashic Reading: A Simple Way to Understand Your Life Better
        </motion.h1>

        {/* Author */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-10 pb-8 border-b border-purple-100 dark:border-purple-900/20">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>✦</div>
          <div>
            <p className="text-[#1E1048] dark:text-[#EDE9FF] text-sm font-semibold">Rekha Bala</p>
            <p className="text-[#9CA3AF] text-xs">Certified Akashic Reader, Pranic Healer & Lama Fera Healer</p>
          </div>
        </motion.div>

        {/* Hero image */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-3xl overflow-hidden mb-10 shadow-2xl" style={{ height: '380px' }}>
          <ImageWithFallback src={heroImg} alt="Akashic Records Reading" className="w-full h-full object-cover object-top" />
        </motion.div>

        {/* Intro */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <p className="text-[#4B5563] dark:text-[#9CA3AF] text-lg leading-relaxed mb-10">
            In today's fast-moving life, it's normal to feel confused, stuck, or unsure about the path you're on.
            Many people look for answers outside, but often, the clarity we seek already exists within us.
            Akashic Reading is a gentle and insightful way to access that inner wisdom and understand your life on a deeper level.
          </p>
        </motion.div>

        {/* Section 1 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl md:text-3xl text-[#1E1048] dark:text-[#EDE9FF] mb-4 mt-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            What is Akashic Reading?
          </h2>
          <p className="text-[#4B5563] dark:text-[#9CA3AF] text-base leading-relaxed mb-8">
            Akashic Reading is a spiritual practice that connects with the soul's records — often described as an energetic library
            of your journey. It holds information about your past experiences, present situations, and possible future paths.
            This is not about predicting your life, but about helping you understand it better.
          </p>
        </motion.div>

        {/* Visual: library image */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="rounded-2xl overflow-hidden mb-10 shadow-xl" style={{ height: '300px' }}>
          <ImageWithFallback src={libraryImg} alt="The cosmic library of the soul" className="w-full h-full object-cover" />
        </motion.div>
        <p className="text-center text-[#9CA3AF] text-xs italic mb-10 -mt-6">The Akashic Records — an energetic library of your soul's journey</p>

        {/* Section 2 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl md:text-3xl text-[#1E1048] dark:text-[#EDE9FF] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            How Can It Help You?
          </h2>
          <p className="text-[#4B5563] dark:text-[#9CA3AF] text-base leading-relaxed mb-8">
            An Akashic Reading can bring clarity to areas where you feel stuck or confused. Whether it's your career,
            relationships, or personal growth, it helps you see patterns and understand why certain situations keep repeating.
            When you gain this awareness, it becomes easier to make better and more confident decisions.
          </p>
        </motion.div>

        {/* Visual: meditation */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="rounded-2xl overflow-hidden mb-10 shadow-xl" style={{ height: '280px' }}>
          <ImageWithFallback src={meditationLocalImg} alt="Meditation and inner clarity" className="w-full h-full object-contain" style={{ background: 'linear-gradient(135deg, #0c0820, #1a0940)' }} />
        </motion.div>

        {/* Section 3 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl md:text-3xl text-[#1E1048] dark:text-[#EDE9FF] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            A Gentle and Supportive Experience
          </h2>
          <p className="text-[#4B5563] dark:text-[#9CA3AF] text-base leading-relaxed mb-8">
            Many people feel nervous before their first session, but Akashic Reading is a calm and safe experience.
            It is not about judgment or fear. Instead, it is about understanding, healing, and moving forward with clarity.
            You are guided in a simple and comfortable way, so you can truly connect with your own journey.
          </p>
        </motion.div>

        {/* Visual: gentle experience */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="rounded-2xl overflow-hidden mb-10 shadow-xl" style={{ height: '300px' }}>
          <ImageWithFallback src={gentleExperienceImg} alt="A gentle and supportive Akashic Reading experience" className="w-full h-full object-cover" />
        </motion.div>

        {/* Pull quote */}
        <motion.blockquote initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="border-l-4 border-[#7C3AED] pl-6 py-2 my-10"
          style={{ background: 'rgba(124,58,237,0.04)', borderRadius: '0 12px 12px 0' }}>
          <p className="text-[#7C3AED] dark:text-[#A78BFA] text-xl leading-relaxed italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
            "The records hold no judgment — only infinite compassion and wisdom for your soul's highest good."
          </p>
          <footer className="text-[#9CA3AF] text-sm mt-3">— Rekha Bala, Vyana Soul</footer>
        </motion.blockquote>

        {/* Visual: after pull quote */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="flex justify-center mb-10">
          <div className="rounded-2xl overflow-hidden shadow-xl w-72" style={{ height: '420px' }}>
            <ImageWithFallback src={pulseImg} alt="Akashic records compassion and wisdom" className="w-full h-full object-cover object-top" />
          </div>
        </motion.div>

        {/* Section 4: Who is it for */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl md:text-3xl text-[#1E1048] dark:text-[#EDE9FF] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            Who is it For?
          </h2>
          <p className="text-[#4B5563] dark:text-[#9CA3AF] text-base leading-relaxed mb-5">
            Akashic Reading is for anyone who:
          </p>
          <ul className="space-y-4 mb-10">
            {[
              { text: 'Feels confused about life decisions', img: confusedImg },
              { text: 'Wants clarity in relationships', img: clarityImg },
              { text: 'Is going through emotional challenges', img: emotionalImg },
              { text: 'Is seeking purpose or direction', img: purposeImg },
              { text: 'Wants to grow spiritually', img: spiritualGrowthImg },
            ].map((item, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden shadow-md">
                  <img src={item.img} alt={item.text} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>✦</span>
                  <span className="text-[#4B5563] dark:text-[#9CA3AF] text-base">{item.text}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>


        {/* Section 5 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl md:text-3xl text-[#1E1048] dark:text-[#EDE9FF] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            What You Can Expect
          </h2>
          <p className="text-[#4B5563] dark:text-[#9CA3AF] text-base leading-relaxed mb-8">
            During a session at Vyana Soul, the focus is on helping you understand yourself better. You may receive
            insights about your life patterns, emotional blocks, or hidden strengths. The goal is not to control your
            future, but to help you feel more aware, confident, and peaceful.
          </p>
        </motion.div>

        {/* Section 6 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl md:text-3xl text-[#1E1048] dark:text-[#EDE9FF] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            Why Choose Vyana Soul?
          </h2>
          <p className="text-[#4B5563] dark:text-[#9CA3AF] text-base leading-relaxed mb-10">
            At Vyana Soul, founded by <strong className="text-[#E53E3E]">Rekha Bala</strong>, every session is done with care,
            honesty, and respect. You are given a safe space where you can openly explore your thoughts and feelings without fear.
            The guidance is simple, clear, and focused on real healing.
          </p>
        </motion.div>

        {/* Final thoughts */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="p-8 rounded-3xl mb-10"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.07) 0%, rgba(245,158,11,0.06) 100%)', border: '1px solid rgba(124,58,237,0.12)' }}>
          <h2 className="text-2xl md:text-3xl text-[#1E1048] dark:text-[#EDE9FF] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            Final Thoughts
          </h2>
          <p className="text-[#4B5563] dark:text-[#9CA3AF] text-base leading-relaxed mb-6">
            Akashic Reading is not magic — it is awareness. And sometimes, awareness is all you need to change your life.
            When you understand yourself better, everything else begins to fall into place naturally.
          </p>
          <p className="text-[#4B5563] dark:text-[#9CA3AF] text-base leading-relaxed mb-6 font-medium">
            Ready to explore your journey?<br />Take the first step toward clarity and inner peace.
          </p>
          <Link to="/#consultancy">
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(124,58,237,0.35)' }} whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-full text-white font-medium text-sm flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
              <Sparkles className="w-4 h-4" />
              Book your Akashic Reading session today
            </motion.button>
          </Link>
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-purple-100 dark:border-purple-900/20">
          {['Akashic Reading', 'Soul Wisdom', 'Healing', 'Clarity'].map(tag => (
            <span key={tag} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[#7C3AED] dark:text-[#A78BFA] text-xs border border-[#7C3AED]/15 bg-[#7C3AED]/5">
              <Tag className="w-3 h-3" />{tag}
            </span>
          ))}
        </div>

      </article>
    </motion.div>
  );
}

function BlogCard({ post, index, onRead }: { post: typeof blogPosts[0]; index: number; onRead: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(124,58,237,0.15)' }}
      className="group bg-white dark:bg-[#0E0825] rounded-3xl overflow-hidden border border-purple-50 dark:border-purple-900/20 transition-all duration-300 md:col-span-2 lg:col-span-1"
    >
      {/* Image */}
      <div className="overflow-hidden relative h-64">
        <ImageWithFallback src={heroImg} alt={post.title} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,3,18,0.55) 0%, transparent 60%)' }} />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1.5 rounded-full text-white text-xs font-medium"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
            {post.category}
          </span>
          <span className="px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
            <Sparkles className="w-3 h-3" />Featured
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-xs text-[#9CA3AF]"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
          <span className="text-[#9CA3AF] text-xs">{post.date}</span>
        </div>
        <h3 className="text-[#1E1048] dark:text-[#EDE9FF] text-xl mb-3 leading-tight group-hover:text-[#7C3AED] dark:group-hover:text-[#A78BFA] transition-colors"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {post.title}
        </h3>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-full text-[#7C3AED] dark:text-[#A78BFA] text-xs border border-[#7C3AED]/15 bg-[#7C3AED]/5">
              <Tag className="w-2.5 h-2.5" />{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>✦</div>
            <span className="text-[#4B5563] dark:text-[#9CA3AF] text-xs">{post.author}</span>
          </div>
          <motion.button whileHover={{ x: 4 }} onClick={onRead}
            className="flex items-center gap-1 text-[#7C3AED] dark:text-[#A78BFA] text-sm font-medium">
            Read More <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openPost, setOpenPost] = useState<string | null>(null);

  const filtered = blogPosts.filter(post => {
    const matchCat = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch = !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFBFF] dark:bg-[#060312]">

      <AnimatePresence>
        {openPost && <FullPost onClose={() => setOpenPost(null)} />}
      </AnimatePresence>

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)' }}>
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }} />
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[#7C3AED] dark:text-[#A78BFA] hover:gap-3 transition-all duration-200 mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7C3AED]/15 mb-6"
              style={{ background: 'rgba(124,58,237,0.05)' }}>
              <Sparkles className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F59E0B]" />
              <span className="text-[#B45309] dark:text-[#F59E0B] text-xs uppercase tracking-[0.3em] font-medium">Wisdom & Insights</span>
            </div>
            <h1 className="text-5xl md:text-6xl text-[#1E1048] dark:text-[#EDE9FF] mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Sacred <em className="italic text-[#7C3AED] dark:text-[#A78BFA]">Blog</em> & Articles
            </h1>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg max-w-xl mx-auto leading-relaxed mb-8">
              Explore insights on Akashic reading, energy healing, and your soul's evolutionary journey.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#7C3AED]/15 text-[#1E1048] dark:text-[#EDE9FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 transition-all bg-white dark:bg-[#0E0825]" />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl pb-24">
        {/* Category filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-2 justify-center mb-12">
          {allCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={activeCategory === cat ? {
                background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: 'white', boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
              } : { color: '#6B7280', border: '1px solid rgba(124,58,237,0.15)' }}>
              {cat}
            </button>
          ))}
        </motion.div>

        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} onRead={() => setOpenPost(post.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4"><BookOpen className="w-12 h-12 mx-auto text-[#9CA3AF]" /></div>
            <h3 className="text-2xl text-[#1E1048] dark:text-[#EDE9FF] mb-2">No Articles Found</h3>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6">Try adjusting your search or browse all categories.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="px-6 py-3 rounded-full text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Newsletter CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mt-20 text-center p-10 md:p-16 rounded-3xl"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(245,158,11,0.06) 100%)', border: '1px solid rgba(124,58,237,0.12)' }}>
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-3xl md:text-4xl text-[#1E1048] dark:text-[#EDE9FF] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Never Miss a Sacred Insight
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-8 max-w-md mx-auto">
            Subscribe to get new articles, spiritual insights, and exclusive wisdom delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-[#7C3AED]/15 text-[#1E1048] dark:text-[#EDE9FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 bg-white dark:bg-[#0E0825]" />
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }} whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl text-white font-medium text-sm flex-shrink-0 flex items-center gap-2 justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
              Subscribe <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
