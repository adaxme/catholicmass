import { Language, LanguageOption } from '../types';

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'la', name: 'Latin', flag: '🇻🇦' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export function getLanguageName(code: Language): string {
  return languages.find(lang => lang.code === code)?.name || 'English';
}