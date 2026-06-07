import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Instagram, MessageCircle, Mail, Phone,
  MapPin, Heart, ArrowRight, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../../imports/image-6.png';

const quickLinks = [
  { label: 'Home', id: 'home' },
  { label: 'About Us', id: 'about' },
  { label: 'Courses', id: 'courses' },
  { label: 'Consultancy', id: 'consultancy' },
  { label: 'Gallery', id: 'gallery' },
];

const coursesList = [
  'Akashic Foundation Course',
  'Intermediate Reading Mastery',
  'Advanced Soul Mapping',
  'Healing & Energy Clearance',
  'Past Life Regression',
  'Channel Opening Course',
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer() {
  const { t, lang } = useLanguage();

  const quickLinkLabels: Record<string, { en: string; hi: string }> = {
    home: { en: 'Home', hi: 'होम' },
    about: { en: 'About Us', hi: 'हमारे बारे में' },
    courses: { en: 'Courses', hi: 'कोर्स' },
    consultancy: { en: 'Consultancy', hi: 'परामर्श' },
    gallery: { en: 'Gallery', hi: 'गैलरी' },
  };

  const courseListHi = [
    'आकाशिक फाउंडेशन कोर्स',
    'इंटरमीडिएट रीडिंग मास्टरी',
    'एडवांस्ड सोल मैपिंग',
    'हीलिंग और एनर्जी क्लियरेंस',
    'पास्ट लाइफ रिग्रेशन',
    'चैनल ओपनिंग कोर्स',
  ];

  const social = [
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/vyana_soul369/', color: '#E1306C' },
    { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/919987487242', color: '#25D366' },
    { icon: Mail, label: 'Email', href: 'mailto:vyanasoul369@vyanasoul.com', color: '#7C3AED' },
  ];

  const displayCourses = lang === 'hi' ? courseListHi : coursesList;

  return (
    <footer className="bg-[#06030F] dark:bg-[#04020B] relative overflow-hidden">
      {/* Top decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(245,158,11,0.5), transparent)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)' }} />
      <div className="absolute top-20 right-20 w-64 h-64 opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />

      {/* Newsletter Banner */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(245,158,11,0.1) 100%)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div>
              <h3 className="text-2xl text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.footer.newsletterTitle}</h3>
              <p className="text-purple-300/70 text-sm">{t.footer.newsletterDesc}</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto md:min-w-80">
              <input type="email" placeholder={t.footer.emailPlaceholder}
                className="flex-1 px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none border border-white/15"
                style={{ background: 'rgba(255,255,255,0.07)' }} />
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.97 }}
                className="px-5 py-3 rounded-xl text-white flex-shrink-0 flex items-center gap-1.5 text-sm font-medium"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
                {t.footer.subscribeCTA}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <img
                src={logoImg}
                alt="Vyana Soul"
                className="h-20 w-auto object-contain"
                style={{ mixBlendMode: 'screen' }}
              />
            </div>
            <p className="text-purple-300/60 text-sm leading-relaxed mb-6">{t.footer.brandDesc}</p>
            <div className="flex gap-3">
              {social.map((s) => (
                <motion.a key={s.label} href={s.href} target="_blank" rel="noreferrer" whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)' }} aria-label={s.label}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-5 text-sm uppercase tracking-wider">{t.footer.quickLinks}</h4>
            <ul className="space-y-2.5">
              {quickLinks.slice(0, 5).map((link) => (
                <li key={link.id}>
                  <button onClick={() => scrollToSection(link.id)}
                    className="text-purple-300/60 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-purple-500/50 group-hover:bg-purple-400 transition-colors" />
                    {lang === 'hi' ? quickLinkLabels[link.id]?.hi : quickLinkLabels[link.id]?.en}
                  </button>
                </li>
              ))}
              <li>
                <Link to="/blog" className="text-purple-300/60 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-purple-500/50 group-hover:bg-purple-400 transition-colors" />
                  {lang === 'hi' ? 'ब्लॉग और लेख' : 'Blog & Articles'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-medium mb-5 text-sm uppercase tracking-wider">{t.footer.ourCourses}</h4>
            <ul className="space-y-2.5">
              {displayCourses.map((course) => (
                <li key={course}>
                  <button onClick={() => scrollToSection('courses')}
                    className="text-purple-300/60 hover:text-white text-sm transition-colors duration-200 text-left flex items-start gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-amber-500/50 group-hover:bg-amber-400 transition-colors mt-2 flex-shrink-0" />
                    {course}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-5 text-sm uppercase tracking-wider">{t.footer.contactUs}</h4>
            <div className="space-y-4">
              <a href="tel:+919987487242" className="flex items-center gap-3 text-purple-300/60 hover:text-white text-sm transition-colors group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-white/20 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Phone className="w-3.5 h-3.5 text-green-400" />
                </div>
                +91 99874 87242
              </a>
              <a href="mailto:vyanasoul369@vyanasoul.com" className="flex items-center gap-3 text-purple-300/60 hover:text-white text-sm transition-colors group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-white/20 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                </div>
                vyanasoul369@vyanasoul.com
              </a>
              <div className="flex items-start gap-3 text-purple-300/60 text-sm">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span>Sauhard, C 903, Fressia Ranibello,<br />Malad East, Mumbai — 400097<br /><span className="text-xs opacity-70">{lang === 'hi' ? 'विश्वव्यापी सत्र उपलब्ध' : 'Sessions Available Worldwide'}</span></span>
              </div>
              <a href="https://www.instagram.com/vyana_soul369/" target="_blank" rel="noreferrer"
                className="flex items-center gap-3 text-purple-300/60 hover:text-white text-sm transition-colors group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-white/20 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <span className="flex items-center gap-1">@vyana_soul369 <ExternalLink className="w-3 h-3 opacity-50" /></span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)' }} />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-purple-300/40 text-xs text-center sm:text-left">{t.footer.copyright}</p>
          <div className="flex items-center gap-1 text-purple-300/40 text-xs">
            {t.footer.madeWith} <Heart className="w-3 h-3 text-rose-500 mx-0.5 fill-rose-500" />
          </div>
          <div className="flex gap-4">
            <span className="text-purple-300/40 text-xs hover:text-purple-300/70 cursor-pointer transition-colors">{t.footer.privacy}</span>
            <span className="text-purple-300/40 text-xs hover:text-purple-300/70 cursor-pointer transition-colors">{t.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}