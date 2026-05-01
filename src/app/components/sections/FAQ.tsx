import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const allCategories = ['All', 'General', 'Sessions', 'Courses', 'Booking'];

export default function FAQ() {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>('1');
  const [activeCategory, setActiveCategory] = useState('All');

  const faqsData = t.faq.faqsData;
  const filtered = activeCategory === 'All' ? faqsData : faqsData.filter(f => f.category === activeCategory);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#FAF8FF] dark:bg-[#0B0720] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4 text-[#B45309] dark:text-[#F59E0B]" />
            <span className="text-[#B45309] dark:text-[#F59E0B] text-sm uppercase tracking-[0.3em] font-medium">{t.faq.tagline}</span>
          </div>
          <h2 className="text-4xl md:text-6xl text-[#1E1048] dark:text-[#EDE9FF] mb-6">
            {t.faq.heading} <em className="italic text-[#7C3AED] dark:text-[#A78BFA]">{t.faq.headingItalic}</em>
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-xl mx-auto">{t.faq.desc}</p>
          <div className="w-16 h-1 mx-auto rounded-full mt-6" style={{ background: 'linear-gradient(90deg, #7C3AED, #F59E0B)' }} />
        </motion.div>

        {/* Category Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10">
          {allCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={activeCategory === cat ? { background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: 'white', boxShadow: '0 4px 15px rgba(124,58,237,0.3)' }
                : { background: 'transparent', color: '#6B7280', border: '1px solid rgba(124,58,237,0.2)' }}>
              {t.faq.categoryLabels[cat as keyof typeof t.faq.categoryLabels] || cat}
            </button>
          ))}
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filtered.map((faq, i) => (
            <motion.div key={faq.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden border transition-all duration-300"
              style={{ borderColor: openId === faq.id ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.08)', background: openId === faq.id ? 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(245,158,11,0.03) 100%)' : undefined }}>
              <button className="w-full text-left flex items-center justify-between gap-4 p-6 transition-all duration-200 bg-white dark:bg-[#0E0825] hover:bg-purple-50 dark:hover:bg-[#130D2A]"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                style={{ background: openId === faq.id ? 'transparent' : undefined }}>
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: openId === faq.id ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : 'rgba(124,58,237,0.1)' }}>
                    <span className="text-xs font-bold" style={{ color: openId === faq.id ? 'white' : '#7C3AED' }}>{faq.id}</span>
                  </div>
                  <span className="text-[#1E1048] dark:text-[#EDE9FF] font-medium text-base leading-snug">{faq.question}</span>
                </div>
                <motion.div animate={{ rotate: openId === faq.id ? 180 : 0 }} transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: openId === faq.id ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'rgba(124,58,237,0.1)' }}>
                  <ChevronDown className="w-4 h-4" style={{ color: openId === faq.id ? 'white' : '#7C3AED' }} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openId === faq.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: 'easeInOut' }} className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2">
                      <div className="ml-10">
                        <p className="text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed text-sm md:text-base">{faq.answer}</p>
                        <div className="mt-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border border-[#7C3AED]/15 text-[#7C3AED] dark:text-[#A78BFA] bg-[#7C3AED]/5">
                            {t.faq.categoryLabels[faq.category as keyof typeof t.faq.categoryLabels] || faq.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14 p-8 rounded-2xl border border-[#7C3AED]/10 dark:border-[#7C3AED]/15"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(245,158,11,0.05) 100%)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl text-[#1E1048] dark:text-[#EDE9FF] mb-3">{t.faq.stillHaveQsTitle}</h3>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6 max-w-sm mx-auto text-sm">{t.faq.stillHaveQsDesc}</p>
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(124,58,237,0.35)' }} whileTap={{ scale: 0.97 }} onClick={scrollToContact}
            className="px-6 py-3 rounded-full text-white font-medium text-sm inline-flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
            {t.faq.getInTouch}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
