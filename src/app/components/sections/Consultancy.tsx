import { useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, Star, Zap, Shield, Clock, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { apiFetch } from '../../context/AuthContext';

const CONSULTANCY_BG = 'https://images.unsplash.com/photo-1769406525627-badf92979131?w=1200&q=80';

const benefitIcons = [Star, Shield, Zap, Clock];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  country: string;
  preferredTime: string;
  message: string;
}

export default function Consultancy() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    try {
      const res = await apiFetch('/consultancy', '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.error) throw new Error(res.error);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err: unknown) {
      console.log('Consultancy submit error:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    }
  };

  return (
    <section id="consultancy" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${CONSULTANCY_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,3,18,0.95) 0%, rgba(30,16,72,0.92) 50%, rgba(6,3,18,0.95) 100%)' }} />
      </div>

      {/* Decorative orbs */}
      <motion.div className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl z-[1] opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl z-[1] opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }} />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-amber-400 text-sm uppercase tracking-[0.3em] font-medium">{t.consultancy.tagline}</span>
          <h2 className="text-4xl md:text-6xl text-white mt-3 mb-6">
            {t.consultancy.headingPre} <em className="italic" style={{ background: 'linear-gradient(135deg, #C4B5FD, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {t.consultancy.headingHighlight}
            </em>
          </h2>
          <p className="text-purple-200/70 max-w-xl mx-auto">{t.consultancy.desc}</p>
          <div className="w-16 h-1 mx-auto rounded-full mt-6" style={{ background: 'linear-gradient(90deg, #7C3AED, #F59E0B)' }} />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Info Panel */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.consultancy.whatToExpect}</h3>
              <p className="text-purple-200/70 leading-relaxed mb-6">{t.consultancy.sessionDesc}</p>
              <div className="space-y-4">
                {t.consultancy.benefits.map((text, i) => {
                  const Icon = benefitIcons[i];
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-purple-200/80">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.25)' }}>
                        <Icon className="w-4 h-4 text-purple-300" />
                      </div>
                      {text}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Services offered */}
            <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <h4 className="text-white font-medium mb-4">{t.consultancy.ourServices}</h4>
              <div className="space-y-2">
                {t.consultancy.servicesList.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-purple-200/70 text-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick contact */}
            <div className="space-y-3">
              <a href="tel:+919987487242" className="flex items-center gap-3 text-purple-200/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/15 group-hover:border-white/30 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Phone className="w-4 h-4" />
                </div>
                <span>+91 99874 87242</span>
              </a>
              <a href="mailto:vyanasoul369@vyanasoul.com" className="flex items-center gap-3 text-purple-200/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/15 group-hover:border-white/30 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Mail className="w-4 h-4" />
                </div>
                <span>vyanasoul369@vyanasoul.com</span>
              </a>
              <a href="mailto:vyanasoul369@gmail.com" className="flex items-center gap-3 text-purple-200/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/15 group-hover:border-white/30 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Mail className="w-4 h-4" />
                </div>
                <span>vyanasoul369@gmail.com</span>
              </a>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-3">
            <div className="rounded-3xl p-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #10B981)' }}>
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl text-white mb-3">{t.consultancy.successTitle}</h3>
                  <p className="text-purple-200/70">{t.consultancy.successDesc}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <h3 className="text-xl text-white mb-6 font-medium">{t.consultancy.formTitle}</h3>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-purple-200/80 text-sm mb-1.5 block">{t.consultancy.labelFullName}</label>
                      <input {...register('fullName', { required: t.consultancy.validationName, minLength: { value: 2, message: t.consultancy.validationNameShort } })}
                        className="w-full px-4 py-3 rounded-xl border text-white placeholder-white/30 text-sm transition-all duration-200 focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.07)', borderColor: errors.fullName ? '#EF4444' : 'rgba(255,255,255,0.15)' }}
                        placeholder={t.consultancy.placeholderFullName} />
                      {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className="text-purple-200/80 text-sm mb-1.5 block">{t.consultancy.labelEmail}</label>
                      <input {...register('email', { required: t.consultancy.validationEmail, pattern: { value: /^\S+@\S+\.\S+$/, message: t.consultancy.validationEmailInvalid } })}
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border text-white placeholder-white/30 text-sm transition-all duration-200 focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.07)', borderColor: errors.email ? '#EF4444' : 'rgba(255,255,255,0.15)' }}
                        placeholder={t.consultancy.placeholderEmail} />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-purple-200/80 text-sm mb-1.5 block">{t.consultancy.labelPhone}</label>
                      <input {...register('phone')} type="tel"
                        className="w-full px-4 py-3 rounded-xl border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                        placeholder="+91 99874 87242" />
                    </div>
                    <div>
                      <label className="text-purple-200/80 text-sm mb-1.5 block">{t.consultancy.labelService}</label>
                      <select {...register('service', { required: t.consultancy.validationService })}
                        className="w-full px-4 py-3 rounded-xl border text-white text-sm focus:outline-none appearance-none"
                        style={{ background: 'rgba(30,16,72,0.8)', borderColor: errors.service ? '#EF4444' : 'rgba(255,255,255,0.15)' }}>
                        <option value="" style={{ background: '#1E1048' }}>{t.consultancy.selectService}</option>
                        {t.consultancy.services.map(s => (
                          <option key={s.id} value={s.id} style={{ background: '#1E1048' }}>{s.label}</option>
                        ))}
                      </select>
                      {errors.service && <p className="text-red-400 text-xs mt-1">{errors.service.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-purple-200/80 text-sm mb-1.5 block">Country</label>
                      <select {...register('country')}
                        className="w-full px-4 py-3 rounded-xl border border-white/15 text-white text-sm focus:outline-none appearance-none"
                        style={{ background: 'rgba(30,16,72,0.8)' }}>
                        {['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Other'].map(c => (
                          <option key={c} value={c} style={{ background: '#1E1048' }}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-purple-200/80 text-sm mb-1.5 block">{t.consultancy.labelTime}</label>
                      <select {...register('preferredTime')}
                        className="w-full px-4 py-3 rounded-xl border border-white/15 text-white text-sm focus:outline-none appearance-none"
                        style={{ background: 'rgba(30,16,72,0.8)' }}>
                        <option value="" style={{ background: '#1E1048' }}>{t.consultancy.selectTime}</option>
                        {['2:00 PM – 3:00 PM', '3:00 PM – 4:00 PM', '4:00 PM – 5:00 PM', '5:00 PM – 6:00 PM', '6:00 PM – 7:00 PM', '7:00 PM – 8:00 PM', '8:00 PM – 9:00 PM'].map(slot => (
                          <option key={slot} value={slot} style={{ background: '#1E1048' }}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-purple-200/80 text-sm mb-1.5 block">{t.consultancy.labelMessage}</label>
                    <textarea {...register('message')} rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none resize-none"
                      style={{ background: 'rgba(255,255,255,0.07)' }}
                      placeholder={t.consultancy.placeholderMessage} />
                  </div>

                  <motion.button type="submit" disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 0 30px rgba(124,58,237,0.5)' } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70"
                    style={{ background: isSubmitting ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
                    {isSubmitting ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        {t.consultancy.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t.consultancy.submitBtn}
                      </>
                    )}
                  </motion.button>
                  {submitError && <div className="text-red-400 text-sm text-center mt-2 p-2 bg-red-400/10 rounded-lg">{submitError}</div>}

                  <p className="text-purple-300/50 text-xs text-center">{t.consultancy.confidentialNote}</p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
