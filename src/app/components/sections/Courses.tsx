import { motion } from 'motion/react';
import { Clock, BarChart3, CheckCircle2, Flame, ArrowRight } from 'lucide-react';
import { courses } from '../../data/courses';
import { useLanguage } from '../../context/LanguageContext';

const levelColorMap: Record<string, string> = {
  'Beginner': 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  'Intermediate': 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  'Advanced': 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  'All Levels': 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
};

export default function Courses() {
  const { t, lang } = useLanguage();

  const scrollToBooking = () => {
    const el = document.getElementById('consultancy');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Merge base course data (price, color, emoji, popular) with translated overrides
  const localizedCourses = courses.map(course => {
    const override = t.courses.coursesData.find(c => c.id === course.id);
    return { ...course, ...override };
  });

  return (
    <section id="courses" className="py-24 md:py-32 bg-white dark:bg-[#060312] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 dark:opacity-10"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 60%)' }} />
      <div className="absolute top-32 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-20">
          <span className="text-[#B45309] dark:text-[#F59E0B] text-sm uppercase tracking-[0.3em] font-medium">{t.courses.tagline}</span>
          <h2 className="text-4xl md:text-6xl text-[#1E1048] dark:text-[#EDE9FF] mt-3 mb-6">
            {t.courses.heading} <em className="italic text-[#7C3AED] dark:text-[#A78BFA]">{t.courses.headingItalic}</em> {t.courses.headingSuffix}
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">{t.courses.desc}</p>
          <div className="w-16 h-1 mx-auto rounded-full mt-6" style={{ background: 'linear-gradient(90deg, #7C3AED, #F59E0B)' }} />
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {localizedCourses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative bg-white dark:bg-[#0E0825] rounded-3xl overflow-hidden border border-purple-50 dark:border-purple-900/20 shadow-sm hover:shadow-2xl transition-all duration-400 flex flex-col">
              <div className={`h-1.5 w-full bg-gradient-to-r ${course.color}`} />
              {course.popular && (
                <div className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
                  <Flame className="w-3 h-3" />
                  {t.courses.mostPopular}
                </div>
              )}
              {/* Coming Soon overlay */}
              <div className="absolute inset-0 z-20 rounded-3xl flex flex-col items-center justify-center"
                style={{ background: 'rgba(6,3,18,0.72)', backdropFilter: 'blur(2px)' }}>
                <div className="px-5 py-2.5 rounded-full text-white text-sm font-semibold border border-amber-400/60"
                  style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(124,58,237,0.25))' }}>
                  ✨ {lang === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon'}
                </div>
                <p className="text-white/50 text-xs mt-2">{lang === 'hi' ? 'जल्द उपलब्ध होगा' : 'Enrollments opening shortly'}</p>
              </div>
              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${course.color} shadow-lg`}>
                    {course.emoji}
                  </div>
                  <div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${levelColorMap[courses.find(c => c.id === course.id)?.level || 'Beginner']}`}>
                      {course.level}
                    </span>
                    <div className="text-[#6B7280] dark:text-[#9CA3AF] text-xs mt-1">{course.category}</div>
                  </div>
                </div>
                <h3 className="text-xl text-[#1E1048] dark:text-[#EDE9FF] mb-3 leading-tight">{course.title}</h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed mb-5 flex-1">{course.description}</p>
                <div className="flex items-center gap-4 mb-5 py-4 border-y border-purple-50 dark:border-purple-900/20">
                  <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#9CA3AF] text-sm">
                    <Clock className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#9CA3AF] text-sm">
                    <BarChart3 className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
                    {course.level}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-6">
                  {(course.features as string[]).slice(0, 4).map((feature, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[#1E1048] dark:text-[#EDE9FF]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {courses.find(c => c.id === course.id)?.price}
                    </div>
                    {courses.find(c => c.id === course.id)?.originalPrice && (
                      <div className="text-[#9CA3AF] text-xs line-through">{courses.find(c => c.id === course.id)?.originalPrice}</div>
                    )}
                  </div>
                  <motion.button whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.97 }} onClick={scrollToBooking}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium bg-gradient-to-r ${course.color} transition-all duration-300`}>
                    {t.courses.enrollNow}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mt-16 p-10 rounded-3xl border border-[#7C3AED]/15 dark:border-[#7C3AED]/20"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(245,158,11,0.05) 100%)' }}>
          <h3 className="text-2xl md:text-3xl text-[#1E1048] dark:text-[#EDE9FF] mb-3">{t.courses.notSureHeading}</h3>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6 max-w-xl mx-auto">{t.courses.notSureDesc}</p>
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(124,58,237,0.35)' }} whileTap={{ scale: 0.97 }} onClick={scrollToBooking}
            className="px-8 py-3.5 rounded-full text-white font-medium text-sm inline-flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
            {t.courses.freeCTA}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}