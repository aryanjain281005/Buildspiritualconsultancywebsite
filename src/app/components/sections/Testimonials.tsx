import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import { useLanguage } from '../../context/LanguageContext';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-4 h-4" fill={i < rating ? '#F59E0B' : 'none'} stroke={i < rating ? '#F59E0B' : '#9CA3AF'} />
      ))}
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg bg-gradient-to-br ${color} shadow-lg flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [dbReviews, setDbReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://xvdoutqezjsuogankqna.supabase.co/functions/v1/make-server-d03e957c/reviews')
      .then(res => res.json())
      .then(data => {
        if (data && data.reviews && data.reviews.length > 0) {
          const formatted = data.reviews.map((r: any) => ({
            id: r.id,
            name: r.name,
            role: r.role || 'Client',
            location: r.location || 'Global',
            rating: r.rating || 5,
            review: r.review,
            fullReview: r.full_review || r.review,
            service: r.service || 'Spiritual Session',
            initials: (r.name || 'Anonymous').substring(0, 2).toUpperCase(),
            color: r.color || 'from-[#7C3AED] to-[#EC4899]',
            date: new Date(r.created_at).toLocaleDateString()
          }));
          setDbReviews(formatted);
        }
      })
      .catch(err => console.error("Error fetching reviews:", err));
  }, []);

  const displayItems = dbReviews.length > 0 ? dbReviews : testimonials;

  const next = () => { setDirection(1); setActiveIndex(i => (i + 1) % displayItems.length); };
  const prev = () => { setDirection(-1); setActiveIndex(i => (i - 1 + displayItems.length) % displayItems.length); };
  const featured = displayItems[activeIndex] || displayItems[0];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-white dark:bg-[#060312] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />
      <div className="absolute top-16 left-8 md:left-20 opacity-5 dark:opacity-5 pointer-events-none">
        <Quote className="w-40 h-40 text-[#7C3AED]" />
      </div>
      <div className="absolute bottom-16 right-8 md:right-20 opacity-5 dark:opacity-5 pointer-events-none rotate-180">
        <Quote className="w-40 h-40 text-[#7C3AED]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[#B45309] dark:text-[#F59E0B] text-sm uppercase tracking-[0.3em] font-medium">{t.testimonials.tagline}</span>
          <h2 className="text-4xl md:text-6xl text-[#1E1048] dark:text-[#EDE9FF] mt-3 mb-6">
            {t.testimonials.heading} <em className="italic text-[#7C3AED] dark:text-[#A78BFA]">{t.testimonials.headingItalic}</em>
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-xl mx-auto">{t.testimonials.desc}</p>
          <div className="w-16 h-1 mx-auto rounded-full mt-6" style={{ background: 'linear-gradient(90deg, #7C3AED, #F59E0B)' }} />
        </motion.div>

        {/* Featured Slider */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={activeIndex} custom={direction}
                initial={{ opacity: 0, x: direction * 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl p-8 md:p-12 border border-[#7C3AED]/10 dark:border-[#7C3AED]/15"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(245,158,11,0.04) 100%)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <StarRating rating={featured.rating} />
                <blockquote className="text-xl md:text-2xl text-[#1E1048] dark:text-[#EDE9FF] mt-5 mb-8 leading-relaxed"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 400 }}>
                  "{featured.fullReview}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <Avatar initials={featured.initials} color={featured.color} />
                  <div>
                    <div className="text-[#1E1048] dark:text-[#EDE9FF] font-semibold">{featured.name}</div>
                    <div className="text-[#7C3AED] dark:text-[#A78BFA] text-sm">{featured.role}</div>
                    <div className="text-[#9CA3AF] text-xs mt-0.5">{featured.location} · {featured.date}</div>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1.5 rounded-full text-xs text-[#7C3AED] dark:text-[#A78BFA] border border-[#7C3AED]/20 dark:border-[#A78BFA]/20">
                      {featured.service}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={prev}
              className="w-12 h-12 rounded-full border border-[#7C3AED]/20 dark:border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED] dark:text-[#A78BFA] hover:bg-[#7C3AED]/5 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex gap-2">
              {displayItems.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === activeIndex ? '24px' : '8px', height: '8px', background: i === activeIndex ? 'linear-gradient(90deg, #7C3AED, #F59E0B)' : 'rgba(124,58,237,0.25)' }} />
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={next}
              className="w-12 h-12 rounded-full border border-[#7C3AED]/20 dark:border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED] dark:text-[#A78BFA] hover:bg-[#7C3AED]/5 transition-all">
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((t_item, i) => (
            <motion.div key={t_item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(124,58,237,0.12)' }}
              className={`rounded-2xl p-6 border cursor-pointer transition-all duration-300 ${i === activeIndex ? 'border-[#7C3AED]/40 dark:border-[#7C3AED]/40 shadow-lg' : 'border-purple-50 dark:border-purple-900/20'} bg-white dark:bg-[#0E0825]`}
              onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}>
              <div className="flex items-start gap-3 mb-4">
                <Avatar initials={t_item.initials} color={t_item.color} />
                <div className="flex-1 min-w-0">
                  <div className="text-[#1E1048] dark:text-[#EDE9FF] font-semibold text-sm truncate">{t_item.name}</div>
                  <div className="text-[#7C3AED] dark:text-[#A78BFA] text-xs truncate">{t_item.role}</div>
                  <StarRating rating={t_item.rating} />
                </div>
              </div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed line-clamp-3">"{t_item.review}"</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[#9CA3AF] text-xs">{t_item.date}</span>
                <span className="text-xs px-2 py-1 rounded-full text-[#7C3AED] dark:text-[#A78BFA] bg-[#7C3AED]/5 dark:bg-[#A78BFA]/10">{t_item.service}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Rating */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14 p-8 rounded-2xl border border-[#7C3AED]/10 dark:border-[#7C3AED]/15"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(245,158,11,0.05) 100%)' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-6 h-6 fill-amber-400 stroke-amber-400" />)}
            </div>
            <span className="text-3xl font-bold text-[#1E1048] dark:text-[#EDE9FF]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>5.0</span>
          </div>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
            {t.testimonials.ratingDesc} <strong className="text-[#1E1048] dark:text-[#EDE9FF]">{t.testimonials.ratingCount}</strong> {t.testimonials.ratingDesc2}
          </p>
        </motion.div>
      </div>
    </section>
  );
}