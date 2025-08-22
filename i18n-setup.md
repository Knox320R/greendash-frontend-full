# Multiple Language Implementation Guide

## Overview
This guide shows how to implement internationalization (i18n) for multiple languages in your React project using `react-i18next`.

## 1. Install Dependencies

```bash
npm install react-i18next i18next i18next-browser-languagedetector i18next-http-backend
```

## 2. Project Structure
```
src/
├── i18n/
│   ├── index.ts              # i18n configuration
│   ├── locales/
│   │   ├── en/
│   │   │   ├── common.json   # Common translations
│   │   │   ├── auth.json     # Authentication translations
│   │   │   ├── dashboard.json # Dashboard translations
│   │   │   └── staking.json  # Staking translations
│   │   ├── es/
│   │   │   ├── common.json
│   │   │   ├── auth.json
│   │   │   ├── dashboard.json
│   │   │   └── staking.json
│   │   └── zh/
│   │       ├── common.json
│   │       ├── auth.json
│   │       ├── dashboard.json
│   │       └── staking.json
│   └── types.ts              # TypeScript types for translations
├── components/
│   └── LanguageSwitcher.tsx  # Language selection component
└── hooks/
    └── useLanguage.ts         # Custom hook for language management
```

## 3. i18n Configuration (src/i18n/index.ts)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    supportedLngs: ['en', 'es', 'zh'],
    
    ns: ['common', 'auth', 'dashboard', 'staking'],
    defaultNS: 'common',
  });

export default i18n;
```

## 4. Translation Files

### English (en/common.json)
```json
{
  "welcome": "Welcome",
  "dashboard": "Dashboard",
  "staking": "Staking",
  "referrals": "Referrals",
  "activity": "Activity",
  "withdrawals": "Withdrawals",
  "overview": "Overview",
  "logout": "Logout",
  "login": "Login",
  "register": "Register",
  "email": "Email",
  "password": "Password",
  "submit": "Submit",
  "cancel": "Cancel",
  "loading": "Loading...",
  "error": "Error",
  "success": "Success",
  "balance": "Balance",
  "amount": "Amount",
  "status": "Status",
  "date": "Date",
  "actions": "Actions"
}
```

### English (en/auth.json)
```json
{
  "loginTitle": "Sign In to Your Account",
  "loginSubtitle": "Enter your credentials to access your account",
  "emailPlaceholder": "Enter your email address",
  "passwordPlaceholder": "Enter your password",
  "forgotPassword": "Forgot Password?",
  "dontHaveAccount": "Don't have an account?",
  "signUp": "Sign Up",
  "registerTitle": "Create New Account",
  "registerSubtitle": "Join us and start your journey",
  "confirmPassword": "Confirm Password",
  "agreeToTerms": "I agree to the terms and conditions",
  "alreadyHaveAccount": "Already have an account?",
  "signIn": "Sign In"
}
```

### English (en/dashboard.json)
```json
{
  "welcomeBack": "Welcome back, {{name}}!",
  "greendashOverview": "Here's your GreenDash overview",
  "egdBalance": "EGD Balance",
  "usdtBalance": "USDT Balance",
  "totalStaked": "Total Staked",
  "activeStaking": "Active Staking",
  "accountStatus": "Account Status",
  "walletConnected": "Wallet Connected",
  "referralCode": "Referral Code",
  "memberSince": "Member Since",
  "totalInvested": "Total Invested",
  "totalEarned": "Total Earned",
  "stakingProgress": "Staking Progress",
  "noActiveStaking": "No active staking package found",
  "startStakingMessage": "Start staking to see your progress"
}
```

### Spanish (es/common.json)
```json
{
  "welcome": "Bienvenido",
  "dashboard": "Panel de Control",
  "staking": "Staking",
  "referrals": "Referidos",
  "activity": "Actividad",
  "withdrawals": "Retiros",
  "overview": "Resumen",
  "logout": "Cerrar Sesión",
  "login": "Iniciar Sesión",
  "register": "Registrarse",
  "email": "Correo Electrónico",
  "password": "Contraseña",
  "submit": "Enviar",
  "cancel": "Cancelar",
  "loading": "Cargando...",
  "error": "Error",
  "success": "Éxito",
  "balance": "Saldo",
  "amount": "Cantidad",
  "status": "Estado",
  "date": "Fecha",
  "actions": "Acciones"
}
```

### Chinese (zh/common.json)
```json
{
  "welcome": "欢迎",
  "dashboard": "仪表板",
  "staking": "质押",
  "referrals": "推荐",
  "activity": "活动",
  "withdrawals": "提款",
  "overview": "概览",
  "logout": "登出",
  "login": "登录",
  "register": "注册",
  "email": "邮箱",
  "password": "密码",
  "submit": "提交",
  "cancel": "取消",
  "loading": "加载中...",
  "error": "错误",
  "success": "成功",
  "balance": "余额",
  "amount": "数量",
  "status": "状态",
  "date": "日期",
  "actions": "操作"
}
```

## 5. TypeScript Types (src/i18n/types.ts)

```typescript
import 'react-i18next';
import common from '../locales/en/common.json';
import auth from '../locales/en/auth.json';
import dashboard from '../locales/en/dashboard.json';
import staking from '../locales/en/staking.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      auth: typeof auth;
      dashboard: typeof dashboard;
      staking: typeof staking;
    };
  }
}

