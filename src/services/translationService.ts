import { geminiService } from './geminiService';
import { Language } from '../types';

interface TranslationCache {
  [key: string]: { [lang: string]: string };
}

interface UIElementsCache {
  [lang: string]: { [key: string]: string };
}

class TranslationService {
  private cache: TranslationCache = {};
  private uiElementsCache: UIElementsCache = {};
  private currentLanguage: Language = 'en';

  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  async translateText(text: string, targetLanguage: Language): Promise<string> {
    if (targetLanguage === 'en') return text;
    
    const cacheKey = text.toLowerCase().trim();
    
    // Check cache first
    if (this.cache[cacheKey] && this.cache[cacheKey][targetLanguage]) {
      return this.cache[cacheKey][targetLanguage];
    }

    try {
      const translated = await geminiService.translateText(text, targetLanguage);
      
      // Cache the translation
      if (!this.cache[cacheKey]) {
        this.cache[cacheKey] = {};
      }
      this.cache[cacheKey][targetLanguage] = translated;
      
      return translated;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Return original text if translation fails
    }
  }

  async translateUIElements(targetLanguage: Language): Promise<{ [key: string]: string }> {
    if (targetLanguage === 'en') {
      return this.getEnglishUIElements();
    }

    // Check if UI elements for this language are already cached
    if (this.uiElementsCache[targetLanguage]) {
      return this.uiElementsCache[targetLanguage];
    }

    const englishElements = this.getEnglishUIElements();
    const translatedElements: { [key: string]: string } = {};

    // Translate all UI elements
    for (const [key, text] of Object.entries(englishElements)) {
      try {
        translatedElements[key] = await this.translateText(text, targetLanguage);
      } catch (error) {
        console.error(`Failed to translate ${key}:`, error);
        translatedElements[key] = text; // Fallback to English
      }
    }

    // Cache the complete set of translated UI elements
    this.uiElementsCache[targetLanguage] = translatedElements;

    return translatedElements;
  }

  private getEnglishUIElements(): { [key: string]: string } {
    return {
      // Header
      appTitle: 'Daily Mass Companion',
      appSubtitle: 'Readings • Saints • AI Homilies',
      
      // Readings Section
      dailyMassReadings: 'Daily Mass Readings',
      loadingReadings: 'Loading today\'s readings...',
      unableToLoadReadings: 'Unable to Load Readings',
      tryAgain: 'Try Again',
      firstReading: 'First Reading',
      responsorialPsalm: 'Responsorial Psalm',
      secondReading: 'Second Reading',
      gospelAcclamation: 'Gospel Acclamation',
      gospel: 'Gospel',
      
      // Saint Section
      saintOfTheDay: 'Saint of the Day',
      loadingSaint: 'Loading saint information...',
      refreshSaint: 'Refresh saint information',
      
      // Homily Section
      aiGeneratedHomily: 'AI-Generated Homily',
      poweredByGemini: 'Powered by Google Gemini Pro',
      generateHomily: 'Generate Homily with AI',
      generateHomilyDesc: 'Click to generate a thoughtful homily based on today\'s readings using Google Gemini Pro',
      generatingHomily: 'Generating homily with AI...',
      thisMayTakeAMoment: 'This may take a moment',
      translatingTo: 'Translating to',
      generationFailed: 'Generation Failed',
      regenerate: 'Regenerate',
      generatedOn: 'Generated on',
      at: 'at',
      language: 'Language',
      
      // Quick Stats
      todaysLiturgy: 'Today\'s Liturgy',
      liturgicalSeason: 'Liturgical Season',
      liturgicalColor: 'Liturgical Color',
      rank: 'Rank',
      ordinaryTime: 'Ordinary Time',
      green: 'Green',
      weekday: 'Weekday',
      
      // Footer
      madeWithLove: 'Made with love for the Catholic community',
      readingsCourtesy: 'Daily Mass Companion • Readings courtesy of Universalis',
      scriptureQuote: '"The word of God is living and active" - Hebrews 4:12',
      
      // Error Messages
      failedToLoad: 'Failed to load',
      pleaseRetry: 'Please try again.',
      apiNotConfigured: 'API Key Required',
      apiKeyRequired: 'The AI homily generator is ready to use with Google Gemini Pro.',
      generateThoughtful: 'Generate thoughtful homilies that blend theological depth with practical life applications.',
      
      // Days of the week
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      
      // Months
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December'
    };
  }
}

export const translationService = new TranslationService();