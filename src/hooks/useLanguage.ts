import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { SupportedLanguage } from '@/i18n/types';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = useCallback((language: SupportedLanguage) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
  }, [i18n]);

  const getCurrentLanguage = useCallback(() => {
    return i18n.language as SupportedLanguage;
  }, [i18n.language]);

  const isLanguage = useCallback((language: SupportedLanguage) => {
    return i18n.language === language;
  }, [i18n.language]);

  return {
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    isLanguage,
    t,
    i18n
  };
}; 