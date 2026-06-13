import { motion } from 'motion/react';
import { ChevronDown, Sparkles, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import rekhaBalaPhoto from '../../../imports/image-19.png';

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
      <div className="absolute inset-0 z-0"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(180deg, rgba(6,3,18,0.80) 0%, rgba(60,20,120,0.50) 40%, rgba(6,3,18,0.92) 100%)' }} />
      <div className="absolute inset-0 z-[2]"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,3,18,0.55) 100%)' }} />

      {/* Glowing orbs */}
      <motion.div className="absolute top-24 left-16 w-80 h-80 rounded-full z-[2]"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-32 right-20 w-96 h-96 rounded-full z-[2]"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />

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

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* ── Right: Text ───────────────────────────────────── */}
          <div className="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0 order-2 lg:order-2">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7 border border-purple-400/30"
              style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(8px)' }}>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 text-xs tracking-widest uppercase font-medium">{t.hero.badge}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl text-white mb-5 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, lineHeight: 1.12 }}>
              {t.hero.headline1}
              <br />
              <span className="italic"
                style={{ background: 'linear-gradient(135deg, #C4B5FD, #A78BFA, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {t.hero.headline2}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base md:text-lg text-purple-200/80 mb-9 leading-relaxed">
              Unlock the cosmic wisdom of your soul's journey. Meet{' '}
              <span className="font-bold italic" style={{
                color: '#E53E3E',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.15em',
              }}>Rekha Bala</span>,{' '}
              your certified Akashic Reader, Lama Fera Healer, and Pranic Healer. Through personalized readings, and expert consultancy, Rekha guides you to release old blocks, align with your true purpose, and step into a life of profound clarity and healing.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
              <motion.button whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.97 }}
                onClick={() => scrollToSection('consultancy')}
                className="px-7 py-3.5 rounded-full text-white font-medium text-sm border border-white/30 flex items-center gap-2 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
                <Star className="w-4 h-4 text-amber-400" />
                {t.hero.cta2}
              </motion.button>
            </motion.div>

            {/* Stats Bar */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
              className="flex justify-center lg:justify-start">
              {t.hero.stats.map((stat, i) => (
                <motion.div key={i} whileHover={{ scale: 1.05 }}
                  className="text-center px-8 py-4 rounded-2xl border border-white/15"
                  style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}>
                  <div className="text-4xl md:text-5xl text-white mb-0.5"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                    {stat.value}
                  </div>
                  <div className="text-purple-300 text-xs tracking-widest uppercase mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Left: Portrait ────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35 }}
            className="flex-shrink-0 flex items-center justify-center lg:justify-start order-1 lg:order-1">
            <div className="relative">
              {/* Outer orbit rings */}
              <motion.div className="absolute inset-0 -m-10 rounded-full border border-purple-400/20"
                animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400/60" />
              </motion.div>
              <motion.div className="absolute inset-0 -m-6 rounded-full border border-amber-400/15"
                animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
                <div className="absolute bottom-2 right-4 w-1.5 h-1.5 rounded-full bg-amber-400/70" />
              </motion.div>

              {/* Glow backdrop */}
              <div className="absolute inset-0 rounded-3xl blur-2xl -z-10 scale-110"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.45) 0%, rgba(109,40,217,0.2) 50%, transparent 75%)' }} />

              {/* Photo card */}
              <div className="relative w-64 h-[350px] sm:w-80 sm:h-[440px] md:w-[340px] md:h-[470px] rounded-3xl overflow-hidden"
                style={{
                  boxShadow: '0 0 0 1px rgba(167,139,250,0.25), 0 30px 80px rgba(6,3,18,0.6), 0 0 60px rgba(124,58,237,0.3)',
                  background: 'linear-gradient(160deg, rgba(124,58,237,0.15), rgba(6,3,18,0.4))'
                }}>
                <ImageWithFallback
                  src={rekhaBalaPhoto}
                  alt="Rekha Bala – Certified Akashic Reader & Founder of Vyana Soul"
                  className="w-full h-full object-cover object-top"
                />
                {/* Bottom name overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4"
                  style={{ background: 'linear-gradient(0deg, rgba(6,3,18,0.90) 0%, rgba(6,3,18,0.5) 70%, transparent 100%)' }}>
                  <p className="text-lg leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 800, color: '#E53E3E' }}>
                    Rekha Bala
                  </p>
                  <p className="text-purple-300/90 text-xs tracking-wider uppercase mt-0.5">
                    Certified Akashic Reader, Pranic Healer & Lama Fera Healer
                  </p>
                </div>
              </div>

              {/* Floating badge – top right */}
              <motion.div
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full border border-amber-400/40 text-amber-300 text-xs tracking-wide"
                style={{ background: 'rgba(245,158,11,0.12)', backdropFilter: 'blur(8px)' }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                ✨ Vyana Soul
              </motion.div>

              {/* Floating badge – bottom left */}
              <motion.div
                className="absolute -bottom-5 -left-5 px-3 py-1.5 rounded-full border border-purple-400/30 text-purple-300 text-xs tracking-wide flex items-center gap-1.5"
                style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(8px)' }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Soul Healing Guide
              </motion.div>
            </div>
          </motion.div>
        </div>
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
