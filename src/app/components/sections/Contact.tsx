import { useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Phone, Mail, MapPin, Instagram, MessageCircle, Send, CheckCircle, Clock, Globe, Facebook } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const contactIcons = [Phone, Mail, Instagram, Facebook, MapPin];
const contactColors = ['from-green-500 to-emerald-600', 'from-blue-500 to-indigo-600', 'from-pink-500 to-purple-600', 'from-blue-600 to-blue-800', 'from-amber-500 to-orange-500'];
const contactHrefs = ['tel:+919987487242', 'mailto:vyanasoul369@vyanasoul.com', 'https://www.instagram.com/vyana_soul369/', 'https://www.facebook.com/people/Vyana-Soul/61586396214113/', '#'];
const contactValues = ['+91 99874 87242', 'vyanasoul369@vyanasoul.com', '@vyana_soul369', 'Vyana Soul', 'Sauhard, C 903, Fressia Ranibello,\nMalad East, Mumbai — 400097'];

export default function Contact() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Contact form submitted:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-white dark:bg-[#060312] relative overflow-hidden">
      <div className="absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(124,58,237,0.07) 0%, transparent 60%)' }} />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[#B45309] dark:text-[#F59E0B] text-sm uppercase tracking-[0.3em] font-medium">{t.contact.tagline}</span>
          <h2 className="text-4xl md:text-6xl text-[#1E1048] dark:text-[#EDE9FF] mt-3 mb-6">
            {t.contact.heading} <em className="italic text-[#7C3AED] dark:text-[#A78BFA]">{t.contact.headingItalic}</em>
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-xl mx-auto">{t.contact.desc}</p>
          <div className="w-16 h-1 mx-auto rounded-full mt-6" style={{ background: 'linear-gradient(90deg, #7C3AED, #F59E0B)' }} />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Info */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {t.contact.contactLabels.map((label, i) => {
                const Icon = contactIcons[i];
                return (
                  <motion.a key={i} href={contactHrefs[i]} target={contactHrefs[i].startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 6, boxShadow: '0 8px 25px rgba(124,58,237,0.12)' }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#0E0825] border border-purple-50 dark:border-purple-900/20 transition-all duration-300 group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${contactColors[i]} shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[#9CA3AF] text-xs uppercase tracking-wide mb-0.5">{label}</div>
                      <div className="text-[#1E1048] dark:text-[#EDE9FF] text-sm font-medium group-hover:text-[#7C3AED] dark:group-hover:text-[#A78BFA] transition-colors whitespace-pre-line">
                        {contactValues[i]}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Session Hours */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-white dark:bg-[#0E0825] border border-purple-50 dark:border-purple-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
                <h4 className="text-[#1E1048] dark:text-[#EDE9FF] font-medium text-sm">{t.contact.hoursTitle}</h4>
              </div>
              <div className="space-y-2">
                {t.contact.hours.map((h, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#6B7280] dark:text-[#9CA3AF]">{h.day}</span>
                    <span className="text-[#1E1048] dark:text-[#EDE9FF] font-medium">{h.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Global service note */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="p-5 rounded-2xl border border-[#7C3AED]/15"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(245,158,11,0.05) 100%)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
                <span className="text-[#1E1048] dark:text-[#EDE9FF] text-sm font-medium">{t.contact.globalTitle}</span>
              </div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs leading-relaxed">{t.contact.globalDesc}</p>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.a href="https://wa.me/919987487242" target="_blank" rel="noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(37,211,102,0.35)' }}
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl text-white font-medium text-sm"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
              <MessageCircle className="w-5 h-5" />
              {t.contact.whatsappCTA}
            </motion.a>
          </motion.div>

          {/* Right Form */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-3">
            <div className="bg-white dark:bg-[#0E0825] rounded-3xl p-8 border border-purple-50 dark:border-purple-900/20 shadow-sm">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #7C3AED, #10B981)' }}>
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl text-[#1E1048] dark:text-[#EDE9FF] mb-3">{t.contact.successTitle}</h3>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF]">{t.contact.successDesc}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <h3 className="text-xl text-[#1E1048] dark:text-[#EDE9FF] mb-2 font-medium">{t.contact.formTitle}</h3>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-6">{t.contact.formSubtitle}</p>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[#4B5563] dark:text-[#9CA3AF] text-sm mb-1.5 block">{t.contact.labelName}</label>
                      <input {...register('name', { required: t.contact.validationName })}
                        className="w-full px-4 py-3 rounded-xl border text-[#1E1048] dark:text-[#EDE9FF] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 bg-[#F9F7FF] dark:bg-[#0E0825]"
                        style={{ borderColor: errors.name ? '#EF4444' : 'rgba(124,58,237,0.15)' }}
                        placeholder={t.contact.placeholderName} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-[#4B5563] dark:text-[#9CA3AF] text-sm mb-1.5 block">{t.contact.labelEmail}</label>
                      <input {...register('email', { required: t.contact.validationEmail, pattern: { value: /^\S+@\S+\.\S+$/, message: t.contact.validationEmailInvalid } })}
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border text-[#1E1048] dark:text-[#EDE9FF] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 bg-[#F9F7FF] dark:bg-[#0E0825]"
                        style={{ borderColor: errors.email ? '#EF4444' : 'rgba(124,58,237,0.15)' }}
                        placeholder={t.contact.placeholderEmail} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[#4B5563] dark:text-[#9CA3AF] text-sm mb-1.5 block">{t.contact.labelSubject}</label>
                    <input {...register('subject', { required: t.contact.validationSubject })}
                      className="w-full px-4 py-3 rounded-xl border text-[#1E1048] dark:text-[#EDE9FF] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 bg-[#F9F7FF] dark:bg-[#0E0825]"
                      style={{ borderColor: errors.subject ? '#EF4444' : 'rgba(124,58,237,0.15)' }}
                      placeholder={t.contact.placeholderSubject} />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="text-[#4B5563] dark:text-[#9CA3AF] text-sm mb-1.5 block">{t.contact.labelMessage}</label>
                    <textarea {...register('message', { required: t.contact.validationMessage, minLength: { value: 20, message: t.contact.validationMessageShort } })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border text-[#1E1048] dark:text-[#EDE9FF] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 resize-none bg-[#F9F7FF] dark:bg-[#0E0825]"
                      style={{ borderColor: errors.message ? '#EF4444' : 'rgba(124,58,237,0.15)' }}
                      placeholder={t.contact.placeholderMessage} />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <motion.button type="submit" disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 8px 25px rgba(124,58,237,0.35)' } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-300"
                    style={{ background: isSubmitting ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
                    {isSubmitting ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        {t.contact.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t.contact.submitBtn}
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}