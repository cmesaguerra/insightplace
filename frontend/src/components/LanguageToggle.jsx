import React from 'react';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

export const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <Button
        variant={language === 'es' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('es')}
        className="px-3 py-1 text-sm"
      >
        ES
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="px-3 py-1 text-sm"
      >
        EN
      </Button>
    </div>
  );
};