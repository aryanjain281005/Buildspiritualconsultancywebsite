import { motion } from 'motion/react';
import { Heart, Eye, TrendingUp, Users, Award, Globe, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../context/LanguageContext';
import rekhaBalaImg from '@/imports/image-4.png';

const valueIcons = [Heart, Eye, TrendingUp, Users];
const achievementIcons = [Users, Globe, Award, Sparkles];
const achievementValues = ['2,500+', '25+', '98%'];

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 md:py-32 bg-[#FAF8FF] dark:bg-[#0B0720] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 dark:opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-20">
          <span className="text-[#B45309] dark:text-[#F59E0B] text-sm uppercase tracking-[0.3em] font-medium">{t.about.tagline}</span>
          <h2 className="text-4xl md:text-6xl text-[#1E1048] dark:text-[#EDE9FF] mt-3 mb-6">
            {t.about.heading} <em className="italic text-[#7C3AED] dark:text-[#A78BFA]">{t.about.headingItalic}</em>
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #7C3AED, #F59E0B)' }} />
        </motion.div>

        {/* Main Two Column */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ height: '500px' }}>
              <ImageWithFallback src={rekhaBalaImg} alt="Rekha Bala - Spiritual meditation and practice" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(30,16,72,0.6) 0%, transparent 50%)' }} />
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-8 -right-8 bg-white dark:bg-[#130D2A] rounded-2xl p-5 shadow-2xl border border-purple-100 dark:border-purple-900/30 max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[#1E1048] dark:text-[#EDE9FF] font-semibold text-sm">{t.about.certifiedTitle}</div>
                  <div className="text-[#6B7280] dark:text-[#9CA3AF] text-xs">{t.about.certifiedSubtitle}</div>
                </div>
              </div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs leading-relaxed">{t.about.certifiedDesc}</p>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h3 className="text-3xl md:text-4xl text-[#1E1048] dark:text-[#EDE9FF] mb-6 leading-tight">
              {t.about.subheading} <em className="italic text-[#7C3AED] dark:text-[#A78BFA]">{t.about.subheadingItalic}</em>
            </h3>
            <div className="space-y-4 text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed mb-8">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {t.about.tags.map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full text-[#7C3AED] dark:text-[#A78BFA] border border-[#7C3AED]/20 dark:border-[#A78BFA]/20 text-sm bg-[#7C3AED]/5 dark:bg-[#A78BFA]/10">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Founder Section */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 md:p-12 mb-24 border border-[#7C3AED]/10 dark:border-[#7C3AED]/20"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(245,158,11,0.05) 100%)' }}>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto md:mx-0 mb-4 border-4 border-[#7C3AED]/30">
                <ImageWithFallback src={rekhaBalaImg} alt="Rekha Bala - Certified Akaashik Reader" className="w-full h-full object-cover" />
              </div>
              <div className="text-[#1E1048] dark:text-[#EDE9FF] font-semibold text-lg">{t.about.certifiedTitle}</div>
              <div className="text-[#7C3AED] dark:text-[#A78BFA] text-sm">{t.about.certifiedSubtitle}</div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-2xl md:text-3xl text-[#1E1048] dark:text-[#EDE9FF] mb-4">{t.about.founderQuote}</h3>
              <p className="text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">{t.about.founderDesc}</p>
            </div>
          </div>
        </motion.div>

        {/* Values Grid */}
        <div className="mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl text-[#1E1048] dark:text-[#EDE9FF]">{t.about.valuesTitle}</h3>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.values.map((value, i) => {
              const Icon = valueIcons[i];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(124,58,237,0.15)' }}
                  className="bg-white dark:bg-[#130D2A] rounded-2xl p-6 border border-purple-50 dark:border-purple-900/20 transition-all duration-300 text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(245,158,11,0.15))' }}>
                    <Icon className="w-7 h-7 text-[#7C3AED] dark:text-[#A78BFA]" />
                  </div>
                  <h4 className="text-[#1E1048] dark:text-[#EDE9FF] font-semibold mb-2">{value.title}</h4>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Achievement Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {t.about.achievementsLabels.map((label, i) => {
            const Icon = achievementIcons[i];
            return (
              <motion.div key={i} whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-white dark:bg-[#130D2A] border border-purple-50 dark:border-purple-900/20 shadow-sm">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl text-[#1E1048] dark:text-[#EDE9FF] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                  {achievementValues[i]}
                </div>
                <div className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">{label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}