export type SupportedLanguage = 'en' | 'es' | 'zh';

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
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    nativeName: 'Español'
  },
  {
    code: 'zh',
    name: 'Chinese',
    flag: '🇨🇳',
    nativeName: '中文'
  }
];
```

## 6. Language Switcher Component (src/components/LanguageSwitcher.tsx)

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/i18n/types';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (language: SupportedLanguage) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(
    lang => lang.code === i18n.language
  ) || SUPPORTED_LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {currentLanguage.flag} {currentLanguage.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-2 ${
              i18n.language === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.nativeName}</span>
            {i18n.language === language.code && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
```

## 7. Custom Hook (src/hooks/useLanguage.ts)

```typescript
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
```

## 8. Usage in Components

### Basic Translation Usage
```typescript
import { useTranslation } from 'react-i18next';

const DashboardHeader = () => {
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <div>
      <h1>{t('dashboard:welcomeBack', { name: user.name })}</h1>
      <p>{t('dashboard:greendashOverview')}</p>
      <button>{t('common:logout')}</button>
    </div>
  );
};
```

### With Interpolation
```typescript
const StakingCard = () => {
  const { t } = useTranslation('staking');

  return (
    <div>
      <h3>{t('progressTitle')}</h3>
      <p>{t('progressDescription', { 
        current: currentAmount, 
        target: targetAmount 
      })}</p>
    </div>
  );
};
```

### Pluralization
```typescript
const ReferralCount = ({ count }: { count: number }) => {
  const { t } = useTranslation('dashboard');

  return (
    <span>
      {t('referralCount', { count })}
    </span>
  );
};

// In es/dashboard.json:
// "referralCount_one": "{{count}} referido",
// "referralCount_other": "{{count}} referidos"
```

## 9. Integration with Main App

### App.tsx
```typescript
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import './i18n'; // Import i18n configuration
import Loading from '@/components/Loading';

const App = () => {
  return (
    <Provider store={store}>
      <Suspense fallback={<Loading />}>
        <BrowserRouter>
          {/* Your app components */}
        </BrowserRouter>
      </Suspense>
    </Provider>
  );
};

export default App;
```

### Header Component
```typescript
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Logo />
        <Navigation />
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <UserMenu />
      </div>
    </header>
  );
};
```

## 10. Advanced Features

### Date and Number Formatting
```typescript
import { useTranslation } from 'react-i18next';

const FormattedDate = ({ date }: { date: Date }) => {
  const { i18n } = useTranslation();
  
  return (
    <span>
      {date.toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </span>
  );
};
```

### Currency Formatting
```typescript
const FormattedCurrency = ({ amount, currency = 'USD' }: { amount: number; currency?: string }) => {
  const { i18n } = useTranslation();
  
  return (
    <span>
      {amount.toLocaleString(i18n.language, {
        style: 'currency',
        currency
      })}
    </span>
  );
};
```

## 11. Testing

### Test Setup
```typescript
// test/setup.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'auth', 'dashboard'],
  defaultNS: 'common',
  resources: {
    en: {
      common: require('../src/locales/en/common.json'),
      auth: require('../src/locales/en/auth.json'),
      dashboard: require('../src/locales/en/dashboard.json'),
    }
  }
});
```

## 12. Build Configuration

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
```

## Benefits of This Implementation

1. **Type Safety**: Full TypeScript support for translations
2. **Performance**: Lazy loading of translation files
3. **Flexibility**: Easy to add new languages and namespaces
4. **User Experience**: Language preference is remembered
5. **Maintainability**: Organized translation files by feature
6. **Accessibility**: Support for RTL languages and cultural formatting
7. **SEO**: Proper language tags for search engines

This implementation provides a robust, scalable solution for multiple language support in your React application. 