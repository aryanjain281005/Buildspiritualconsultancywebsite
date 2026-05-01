import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowLeft, Clock, Tag, Search, ArrowRight, Sparkles } from 'lucide-react';
import { blogPosts } from '../data/blog';

const allCategories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];

function BlogCard({ post, index, featured = false }: { post: typeof blogPosts[0]; index: number; featured?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(124,58,237,0.15)' }}
      className={`group bg-white dark:bg-[#0E0825] rounded-3xl overflow-hidden border border-purple-50 dark:border-purple-900/20 transition-all duration-400 ${featured ? 'md:col-span-2' : ''}`}
    >
      {/* Image */}
      <div className={`overflow-hidden relative ${featured ? 'h-72' : 'h-52'}`}>
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,3,18,0.5) 0%, transparent 60%)' }} />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full text-white text-xs font-medium"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', backdropFilter: 'blur(4px)' }}>
            {post.category}
          </span>
        </div>
        {post.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span className="text-[#9CA3AF] text-xs">{post.date}</span>
        </div>

        {/* Title */}
        <h3 className={`text-[#1E1048] dark:text-[#EDE9FF] mb-3 leading-tight group-hover:text-[#7C3AED] dark:group-hover:text-[#A78BFA] transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed mb-5 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-full text-[#7C3AED] dark:text-[#A78BFA] text-xs border border-[#7C3AED]/15 dark:border-[#A78BFA]/15 bg-[#7C3AED]/5">
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Author + Read More */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
              ✦
            </div>
            <span className="text-[#4B5563] dark:text-[#9CA3AF] text-xs">{post.author}</span>
          </div>
          <motion.button
            whileHover={{ x: 4 }}
            className="flex items-center gap-1 text-[#7C3AED] dark:text-[#A78BFA] text-sm font-medium"
          >
            Read More
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)' }}>
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }} />
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#7C3AED] dark:text-[#A78BFA] hover:gap-3 transition-all duration-200 mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7C3AED]/15 mb-6"
              style={{ background: 'rgba(124,58,237,0.05)' }}>
              <Sparkles className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F59E0B]" />
              <span className="text-[#B45309] dark:text-[#F59E0B] text-xs uppercase tracking-[0.3em] font-medium">
                Wisdom & Insights
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl text-[#1E1048] dark:text-[#EDE9FF] mb-5">
              Sacred <em className="italic text-[#7C3AED] dark:text-[#A78BFA]">Blog</em> & Articles
            </h1>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg max-w-xl mx-auto leading-relaxed mb-8">
              Explore insights on Akaashic reading, energy healing, past lives, and your soul's evolutionary journey.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#7C3AED]/15 text-[#1E1048] dark:text-[#EDE9FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 transition-all bg-white dark:bg-[#0E0825]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-7xl pb-24">
        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={activeCategory === cat ? {
                background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
              } : {
                color: '#6B7280',
                border: '1px solid rgba(124,58,237,0.15)',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Posts grid */}
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post, i) => (
              <BlogCard
                key={post.id}
                post={post}
                index={i}
                featured={post.featured && i === 0 && activeCategory === 'All' && !search}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl text-[#1E1048] dark:text-[#EDE9FF] mb-2">No Articles Found</h3>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6">
              Try adjusting your search or browse all categories.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="px-6 py-3 rounded-full text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 text-center p-10 md:p-16 rounded-3xl"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(245,158,11,0.06) 100%)', border: '1px solid rgba(124,58,237,0.12)' }}
        >
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-3xl md:text-4xl text-[#1E1048] dark:text-[#EDE9FF] mb-4">
            Never Miss a Sacred Insight
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-8 max-w-md mx-auto">
            Subscribe to get new articles, spiritual insights, and exclusive wisdom delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-[#7C3AED]/15 text-[#1E1048] dark:text-[#EDE9FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 bg-white dark:bg-[#0E0825]"
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl text-white font-medium text-sm flex-shrink-0 flex items-center gap-2 justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}