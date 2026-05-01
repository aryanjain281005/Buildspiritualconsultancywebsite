import { motion } from 'motion/react';
import { ChevronDown, Sparkles, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HERO_BG = 'https://images.unsplash.com/photo-1773760008677-938aece4d407?w=1920&q=80';

const starPositions = [
  { top: '15%', left: '8%', delay: 0, dur: 2.5 },
  { top: '25%', left: '92%', delay: 0.8, dur: 3.2 },
  { top: '60%', left: '5%', delay: 1.2, dur: 2.8 },
  { top: '70%', left: '88%', delay: 0.4, dur: 3.5 },
  { top: '40%', left: '96%', delay: 1.6, dur: 2.2 },
  { top: '80%', left: '15%', delay: 0.9, dur: 3.1 },
  { top: '10%', left: '55%', delay: 2.0, dur: 2.7 },
  { top: '50%', left: '78%', delay: 1.4, dur: 3.4 },
  { top: '35%', left: '3%', delay: 0.6, dur: 2.9 },
  { top: '88%', left: '60%', delay: 1.8, dur: 2.4 },
];

export default function Hero() {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(6,3,18,0.75) 0%, rgba(60,20,120,0.45) 40%, rgba(6,3,18,0.90) 100%)' }} />
      <div className="absolute inset-0 z-[2]" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,3,18,0.6) 100%)' }} />

      {/* Glowing orbs */}
      <motion.div className="absolute top-24 left-16 w-80 h-80 rounded-full z-[2]"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-32 right-20 w-96 h-96 rounded-full z-[2]"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full z-[2]"
        style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 60%)' }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

      {/* Star particles */}
      {starPositions.map((star, i) => (
        <motion.div key={i} className="absolute w-1 h-1 bg-white rounded-full z-[3]"
          style={{ top: star.top, left: star.left }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: star.dur, repeat: Infinity, ease: 'easeInOut', delay: star.delay }} />
      ))}

      {/* Spinning rings */}
      <motion.div className="absolute top-24 right-24 w-32 h-32 rounded-full border border-purple-500/20 z-[3]"
        animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="absolute bottom-40 left-20 w-20 h-20 rounded-full border border-amber-500/20 z-[3]"
        animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24 pb-32">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-purple-400/30"
          style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(8px)' }}>
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-amber-300 text-sm tracking-widest uppercase font-medium">{t.hero.badge}</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, lineHeight: 1.1 }}>
          {t.hero.headline1}
          <br />
          <span className="italic" style={{ background: 'linear-gradient(135deg, #C4B5FD, #A78BFA, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {t.hero.headline2}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-purple-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t.hero.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124,58,237,0.5)' }} whileTap={{ scale: 0.97 }}
            onClick={() => scrollToSection('courses')}
            className="px-8 py-4 rounded-full text-white font-medium text-base flex items-center gap-2 transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', boxShadow: '0 0 25px rgba(124,58,237,0.4)' }}>
            <Sparkles className="w-5 h-5" />
            {t.hero.cta1}
          </motion.button>
          <motion.button whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.97 }}
            onClick={() => scrollToSection('consultancy')}
            className="px-8 py-4 rounded-full text-white font-medium text-base border border-white/30 flex items-center gap-2 transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
            <Star className="w-5 h-5 text-amber-400" />
            {t.hero.cta2}
          </motion.button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
          className="flex justify-center">
          {t.hero.stats.map((stat, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}
              className="text-center px-12 py-5 rounded-2xl border border-white/15"
              style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}>
              <div className="text-5xl md:text-6xl text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                {stat.value}
              </div>
              <div className="text-purple-300 text-sm tracking-widest uppercase mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollToSection('about')}>
        <span className="text-white/50 text-xs tracking-widest uppercase">{t.hero.scroll}</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}