import React, { createContext, useState, useEffect, useMemo } from 'react';
import { es } from './locales/es';
import { en } from './locales/en';

type Language = 'es' | 'en';
type Translations = typeof es;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationsMap = { es, en };
const supportedLanguages: Language[] = ['es', 'en'];

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    // 1. Check for a language saved in localStorage
    const storedLang = localStorage.getItem('inks-language') as Language;
    if (storedLang && supportedLanguages.includes(storedLang)) {
      return storedLang;
    }

    // 2. Check the browser's language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (supportedLanguages.includes(browserLang)) {
      return browserLang;
    }
  }
  
  // 3. Fallback to English
  return 'en';
};


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem('inks-language', language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    translations: translationsMap[language],
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};