import React from 'react';
import { Globe } from 'lucide-react';
import { Language, LanguageOption } from '../types';
import { languages } from '../utils/languages';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-slate-600">
      <Globe className="w-5 h-5 text-amber-400" />
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="bg-transparent border-none focus:outline-none focus:ring-0 font-medium text-slate-200"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}