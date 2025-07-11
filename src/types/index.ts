export interface ReadingData {
  date: string;
  day: string;
  Mass_R1: { source: string; text: string };
  Mass_Ps: { source: string; text: string };
  Mass_R2?: { source: string; text: string };
  Mass_GA: { source: string; text: string };
  Mass_G: { source: string; text: string };
  copyright: { text: string };
}

export interface Saint {
  name: string;
  feast: string;
  biography: string;
  image?: string;
}

export interface Homily {
  content: string;
  language: string;
  generatedAt: Date;
}

export type Language = 'en' | 'es' | 'fr' | 'la' | 'pt' | 'de';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}