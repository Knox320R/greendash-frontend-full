import 'react-i18next';

// Import English translations as the base type
import common from '../../public/locales/en/common.json';
import home from '../../public/locales/en/home.json';
import auth from '../../public/locales/en/auth.json';
import dashboard from '../../public/locales/en/dashboard.json';
import staking from '../../public/locales/en/staking.json';
import affiliates from '../../public/locales/en/affiliates.json';
import profile from '../../public/locales/en/profile.json';
import register from '../../public/locales/en/register.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      home: typeof home;
      auth: typeof auth;
      dashboard: typeof dashboard;
      staking: typeof staking;
      affiliates: typeof affiliates;
      profile: typeof profile;
      register: typeof register;
    };
  }
}

export type SupportedLanguage = 'en' | 'vi' | 'pt' | 'zh';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  flag: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    flag: '🇻🇳',
    nativeName: 'Tiếng Việt'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    flag: '🇵🇹',
    nativeName: 'Português'
  },
  {
    code: 'zh',
    name: 'Chinese',
    flag: '🇨🇳',
    nativeName: '中文'
  }
]; 