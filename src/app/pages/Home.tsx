import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Courses from '../components/sections/Courses';
import Consultancy from '../components/sections/Consultancy';
import Gallery from '../components/sections/Gallery';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import Contact from '../components/sections/Contact';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function ServicesHighlight() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white dark:bg-[#060312] relative">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.2), transparent)' }} />
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7C3AED]/15 mb-4" style={{ background: 'rgba(124,58,237,0.05)' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#A78BFA]" />
            <span className="text-[#7C3AED] dark:text-[#A78BFA] text-xs uppercase tracking-widest font-medium">{t.home.servicesTagline}</span>
          </div>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.home.services.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(124,58,237,0.12)' }}
              className="p-6 rounded-2xl bg-[#FAF8FF] dark:bg-[#0E0825] border border-purple-50 dark:border-purple-900/20 text-center transition-all duration-300">
              <div className="text-4xl mb-4">{s.emoji}</div>
              <h3 className="text-[#1E1048] dark:text-[#EDE9FF] text-lg mb-2">{s.title}</h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  const { t } = useLanguage();

  const scrollToConsultancy = () => {
    const el = document.getElementById('consultancy');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #5B21B6 100%)' }} />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1773760008677-938aece4d407?w=1920&q=60')", backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }} />
      <motion.div className="absolute top-10 right-20 w-64 h-64 rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="text-5xl mb-5">✨</div>
          <h2 className="text-4xl md:text-5xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
            {t.home.ctaHeading}
          </h2>
          <p className="text-purple-200/80 text-lg mb-8 max-w-xl mx-auto leading-relaxed">{t.home.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }} whileTap={{ scale: 0.97 }} onClick={scrollToConsultancy}
              className="px-8 py-4 rounded-full text-purple-900 font-semibold flex items-center gap-2 justify-center"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
              {t.home.ctaBtn1}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full text-white font-medium border border-white/30 flex items-center gap-2 justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              {t.home.ctaBtn2}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesHighlight />
      <About />
      <Courses />
      <CallToAction />
      <Consultancy />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}
