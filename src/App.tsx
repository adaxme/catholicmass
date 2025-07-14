import React, { useState } from 'react';
import { Cross, Heart } from 'lucide-react';
import { ReadingData, Language } from './types';
import { ReadingsSection } from './components/ReadingsSection';
import { SaintSection } from './components/SaintSection';
import { HomilySection } from './components/HomilySection';
import { LanguageSelector } from './components/LanguageSelector';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const [readings, setReadings] = useState<ReadingData | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [currentDate] = useState(new Date());
  const { t } = useTranslation(selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-amber-900/30 p-3 rounded-full border border-amber-700/50">
                <Cross className="w-8 h-8 text-amber-200" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{t('appTitle')}</h1>
                <p className="text-slate-300 mt-1">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Readings (spans 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <ReadingsSection onReadingsChange={setReadings} language={selectedLanguage} />
          </div>

          {/* Right Column - Saint and Quick Stats */}
          <div className="space-y-8">
            <SaintSection date={currentDate} language={selectedLanguage} />
            
            {/* Quick Stats */}
            <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">{t('todaysLiturgy')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('liturgicalSeason')}</span>
                  <span className="text-slate-200 font-medium">{t('ordinaryTime')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('liturgicalColor')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-slate-200 font-medium">{t('green')}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('rank')}</span>
                  <span className="text-slate-200 font-medium">{t('weekday')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Homily Section - Full Width Below */}
        <div className="mt-8">
          <HomilySection 
            readings={readings} 
            selectedLanguage={selectedLanguage}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-amber-400" />
              <span className="text-slate-300">{t('madeWithLove')}</span>
            </div>
            <p className="text-slate-400 text-sm">
              {t('readingsCourtesy')}
            </p>
            <p className="text-slate-500 text-xs mt-2">
              {t('scriptureQuote')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;