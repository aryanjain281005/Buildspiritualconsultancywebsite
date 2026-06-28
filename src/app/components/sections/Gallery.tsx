import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, Camera } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useLanguage } from '../../context/LanguageContext';
import practiceImg from '../../../imports/image-4.png';
import podcastImg from '../../../imports/image-5.png';
import podcast2Img from '../../../imports/image-7.png';
import healingImg from '../../../imports/image-8.png';
import healing2Img from '../../../imports/image-2.png';
import practice2Img from '../../../imports/image-9.png';
import spiritualImg from '../../../imports/image-11.png';
import practice3Img from '../../../imports/image-17.png';

const galleryItems = [
  { id: 1, src: practiceImg, title: 'Meditation in Nature', category: 'Practice' },
  { id: 2, src: podcastImg, title: 'Podcast Session', category: 'Podcast' },
  { id: 3, src: podcast2Img, title: 'Podcast Session', category: 'Podcast' },
  { id: 4, src: healingImg, title: 'Healing Session', category: 'Healing' },
  { id: 5, src: healing2Img, title: 'Reading Session', category: 'Reading' },
  { id: 6, src: practice2Img, title: 'Spiritual Practice', category: 'Practice' },
  { id: 7, src: spiritualImg, title: 'Spiritual Journey', category: 'Spiritual' },
  { id: 8, src: practice3Img, title: 'Spiritual Practice', category: 'Practice' },
];

const allCategories = ['All', 'Practice', 'Healing', 'Reading', 'Spiritual', 'Podcast'];

export default function Gallery() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<any>(null);
  const [dbImages, setDbImages] = useState<any[]>([]);

  // Fetch images from API
  useEffect(() => {
    fetch('https://xvdoutqezjsuogankqna.supabase.co/functions/v1/make-server-d03e957c/gallery')
      .then(res => res.json())
      .then(data => {
        if (data && data.images && data.images.length > 0) {
          const formatted = data.images.map((img: any) => ({
            id: img.id,
            src: img.image_url,
            title: img.title || 'Gallery Image',
            category: img.category || 'Practice'
          }));
          setDbImages(formatted);
        }
      })
      .catch(err => console.error("Error fetching gallery:", err));
  }, []);

  const displayItems = dbImages.length > 0 ? dbImages : galleryItems;
  const filtered = activeCategory === 'All' ? displayItems : displayItems.filter(img => img.category === activeCategory);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-[#FAF8FF] dark:bg-[#0B0720] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)' }} />
      <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)' }} />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <Camera className="w-4 h-4 text-[#B45309] dark:text-[#F59E0B]" />
            <span className="text-[#B45309] dark:text-[#F59E0B] text-sm uppercase tracking-[0.3em] font-medium">{t.gallery.tagline}</span>
          </div>
          <h2 className="text-4xl md:text-6xl text-[#1E1048] dark:text-[#EDE9FF] mb-6">
            {t.gallery.heading} <em className="italic text-[#7C3AED] dark:text-[#A78BFA]">{t.gallery.headingItalic}</em>
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-xl mx-auto">{t.gallery.desc}</p>
          <div className="w-16 h-1 mx-auto rounded-full mt-6" style={{ background: 'linear-gradient(90deg, #7C3AED, #F59E0B)' }} />
        </motion.div>

        {/* Category Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12">
          {allCategories.map(cat => (
            <motion.button key={cat} onClick={() => setActiveCategory(cat)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={activeCategory === cat ? { background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: 'white', boxShadow: '0 4px 15px rgba(124,58,237,0.35)' } : {}}>
              <span className={activeCategory !== cat ? 'text-[#6B7280] dark:text-[#9CA3AF]' : ''}>
                {t.gallery.categoryLabels[cat as keyof typeof t.gallery.categoryLabels] || cat}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }} gutterBreakpoints={{ 350: '12px', 640: '16px', 1024: '16px' }}>
              <Masonry>
                {filtered.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="relative group cursor-pointer rounded-2xl overflow-hidden" onClick={() => setLightboxImg(item)} whileHover={{ y: -4 }}>
                    <img src={item.src} alt={item.title} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col items-center justify-center"
                      style={{ background: 'linear-gradient(to top, rgba(6,3,18,0.9) 0%, rgba(124,58,237,0.4) 100%)' }}>
                      <motion.div initial={{ scale: 0.5, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }}
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                        style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                        <ZoomIn className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="text-white font-medium text-center px-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>{item.title}</div>
                      <div className="text-purple-300 text-xs mt-1 uppercase tracking-wide">
                        {t.gallery.categoryLabels[item.category as keyof typeof t.gallery.categoryLabels] || item.category}
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'rgba(124,58,237,0.8)', backdropFilter: 'blur(4px)' }}>
                      {t.gallery.categoryLabels[item.category as keyof typeof t.gallery.categoryLabels] || item.category}
                    </div>
                  </motion.div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#6B7280] dark:text-[#9CA3AF]">{t.gallery.empty}</div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(6,3,18,0.95)', backdropFilter: 'blur(12px)' }}
            onClick={() => setLightboxImg(null)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              <img src={lightboxImg.src} alt={lightboxImg.title} className="w-full rounded-2xl object-cover max-h-[80vh]" />
              <div className="absolute bottom-0 left-0 right-0 p-6 rounded-b-2xl" style={{ background: 'linear-gradient(to top, rgba(6,3,18,0.9) 0%, transparent 100%)' }}>
                <h3 className="text-white text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{lightboxImg.title}</h3>
                <span className="text-purple-300 text-sm uppercase tracking-wide">
                  {t.gallery.categoryLabels[lightboxImg.category as keyof typeof t.gallery.categoryLabels] || lightboxImg.category}
                </span>
              </div>
              <button onClick={() => setLightboxImg(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
