import { useState, useEffect } from 'react';
import { Language } from '../types';
import { translationService } from '../services/translationService';

interface TranslationHook {
  t: (key: string) => string;
  isLoading: boolean;
  currentLanguage: Language;
}

export function useTranslation(language: Language): TranslationHook {
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTranslations();
  }, [language]);

  const loadTranslations = async () => {
    if (language === 'en') {
      setTranslations({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const translatedElements = await translationService.translateUIElements(language);
      setTranslations(translatedElements);
    } catch (error) {
      console.error('Failed to load translations:', error);
      setTranslations({});
    } finally {
      setIsLoading(false);
    }
  };

  const t = (key: string): string => {
    if (language === 'en') {
      return translationService['getEnglishUIElements']()[key] || key;
    }
    return translations[key] || translationService['getEnglishUIElements']()[key] || key;
  };

  return {
    t,
    isLoading,
    currentLanguage: language
  };
}