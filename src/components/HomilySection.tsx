import React, { useState } from 'react';
import { Lightbulb, RefreshCw, Sparkles, AlertCircle, Key, ExternalLink } from 'lucide-react';
import { ReadingData, Homily, Language } from '../types';
import { getLanguageName } from '../utils/languages';
import { geminiService } from '../services/geminiService';
import { useTranslation } from '../hooks/useTranslation';

interface HomilySectionProps {
  readings: ReadingData | null;
  selectedLanguage: Language;
}

export function HomilySection({ readings, selectedLanguage }: HomilySectionProps) {
  const [homily, setHomily] = useState<Homily | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const { t } = useTranslation(selectedLanguage);

  const generateHomily = async () => {
    if (!readings) return;

    if (!geminiService.isConfigured()) {
      setError(t('apiNotConfigured'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const content = await geminiService.generateHomily(readings, selectedLanguage);
      
      setHomily({
        content,
        language: selectedLanguage,
        generatedAt: new Date()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate homily. Please try again.');
      console.error('Error generating homily:', err);
    } finally {
      setLoading(false);
    }
  };

  const translateHomily = async (targetLanguage: Language) => {
    if (!homily || !geminiService.isConfigured()) return;

    setTranslating(true);
    setError(null);

    try {
      const translatedContent = await geminiService.translateText(homily.content, targetLanguage);
      
      setHomily({
        content: translatedContent,
        language: targetLanguage,
        generatedAt: new Date()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to translate homily. Please try again.');
      console.error('Error translating homily:', err);
    } finally {
      setTranslating(false);
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    if (homily && homily.language !== newLanguage) {
      translateHomily(newLanguage);
    }
  };

  // Auto-translate when language changes
  React.useEffect(() => {
    handleLanguageChange(selectedLanguage);
  }, [selectedLanguage]);

  if (!readings) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">{t('aiGeneratedHomily')}</h3>
          <p className="text-slate-500">Load today's readings to generate an AI-powered homily</p>
        </div>
      </div>
    );
  }

  if (!geminiService.isConfigured()) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-8">
          <Key className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">{t('apiKeyRequired')}</h3>
          <p className="text-slate-600 mb-4">
            {t('apiKeyRequired')}
          </p>
          <p className="text-slate-500 text-sm">
            {t('generateThoughtful')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-xl font-bold">{t('aiGeneratedHomily')}</h2>
        </div>
        <p className="text-purple-100 text-sm">
          {t('poweredByGemini')} • {getLanguageName(selectedLanguage)}
        </p>
      </div>

      <div className="p-6">
        {!homily && !loading && (
          <div className="text-center py-8">
            <button
              onClick={generateHomily}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              {t('generateHomily')}
            </button>
            <p className="text-slate-500 text-sm mt-3">
              {t('generateHomilyDesc')}
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">{t('generatingHomily')}</p>
            <p className="text-slate-500 text-sm mt-2">{t('thisMayTakeAMoment')}</p>
          </div>
        )}

        {translating && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 mt-3">{t('translatingTo')} {getLanguageName(selectedLanguage)}...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{t('generationFailed')}</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={generateHomily}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('tryAgain')}
            </button>
          </div>
        )}

        {homily && !translating && (
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                {homily.content}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-slate-500">
                {t('generatedOn')} {homily.generatedAt.toLocaleDateString()} {t('at')} {homily.generatedAt.toLocaleTimeString()}
                <br />
                {t('language')}: {getLanguageName(homily.language)}
              </div>
              <button
                onClick={generateHomily}
                disabled={loading}
                className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                {t('regenerate')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}