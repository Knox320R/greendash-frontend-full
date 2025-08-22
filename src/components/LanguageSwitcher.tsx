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