import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations } from '../data/translations';

export type Lang = 'en' | 'hi';
export type Translations = typeof translations;
export type TranslationSet = Translations[keyof Translations];

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
  isHindi: boolean;
  t: TranslationSet;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
  setLang: () => {},
  isHindi: false,
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('vyana-lang');
      if (saved === 'en' || saved === 'hi') return saved;
    } catch {}
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('vyana-lang', lang);
    } catch {}
    document.documentElement.classList.toggle('lang-hi', lang === 'hi');
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState(l => (l === 'en' ? 'hi' : 'en'));

  const value = useMemo<LanguageContextType>(
    () => ({
      lang,
      toggleLang,
      setLang,
      isHindi: lang === 'hi',
      t: translations[lang] as TranslationSet,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
