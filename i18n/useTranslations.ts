import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';

function get(obj: any, path: string, fallback?: string): string {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return fallback !== undefined ? fallback : path;
    }
  }
  return result;
}

export const useTranslations = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }

  const { translations, language, setLanguage } = context;

  const t = (key: string, options?: { fallback?: string, [key: string]: any }): string => {
    let translated = get(translations, key, options?.fallback);

    if (options) {
      Object.keys(options).forEach(optionKey => {
        if (optionKey !== 'fallback') {
          translated = translated.replace(`{{${optionKey}}}`, options[optionKey]);
        }
      });
    }

    return translated;
  };
  
  return { t, language, setLanguage };
};